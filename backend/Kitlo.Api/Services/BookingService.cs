using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Core.Enums;
using Kitlo.Core.Models;
using Kitlo.Data;
using Microsoft.EntityFrameworkCore;

namespace Kitlo.Api.Services;

public class BookingService
{
    private readonly KitloDbContext _db;
    private readonly NotificationService _notifications;
    private readonly PayoutService _payouts;
    private readonly MessageService _messages;

    public BookingService(KitloDbContext db, NotificationService notifications, PayoutService payouts, MessageService messages)
    {
        _db = db;
        _notifications = notifications;
        _payouts = payouts;
        _messages = messages;
    }

    public async Task<PagedResult<BookingSummaryDto>> ListAsync(
        Guid userId, string? roleFilter, BookingStatus[]? statuses, int? page, int? pageSize, CancellationToken ct)
    {
        var (p, ps) = PagingDefaults.Normalize(page, pageSize);
        IQueryable<Booking> q = _db.Bookings
            .Include(b => b.Listing).ThenInclude(l => l!.Photos)
            .Include(b => b.Renter)
            .Include(b => b.Lister);

        if (roleFilter == "renter") q = q.Where(b => b.RenterId == userId);
        else if (roleFilter == "lister") q = q.Where(b => b.ListerId == userId);
        else q = q.Where(b => b.RenterId == userId || b.ListerId == userId);

        if (statuses is { Length: > 0 }) q = q.Where(b => statuses.Contains(b.Status));

        var total = await q.CountAsync(ct);
        var rows = await q
            .OrderByDescending(b => b.StartDate)
            .Skip((p - 1) * ps).Take(ps)
            .ToListAsync(ct);

        var items = rows.Select(b => ToSummary(b, userId)).ToList();
        return new PagedResult<BookingSummaryDto> { Items = items, Total = total, Page = p, PageSize = ps };
    }

    public async Task<Booking> GetAsync(Guid bookingId, Guid actorId, CancellationToken ct)
    {
        var booking = await _db.Bookings
            .Include(b => b.Listing).ThenInclude(l => l!.Photos)
            .Include(b => b.Renter).Include(b => b.Lister)
            .Include(b => b.Events.OrderBy(e => e.OccurredAt))
            .FirstOrDefaultAsync(b => b.Id == bookingId, ct)
            ?? throw DomainException.NotFound("Booking");

        if (booking.RenterId != actorId && booking.ListerId != actorId)
            throw DomainException.Forbidden();
        return booking;
    }

    public async Task<Booking> CreateAsync(Guid renterId, CreateBookingRequest req, CancellationToken ct)
    {
        if (req.EndDate <= req.StartDate)
            throw new DomainException("End date must come after start date.");

        var listing = await _db.Listings
            .Include(l => l.AvailabilityBlocks)
            .FirstOrDefaultAsync(l => l.Id == req.ListingId, ct)
            ?? throw DomainException.NotFound("Listing");

        if (listing.Status != ListingStatus.Published)
            throw new DomainException("Listing is not available.");

        if (listing.ListerId == renterId)
            throw new DomainException("You can't book your own listing.");

        var conflict = listing.AvailabilityBlocks.Any(a =>
            a.StartDate < req.EndDate && a.EndDate > req.StartDate);
        if (conflict) throw DomainException.Conflict("Those dates are unavailable.");

        var days = req.EndDate.DayNumber - req.StartDate.DayNumber;
        var rental = listing.DailyRateCents * days;
        var deposit = listing.DepositCents ?? 0;
        var fee = (int)Math.Round(rental * (listing.ServiceFeeBp / 10_000d));
        var total = rental + deposit + fee;

        var booking = new Booking
        {
            ListingId = listing.Id,
            ListerId = listing.ListerId,
            RenterId = renterId,
            StartDate = req.StartDate,
            EndDate = req.EndDate,
            RentalCents = rental,
            DepositCents = deposit,
            PlatformFeeCents = fee,
            TotalCents = total,
            Status = BookingStatus.Pending,
            CancellationPolicy = listing.CancellationPolicy,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };
        booking.Events.Add(new BookingEvent
        {
            Kind = BookingEventKind.Created,
            Label = "Booking requested",
            ActorUserId = renterId
        });
        _db.Bookings.Add(booking);

        // Reserve the dates so a concurrent renter can't double-book.
        _db.AvailabilityBlocks.Add(new AvailabilityBlock
        {
            ListingId = listing.Id,
            StartDate = req.StartDate,
            EndDate = req.EndDate,
            Reason = AvailabilityReason.Booked,
            BookingId = booking.Id
        });

        await _db.SaveChangesAsync(ct);

        // Auto-create a message thread between renter and lister so they can
        // coordinate pickup. Idempotent in practice — Create runs once per booking.
        var thread = await _messages.StartThreadAsync(
            new[] { renterId, listing.ListerId }, booking.Id, listing.Id, ct);

        // Notify the lister that a new request landed.
        await _notifications.EnqueueAsync(
            listing.ListerId, NotificationKind.BookingRequest,
            "New booking request",
            $"{req.StartDate:MMM d} → {req.EndDate:MMM d}",
            $"/dashboard/bookings/{booking.Id}", ct);

        return booking;
    }

    public async Task<Booking> TransitionAsync(Guid bookingId, Guid actorId, string action, string? reason, CancellationToken ct)
    {
        var booking = await GetAsync(bookingId, actorId, ct);
        var now = DateTimeOffset.UtcNow;

        // Recipients of post-transition notifications.
        Guid? notifyUserId = null;
        NotificationKind? notifyKind = null;
        string? notifyTitle = null;
        string? notifyBody = null;
        var notifyLink = $"/dashboard/bookings/{booking.Id}";

        bool createPayout = false;

        switch (action.ToLowerInvariant())
        {
            case "confirm":
                if (actorId != booking.ListerId) throw DomainException.Forbidden("Only the lister can confirm.");
                if (booking.Status != BookingStatus.Pending) throw new DomainException("Only pending bookings can be confirmed.");
                booking.Status = BookingStatus.Confirmed;
                booking.ConfirmedAt = now;
                booking.Events.Add(new BookingEvent { BookingId = booking.Id, Kind = BookingEventKind.Confirmed, Label = "Confirmed by lister", ActorUserId = actorId });
                notifyUserId = booking.RenterId;
                notifyKind = NotificationKind.BookingConfirmed;
                notifyTitle = "Booking confirmed";
                notifyBody = $"{booking.StartDate:MMM d} → {booking.EndDate:MMM d}";
                break;
            case "pickup":
                if (booking.Status != BookingStatus.Confirmed) throw new DomainException("Only confirmed bookings can transition to active.");
                booking.Status = BookingStatus.Active;
                booking.PickupConfirmedAt = now;
                booking.Events.Add(new BookingEvent { BookingId = booking.Id, Kind = BookingEventKind.PickupConfirmed, Label = "Pickup confirmed", ActorUserId = actorId });
                // Notify the other party.
                notifyUserId = actorId == booking.RenterId ? booking.ListerId : booking.RenterId;
                notifyKind = NotificationKind.BookingReminder;
                notifyTitle = "Pickup confirmed";
                notifyBody = "Rental is now active.";
                break;
            case "return":
                if (booking.Status != BookingStatus.Active) throw new DomainException("Only active bookings can be returned.");
                booking.Status = BookingStatus.Returned;
                booking.ReturnConfirmedAt = now;
                booking.Events.Add(new BookingEvent { BookingId = booking.Id, Kind = BookingEventKind.ReturnConfirmed, Label = "Return confirmed", ActorUserId = actorId });
                notifyUserId = actorId == booking.RenterId ? booking.ListerId : booking.RenterId;
                notifyKind = NotificationKind.BookingReminder;
                notifyTitle = "Return confirmed";
                notifyBody = "Awaiting other party to confirm before funds release.";
                break;
            case "complete":
                if (booking.Status != BookingStatus.Returned) throw new DomainException("Only returned bookings can be completed.");
                booking.Status = BookingStatus.Completed;
                createPayout = true;
                notifyUserId = booking.ListerId;
                notifyKind = NotificationKind.PayoutReleased;
                notifyTitle = "Payout scheduled";
                notifyBody = "Funds released. Payout is on its way.";
                break;
            case "cancel":
                if (booking.Status is BookingStatus.Returned or BookingStatus.Completed)
                    throw new DomainException("Booking has already finished.");
                booking.Status = BookingStatus.Cancelled;
                booking.CancelledAt = now;
                booking.CancelReason = reason;
                booking.Events.Add(new BookingEvent { BookingId = booking.Id, Kind = BookingEventKind.Cancelled, Label = "Cancelled", Detail = reason, ActorUserId = actorId });
                // Free the reservation
                var holds = await _db.AvailabilityBlocks
                    .Where(a => a.BookingId == booking.Id)
                    .ToListAsync(ct);
                _db.AvailabilityBlocks.RemoveRange(holds);
                notifyUserId = actorId == booking.RenterId ? booking.ListerId : booking.RenterId;
                notifyKind = NotificationKind.System;
                notifyTitle = "Booking cancelled";
                notifyBody = reason ?? "The other party cancelled.";
                break;
            default:
                throw new DomainException($"Unknown action '{action}'.");
        }

        booking.UpdatedAt = now;
        await _db.SaveChangesAsync(ct);

        if (createPayout)
        {
            // Best-effort — payout creation has its own validation and will throw
            // a DomainException on conflict (already exists).
            try { await _payouts.CreatePayoutAsync(booking.Id, ct); }
            catch (DomainException) { /* already exists, ignore */ }
        }

        if (notifyUserId is { } uid && notifyKind is { } kind && notifyTitle is { } title && notifyBody is { } body)
        {
            await _notifications.EnqueueAsync(uid, kind, title, body, notifyLink, ct);
        }

        return booking;
    }

    public static BookingSummaryDto ToSummary(Booking b, Guid viewerId)
    {
        var counterparty = viewerId == b.RenterId ? b.Lister : b.Renter;
        var hero = b.Listing?.Photos.OrderByDescending(p => p.IsHero).ThenBy(p => p.Ordinal).FirstOrDefault();
        return new BookingSummaryDto(
            b.Id, b.Status, b.StartDate, b.EndDate,
            b.Listing?.Title ?? "", hero?.Url ?? "",
            counterparty?.Name ?? "", counterparty?.AvatarUrl,
            b.TotalCents);
    }

    public static IReadOnlyList<BookingTimelineEventDto> ToTimeline(Booking b)
    {
        var now = DateTimeOffset.UtcNow;
        return b.Events
            .OrderBy(e => e.OccurredAt)
            .Select(e =>
            {
                var state = e.OccurredAt > now.AddSeconds(-30) ? "now" : "done";
                return new BookingTimelineEventDto(e.Id, e.Label, e.Detail, e.OccurredAt, state);
            })
            .ToList();
    }
}
