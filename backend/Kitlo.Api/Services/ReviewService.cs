using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Core.Enums;
using Kitlo.Core.Models;
using Kitlo.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Kitlo.Api.Services;

public class ReviewService
{
    private readonly KitloDbContext _db;
    private readonly NotificationService _notifications;
    private static readonly TimeSpan BlindWindow = TimeSpan.FromDays(14);

    public ReviewService(KitloDbContext db, NotificationService notifications)
    {
        _db = db;
        _notifications = notifications;
    }

    public async Task<ReviewDto> SubmitAsync(Guid bookingId, Guid reviewerId, SubmitReviewRequest req, CancellationToken ct)
    {
        if (req.Rating is < 1 or > 5) throw new DomainException("Rating must be 1..5.");

        var booking = await _db.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId, ct)
            ?? throw DomainException.NotFound("Booking");

        if (booking.Status is not (BookingStatus.Returned or BookingStatus.Completed))
            throw new DomainException("Booking must be returned before reviewing.");

        ReviewKind kind;
        Guid revieweeId;
        if (reviewerId == booking.RenterId) { kind = ReviewKind.RenterOfLister; revieweeId = booking.ListerId; }
        else if (reviewerId == booking.ListerId) { kind = ReviewKind.ListerOfRenter; revieweeId = booking.RenterId; }
        else throw DomainException.Forbidden();

        if (await _db.Reviews.AnyAsync(r => r.BookingId == bookingId && r.Kind == kind, ct))
            throw DomainException.Conflict("You've already reviewed this booking.");

        var review = new Review
        {
            BookingId = bookingId,
            ReviewerId = reviewerId,
            RevieweeId = revieweeId,
            ListingId = booking.ListingId,
            Kind = kind,
            Rating = req.Rating,
            Accuracy = req.Accuracy,
            Text = req.Text.Trim(),
            TagsJson = req.Tags is { Count: > 0 } ? JsonSerializer.Serialize(req.Tags) : null,
            SubmittedAt = DateTimeOffset.UtcNow
        };
        _db.Reviews.Add(review);

        // Blind-two-way: reveal both reviews when the second one lands, OR after the 14-day window expires.
        var counterpart = await _db.Reviews.FirstOrDefaultAsync(r => r.BookingId == bookingId && r.Kind != kind, ct);
        if (counterpart is not null)
        {
            counterpart.VisibleAt = DateTimeOffset.UtcNow;
            review.VisibleAt = DateTimeOffset.UtcNow;
        }
        else
        {
            review.VisibleAt = DateTimeOffset.UtcNow.Add(BlindWindow);
        }

        await _db.SaveChangesAsync(ct);
        await UpdateAggregatesAsync(revieweeId, booking.ListingId, ct);

        // Once both reviews are visible, ping the reviewee.
        if (review.VisibleAt is not null && review.VisibleAt <= DateTimeOffset.UtcNow)
        {
            await _notifications.EnqueueAsync(
                revieweeId, NotificationKind.ReviewReceived,
                "New review",
                $"You received a {req.Rating}★ review.",
                $"/dashboard/reviews", ct);
        }

        return await ToDtoAsync(review, ct);
    }

    public async Task<PagedResult<ReviewDto>> GetByListingAsync(Guid listingId, int? page, int? pageSize, CancellationToken ct)
    {
        var (p, ps) = PagingDefaults.Normalize(page, pageSize);
        var q = _db.Reviews
            .Include(r => r.Reviewer)
            .Where(r => r.ListingId == listingId && r.VisibleAt != null && r.VisibleAt <= DateTimeOffset.UtcNow);

        var total = await q.CountAsync(ct);
        var rows = await q.OrderByDescending(r => r.SubmittedAt).Skip((p - 1) * ps).Take(ps).ToListAsync(ct);
        return new PagedResult<ReviewDto>
        {
            Items = rows.Select(r => ToDtoSync(r)).ToList(),
            Total = total, Page = p, PageSize = ps
        };
    }

    public async Task<PagedResult<ReviewDto>> GetByUserAsync(Guid userId, int? page, int? pageSize, CancellationToken ct)
    {
        var (p, ps) = PagingDefaults.Normalize(page, pageSize);
        var q = _db.Reviews
            .Include(r => r.Reviewer)
            .Where(r => r.RevieweeId == userId && r.VisibleAt != null && r.VisibleAt <= DateTimeOffset.UtcNow);

        var total = await q.CountAsync(ct);
        var rows = await q.OrderByDescending(r => r.SubmittedAt).Skip((p - 1) * ps).Take(ps).ToListAsync(ct);
        return new PagedResult<ReviewDto> { Items = rows.Select(ToDtoSync).ToList(), Total = total, Page = p, PageSize = ps };
    }

    private async Task<ReviewDto> ToDtoAsync(Review r, CancellationToken ct)
    {
        if (r.Reviewer is null)
            r.Reviewer = await _db.Users.FindAsync([r.ReviewerId], ct);
        return ToDtoSync(r);
    }

    private static ReviewDto ToDtoSync(Review r)
    {
        IReadOnlyList<string>? tags = null;
        if (!string.IsNullOrEmpty(r.TagsJson))
        {
            try { tags = JsonSerializer.Deserialize<List<string>>(r.TagsJson); }
            catch { tags = null; }
        }
        return new ReviewDto(
            r.Id, r.BookingId,
            r.Reviewer?.Name ?? "",
            r.Reviewer?.AvatarUrl,
            r.SubmittedAt, r.Rating, r.Accuracy, r.Text, tags);
    }

    private async Task UpdateAggregatesAsync(Guid revieweeId, Guid? listingId, CancellationToken ct)
    {
        var visible = _db.Reviews.Where(r => r.RevieweeId == revieweeId && r.VisibleAt != null && r.VisibleAt <= DateTimeOffset.UtcNow);
        var count = await visible.CountAsync(ct);
        var avg = count == 0 ? 0d : await visible.AverageAsync(r => (double)r.Rating, ct);

        if (listingId is not null)
        {
            var listing = await _db.Listings.FindAsync([listingId.Value], ct);
            if (listing is not null)
            {
                listing.RatingAverage = Math.Round(avg, 2);
                listing.RatingCount = count;
                await _db.SaveChangesAsync(ct);
            }
        }
    }
}
