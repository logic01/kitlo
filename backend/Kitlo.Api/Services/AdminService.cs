using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Core.Enums;
using Kitlo.Core.Models;
using Kitlo.Data;
using Microsoft.EntityFrameworkCore;

namespace Kitlo.Api.Services;

public class AdminService
{
    private readonly KitloDbContext _db;
    public AdminService(KitloDbContext db) => _db = db;

    public async Task<AdminStatsDto> StatsAsync(CancellationToken ct)
    {
        var listings = await _db.Listings.CountAsync(l => l.Status == ListingStatus.PendingReview, ct);
        var disputes = await _db.Disputes.CountAsync(d => d.Status != DisputeStatus.Resolved && d.Status != DisputeStatus.Closed, ct);
        var verifications = await _db.Users.CountAsync(u => !u.IdentityVerified && u.Role == UserRole.Lister, ct);
        return new AdminStatsDto(listings, disputes, verifications);
    }

    public async Task<IReadOnlyList<AdminQueueItemDto>> ListingQueueAsync(CancellationToken ct)
    {
        var listings = await _db.Listings
            .Include(l => l.Lister)
            .Where(l => l.Status == ListingStatus.PendingReview)
            .OrderBy(l => l.UpdatedAt)
            .ToListAsync(ct);

        var now = DateTimeOffset.UtcNow;
        return listings.Select(l =>
        {
            var hoursElapsed = (now - l.UpdatedAt).TotalHours;
            var sla = Math.Max(0, (int)Math.Ceiling(24 - hoursElapsed));
            var reason = l.DailyRateCents >= 25_000 ? "high-value" : "flagged";
            return new AdminQueueItemDto(
                l.Id, l.Title,
                new[] { l.Lister?.Name ?? "—", $"${l.DailyRateCents / 100m:F0}/day" },
                reason,
                reason == "high-value" ? "High value" : "Flagged",
                sla);
        }).ToList();
    }

    public async Task ApproveListingAsync(Guid listingId, Guid adminId, CancellationToken ct)
    {
        var listing = await _db.Listings.FindAsync([listingId], ct)
            ?? throw DomainException.NotFound("Listing");
        listing.Status = ListingStatus.Published;
        listing.PublishedAt = DateTimeOffset.UtcNow;
        _db.AdminActions.Add(new AdminAction
        {
            AdminUserId = adminId,
            Kind = AdminActionKind.ApproveListing,
            TargetListingId = listingId
        });
        await _db.SaveChangesAsync(ct);
    }

    public async Task RejectListingAsync(Guid listingId, Guid adminId, string note, CancellationToken ct)
    {
        var listing = await _db.Listings.FindAsync([listingId], ct)
            ?? throw DomainException.NotFound("Listing");
        listing.Status = ListingStatus.Rejected;
        _db.AdminActions.Add(new AdminAction
        {
            AdminUserId = adminId,
            Kind = AdminActionKind.RejectListing,
            TargetListingId = listingId,
            Note = note
        });
        await _db.SaveChangesAsync(ct);
    }

    public async Task<UserDto> ApplyUserActionAsync(Guid userId, Guid adminId, UserAdminActionRequest req, CancellationToken ct)
    {
        var user = await _db.Users.FindAsync([userId], ct)
            ?? throw DomainException.NotFound("User");

        AdminActionKind kind;
        switch (req.Action.ToLowerInvariant())
        {
            case "warn": kind = AdminActionKind.Warn; break;
            case "restrict": user.Status = UserStatus.Restricted; kind = AdminActionKind.Restrict; break;
            case "suspend": user.Status = UserStatus.Suspended; kind = AdminActionKind.Suspend; break;
            case "ban": user.Status = UserStatus.Banned; kind = AdminActionKind.Ban; break;
            case "reinstate": user.Status = UserStatus.Active; kind = AdminActionKind.Reinstate; break;
            default: throw new DomainException($"Unknown action '{req.Action}'.");
        }

        _db.AdminActions.Add(new AdminAction
        {
            AdminUserId = adminId,
            Kind = kind,
            TargetUserId = userId,
            Note = req.Note
        });
        await _db.SaveChangesAsync(ct);
        return UserService.ToDto(user);
    }

    public async Task<UserDto> GetUserAsync(Guid id, CancellationToken ct)
    {
        var user = await _db.Users.FindAsync([id], ct)
            ?? throw DomainException.NotFound("User");
        return UserService.ToDto(user);
    }

    public async Task<PagedResult<UserDto>> SearchUsersAsync(string? q, int? page, int? pageSize, CancellationToken ct)
    {
        var (p, ps) = PagingDefaults.Normalize(page, pageSize);
        IQueryable<User> users = _db.Users;
        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim().ToLowerInvariant();
            users = users.Where(u => u.Email.Contains(term) || u.Name.ToLower().Contains(term));
        }
        var total = await users.CountAsync(ct);
        var rows = await users.OrderBy(u => u.Name).Skip((p - 1) * ps).Take(ps).ToListAsync(ct);
        return new PagedResult<UserDto>
        {
            Items = rows.Select(UserService.ToDto).ToList(),
            Total = total, Page = p, PageSize = ps
        };
    }
}
