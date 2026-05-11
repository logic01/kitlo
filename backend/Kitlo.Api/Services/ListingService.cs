using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Core.Catalogue;
using Kitlo.Core.Enums;
using Kitlo.Core.Models;
using Kitlo.Data;
using Microsoft.EntityFrameworkCore;

namespace Kitlo.Api.Services;

public class ListingService
{
    private readonly KitloDbContext _db;
    public ListingService(KitloDbContext db) => _db = db;

    public async Task<PagedResult<ListingSummaryDto>> SearchAsync(
        Vertical? vertical,
        GearType? gearType,
        Condition[]? conditions,
        int? minPriceCents,
        int? maxPriceCents,
        bool verifiedOnly,
        string? location,
        string? sort,
        Guid? listerId,
        bool includeUnpublished,
        int? page,
        int? pageSize,
        CancellationToken ct)
    {
        var (p, ps) = PagingDefaults.Normalize(page, pageSize);

        IQueryable<Listing> q = _db.Listings
            .Include(l => l.Photos)
            .Include(l => l.Lister)
            .AsQueryable();

        // Owner-scoped queries can see drafts/paused; public search is published-only.
        if (!includeUnpublished)
            q = q.Where(l => l.Status == ListingStatus.Published);

        if (listerId is not null) q = q.Where(l => l.ListerId == listerId);
        if (vertical is not null) q = q.Where(l => l.Vertical == vertical);
        if (gearType is not null) q = q.Where(l => l.GearType == gearType);
        if (conditions is { Length: > 0 }) q = q.Where(l => conditions.Contains(l.Condition));
        if (minPriceCents is not null) q = q.Where(l => l.DailyRateCents >= minPriceCents);
        if (maxPriceCents is not null) q = q.Where(l => l.DailyRateCents <= maxPriceCents);
        if (verifiedOnly) q = q.Where(l => l.Lister!.IdentityVerified);
        if (!string.IsNullOrWhiteSpace(location))
        {
            var loc = location.Trim();
            q = q.Where(l => l.PickupZip.StartsWith(loc));
        }

        q = sort switch
        {
            "price-asc" => q.OrderBy(l => l.DailyRateCents),
            "price-desc" => q.OrderByDescending(l => l.DailyRateCents),
            "rating" => q.OrderByDescending(l => l.RatingAverage).ThenByDescending(l => l.RatingCount),
            "newest" => q.OrderByDescending(l => l.PublishedAt ?? l.CreatedAt),
            _ => q.OrderByDescending(l => l.RatingCount).ThenByDescending(l => l.RatingAverage)
        };

        var total = await q.CountAsync(ct);
        var items = await q
            .Skip((p - 1) * ps)
            .Take(ps)
            .Select(l => ToSummary(l))
            .ToListAsync(ct);

        return new PagedResult<ListingSummaryDto>
        {
            Items = items, Total = total, Page = p, PageSize = ps
        };
    }

    public async Task<ListingDto> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var l = await _db.Listings
            .Include(x => x.Photos)
            .Include(x => x.Specs)
            .Include(x => x.Lister)
            .Include(x => x.BundleItems)
            .FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw DomainException.NotFound("Listing");
        return ToDto(l);
    }

    public async Task<ListingDto> CreateDraftAsync(Guid listerId, CreateListingRequest req, CancellationToken ct)
    {
        var lister = await _db.Users.FindAsync([listerId], ct)
            ?? throw DomainException.NotFound("Lister");

        if (!VerticalRules.IsValid(req.Vertical, req.GearType))
            throw new DomainException($"Gear type '{req.GearType}' is not valid for vertical '{req.Vertical}'.");

        var listing = new Listing
        {
            Title = req.Title.Trim(),
            Vertical = req.Vertical,
            GearType = req.GearType,
            GearTypeLabel = req.GearTypeLabel.Trim(),
            Condition = req.Condition,
            PickupZip = req.PickupZip.Trim(),
            Description = req.Description?.Trim() ?? "",
            DailyRateCents = req.DailyRateCents ?? 0,
            DepositCents = req.DepositCents,
            CancellationPolicy = req.CancellationPolicy ?? CancellationPolicy.Moderate,
            IsBundle = req.IsBundle,
            ListerId = listerId,
            Status = ListingStatus.Draft,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };
        _db.Listings.Add(listing);
        await _db.SaveChangesAsync(ct);
        listing.Lister = lister;
        return ToDto(listing);
    }

    public async Task<ListingDto> UpdateAsync(Guid id, Guid actorId, UpdateListingRequest req, CancellationToken ct)
    {
        var listing = await _db.Listings
            .Include(l => l.Lister)
            .Include(l => l.Photos)
            .Include(l => l.Specs)
            .Include(l => l.BundleItems)
            .FirstOrDefaultAsync(l => l.Id == id, ct)
            ?? throw DomainException.NotFound("Listing");
        if (listing.ListerId != actorId)
            throw DomainException.Forbidden("You can only edit your own listings.");

        if (req.Title is not null) listing.Title = req.Title.Trim();
        if (req.Description is not null) listing.Description = req.Description.Trim();
        if (req.DailyRateCents is not null) listing.DailyRateCents = req.DailyRateCents.Value;
        if (req.DepositCents is not null) listing.DepositCents = req.DepositCents;
        if (req.CancellationPolicy is not null) listing.CancellationPolicy = req.CancellationPolicy.Value;
        if (req.Condition is not null) listing.Condition = req.Condition.Value;
        if (req.PickupZip is not null) listing.PickupZip = req.PickupZip.Trim();
        if (req.Vertical is not null) listing.Vertical = req.Vertical.Value;
        if (req.GearType is not null) listing.GearType = req.GearType.Value;
        if (req.GearTypeLabel is not null) listing.GearTypeLabel = req.GearTypeLabel.Trim();
        // Validate the (vertical, gear-type) combo whenever either is touched.
        if (req.Vertical is not null || req.GearType is not null)
        {
            if (!VerticalRules.IsValid(listing.Vertical, listing.GearType))
                throw new DomainException($"Gear type '{listing.GearType}' is not valid for vertical '{listing.Vertical}'.");
        }
        if (req.IsBundle is not null) listing.IsBundle = req.IsBundle.Value;
        if (req.BundleListingIds is not null)
        {
            // Validate all referenced listings belong to the same lister.
            var ownedIds = await _db.Listings
                .Where(l => req.BundleListingIds.Contains(l.Id) && l.ListerId == actorId)
                .Select(l => l.Id)
                .ToListAsync(ct);
            if (ownedIds.Count != req.BundleListingIds.Count)
                throw new DomainException("Bundle children must be listings you own.");

            var current = await _db.Set<BundleItem>().Where(b => b.BundleListingId == id).ToListAsync(ct);
            _db.Set<BundleItem>().RemoveRange(current);
            foreach (var childId in req.BundleListingIds.Distinct())
            {
                _db.Set<BundleItem>().Add(new BundleItem
                {
                    BundleListingId = id,
                    ChildListingId = childId
                });
            }
            listing.IsBundle = true;
        }
        listing.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync(ct);
        return ToDto(listing);
    }

    public async Task<ListingDto> PublishAsync(Guid id, Guid actorId, CancellationToken ct)
    {
        var listing = await _db.Listings.Include(l => l.Lister).Include(l => l.Photos).Include(l => l.Specs).FirstOrDefaultAsync(l => l.Id == id, ct)
            ?? throw DomainException.NotFound("Listing");
        if (listing.ListerId != actorId) throw DomainException.Forbidden();

        if (listing.Photos.Count < 3)
            throw new DomainException("At least 3 photos required to publish.");
        if (listing.DailyRateCents <= 0)
            throw new DomainException("Daily rate must be greater than $0.");
        if (string.IsNullOrWhiteSpace(listing.Title))
            throw new DomainException("Title is required.");
        if (!VerticalRules.IsValid(listing.Vertical, listing.GearType))
            throw new DomainException($"Gear type '{listing.GearType}' is not valid for vertical '{listing.Vertical}'.");

        listing.Status = ListingStatus.Published;
        listing.PublishedAt = DateTimeOffset.UtcNow;
        listing.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync(ct);
        return ToDto(listing);
    }

    public async Task DeleteAsync(Guid id, Guid actorId, CancellationToken ct)
    {
        var listing = await _db.Listings.FindAsync([id], ct)
            ?? throw DomainException.NotFound("Listing");
        if (listing.ListerId != actorId) throw DomainException.Forbidden();
        listing.Status = ListingStatus.Archived;
        listing.ArchivedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync(ct);
    }

    public async Task<ListingPhotoDto> AddPhotoAsync(Guid listingId, Guid actorId, ListingPhotoUploadRequest req, CancellationToken ct)
    {
        var listing = await _db.Listings.Include(l => l.Photos).FirstOrDefaultAsync(l => l.Id == listingId, ct)
            ?? throw DomainException.NotFound("Listing");
        if (listing.ListerId != actorId) throw DomainException.Forbidden();

        var photo = new ListingPhoto
        {
            ListingId = listingId,
            Url = req.Url,
            Alt = req.Alt,
            IsHero = req.IsHero || listing.Photos.Count == 0,
            Ordinal = listing.Photos.Count
        };
        if (photo.IsHero)
        {
            foreach (var p in listing.Photos) p.IsHero = false;
        }
        listing.Photos.Add(photo);
        await _db.SaveChangesAsync(ct);
        return new ListingPhotoDto(photo.Id, photo.Url, photo.Alt, photo.IsHero);
    }

    public async Task<IReadOnlyList<AvailabilityBlock>> GetAvailabilityAsync(Guid listingId, CancellationToken ct)
    {
        return await _db.AvailabilityBlocks
            .Where(a => a.ListingId == listingId)
            .OrderBy(a => a.StartDate)
            .ToListAsync(ct);
    }

    public static ListingSummaryDto ToSummary(Listing l)
    {
        var hero = l.Photos.OrderByDescending(p => p.IsHero).ThenBy(p => p.Ordinal).FirstOrDefault();
        return new ListingSummaryDto(
            l.Id, l.Title, l.Vertical, l.GearType, l.GearTypeLabel, l.Condition,
            l.DailyRateCents, l.PickupZip,
            hero?.Url ?? "",
            l.ListerId,
            l.Lister?.Name ?? "",
            l.Lister?.IdentityVerified ?? false,
            l.IsBundle,
            l.RatingAverage,
            l.RatingCount,
            l.Status);
    }

    public static ListingDto ToDto(Listing l)
    {
        return new ListingDto(
            l.Id, l.Title, l.Vertical, l.GearType, l.GearTypeLabel, l.Condition,
            l.DailyRateCents, l.DepositCents, l.ServiceFeeBp, l.CancellationPolicy,
            l.PickupZip, l.Description, l.Status, l.IsBundle,
            l.ListerId, l.Lister?.Name ?? "", l.Lister?.IdentityVerified ?? false,
            l.RatingAverage, l.RatingCount,
            l.Photos.OrderBy(p => p.Ordinal).Select(p => new ListingPhotoDto(p.Id, p.Url, p.Alt, p.IsHero)).ToList(),
            l.Specs.OrderBy(s => s.Ordinal).Select(s => new ListingSpecDto(s.Key, s.Value)).ToList(),
            l.IsBundle ? l.BundleItems.Select(b => b.ChildListingId).ToList() : null);
    }
}
