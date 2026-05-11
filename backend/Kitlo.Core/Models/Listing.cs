using System.ComponentModel.DataAnnotations;
using Kitlo.Core.Enums;

namespace Kitlo.Core.Models;

public class Listing
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, MaxLength(140)]
    public string Title { get; set; } = string.Empty;

    public Vertical Vertical { get; set; }

    public GearType GearType { get; set; }

    /// <summary>User-authored display text for the gear category. Kept alongside the enum
    /// because listers sometimes phrase a category more naturally ("12V drawer fridge"
    /// vs the enum's "Fridge12V"). Revisit removal once the UI can derive labels from
    /// <see cref="GearType"/> alone.</summary>
    [Required, MaxLength(60)]
    public string GearTypeLabel { get; set; } = string.Empty;

    public Condition Condition { get; set; }

    [MaxLength(4000)]
    public string Description { get; set; } = string.Empty;

    [Required, MaxLength(10)]
    public string PickupZip { get; set; } = string.Empty;

    /// <summary>Per-day rental price in US cents.</summary>
    public int DailyRateCents { get; set; }
    /// <summary>Refundable damage deposit in US cents. Null = no deposit required.</summary>
    public int? DepositCents { get; set; }
    /// <summary>Service fee in basis points (e.g. 500 = 5%). Phase 1 launch pricing per docs/business-plan.md.</summary>
    public int ServiceFeeBp { get; set; } = 500;

    public CancellationPolicy CancellationPolicy { get; set; } = CancellationPolicy.Moderate;

    public ListingStatus Status { get; set; } = ListingStatus.Draft;

    public bool IsBundle { get; set; }

    public Guid ListerId { get; set; }
    public User? Lister { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? PublishedAt { get; set; }
    public DateTimeOffset? ArchivedAt { get; set; }

    // Cached aggregates (kept in sync server-side; OK to be stale momentarily)
    public double RatingAverage { get; set; }
    public int RatingCount { get; set; }

    // Navigation
    public ICollection<ListingPhoto> Photos { get; set; } = [];
    public ICollection<ListingSpec> Specs { get; set; } = [];
    public ICollection<AvailabilityBlock> AvailabilityBlocks { get; set; } = [];
    public ICollection<BundleItem> BundleItems { get; set; } = [];
}

public class ListingPhoto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ListingId { get; set; }
    public Listing? Listing { get; set; }

    [Required, MaxLength(500)]
    public string Url { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Alt { get; set; }

    public bool IsHero { get; set; }
    public int Ordinal { get; set; }
}

public class ListingSpec
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ListingId { get; set; }
    public Listing? Listing { get; set; }

    [Required, MaxLength(80)]
    public string Key { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Value { get; set; } = string.Empty;

    public int Ordinal { get; set; }
}

/// <summary>Join entity linking a parent bundle listing to its child listings.</summary>
public class BundleItem
{
    public Guid BundleListingId { get; set; }
    public Listing? BundleListing { get; set; }

    public Guid ChildListingId { get; set; }
    public Listing? ChildListing { get; set; }
}

public class AvailabilityBlock
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ListingId { get; set; }
    public Listing? Listing { get; set; }

    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public AvailabilityReason Reason { get; set; }

    public Guid? BookingId { get; set; }
    public Booking? Booking { get; set; }
}
