using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Core.Enums;
using Kitlo.Core.Models;
using Kitlo.Data;
using Microsoft.EntityFrameworkCore;

namespace Kitlo.Api.Services;

public class PayoutService
{
    private readonly KitloDbContext _db;
    public PayoutService(KitloDbContext db) => _db = db;

    public async Task<PagedResult<PayoutDto>> ListAsync(Guid listerId, int? page, int? pageSize, CancellationToken ct)
    {
        var (p, ps) = PagingDefaults.Normalize(page, pageSize);
        var q = _db.Payouts
            .Include(x => x.Booking).ThenInclude(b => b!.Listing)
            .Where(x => x.ListerId == listerId);

        var total = await q.CountAsync(ct);
        var rows = await q.OrderByDescending(x => x.ScheduledFor).Skip((p - 1) * ps).Take(ps).ToListAsync(ct);
        return new PagedResult<PayoutDto>
        {
            Items = rows.Select(ToDto).ToList(),
            Total = total, Page = p, PageSize = ps
        };
    }

    public async Task<EarningsSummaryDto> SummaryAsync(Guid listerId, CancellationToken ct)
    {
        var monthStart = new DateTimeOffset(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, TimeSpan.Zero);
        var payouts = _db.Payouts.Where(p => p.ListerId == listerId);

        long lifetime = await payouts.Where(p => p.Status == PayoutStatus.Paid).SumAsync(p => (long)p.NetCents, ct);
        long pending = await payouts.Where(p => p.Status != PayoutStatus.Paid && p.Status != PayoutStatus.Failed).SumAsync(p => (long)p.NetCents, ct);
        long thisMonth = await payouts.Where(p => p.PaidAt != null && p.PaidAt >= monthStart).SumAsync(p => (long)p.NetCents, ct);

        var bookings = _db.Bookings.Where(b => b.ListerId == listerId && b.Status == BookingStatus.Completed);
        var bookingsCount = await bookings.CountAsync(ct);
        var avgDaily = bookingsCount == 0 ? 0 : (int)await bookings.AverageAsync(b =>
            (double)b.RentalCents / (b.EndDate.DayNumber - b.StartDate.DayNumber == 0 ? 1 : b.EndDate.DayNumber - b.StartDate.DayNumber), ct);

        return new EarningsSummaryDto(lifetime, pending, thisMonth, bookingsCount, avgDaily);
    }

    public async Task<Payout> CreatePayoutAsync(Guid bookingId, CancellationToken ct)
    {
        var booking = await _db.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId, ct)
            ?? throw DomainException.NotFound("Booking");
        if (booking.Status != BookingStatus.Returned && booking.Status != BookingStatus.Completed)
            throw new DomainException("Payouts release only after return.");

        if (await _db.Payouts.AnyAsync(p => p.BookingId == bookingId, ct))
            throw DomainException.Conflict("Payout already exists for this booking.");

        var gross = booking.RentalCents;
        var fee = booking.PlatformFeeCents;
        var net = gross - fee;
        var payout = new Payout
        {
            BookingId = booking.Id,
            ListerId = booking.ListerId,
            GrossCents = gross,
            PlatformFeeCents = fee,
            NetCents = net,
            Status = PayoutStatus.Scheduled,
            ScheduledFor = DateTimeOffset.UtcNow.AddDays(2)
        };
        _db.Payouts.Add(payout);
        booking.Events.Add(new BookingEvent
        {
            BookingId = booking.Id,
            Kind = BookingEventKind.PayoutReleased,
            Label = "Payout scheduled",
            Detail = $"${net / 100m:F2}",
            ActorUserId = null
        });
        await _db.SaveChangesAsync(ct);
        return payout;
    }

    public async Task<string> ExportCsvAsync(Guid listerId, CancellationToken ct)
    {
        var rows = await _db.Payouts
            .Include(p => p.Booking).ThenInclude(b => b!.Listing)
            .Where(p => p.ListerId == listerId)
            .OrderByDescending(p => p.ScheduledFor)
            .ToListAsync(ct);

        var sb = new System.Text.StringBuilder();
        sb.AppendLine("id,bookingId,listingTitle,gross,fee,net,status,scheduledFor,paidAt,bankLast4");
        foreach (var p in rows)
        {
            sb.Append(p.Id).Append(',')
              .Append(p.BookingId).Append(',')
              .Append('"').Append((p.Booking?.Listing?.Title ?? "").Replace("\"", "\"\"")).Append("\",")
              .Append(p.GrossCents).Append(',')
              .Append(p.PlatformFeeCents).Append(',')
              .Append(p.NetCents).Append(',')
              .Append(p.Status).Append(',')
              .Append(p.ScheduledFor.ToString("o")).Append(',')
              .Append(p.PaidAt?.ToString("o") ?? "").Append(',')
              .Append(p.BankLast4 ?? "").AppendLine();
        }
        return sb.ToString();
    }

    public static PayoutDto ToDto(Payout p)
    {
        var days = p.Booking is null ? 0 : p.Booking.EndDate.DayNumber - p.Booking.StartDate.DayNumber;
        return new PayoutDto(
            p.Id, p.BookingId,
            p.Booking?.Listing?.Title ?? "",
            days, p.GrossCents, p.PlatformFeeCents, p.NetCents,
            p.Status, p.ScheduledFor, p.PaidAt, p.BankLast4);
    }
}
