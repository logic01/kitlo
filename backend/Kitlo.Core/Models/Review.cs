using System.ComponentModel.DataAnnotations;
using Kitlo.Core.Enums;

namespace Kitlo.Core.Models;

public class Review
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid BookingId { get; set; }
    public Booking? Booking { get; set; }

    public Guid ReviewerId { get; set; }
    public User? Reviewer { get; set; }

    public Guid RevieweeId { get; set; }
    public User? Reviewee { get; set; }

    public Guid? ListingId { get; set; }
    public Listing? Listing { get; set; }

    public ReviewKind Kind { get; set; }
    public int Rating { get; set; } // 1..5
    public ReviewAccuracy? Accuracy { get; set; }

    [MaxLength(2000)]
    public string Text { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? TagsJson { get; set; }

    public DateTimeOffset SubmittedAt { get; set; } = DateTimeOffset.UtcNow;
    /// <summary>Blind two-way: review visible only after both parties submit OR after the 14-day window expires.</summary>
    public DateTimeOffset? VisibleAt { get; set; }
}
