using System.ComponentModel.DataAnnotations;
using Kitlo.Core.Enums;

namespace Kitlo.Core.Models;

public class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ListingId { get; set; }
    public Listing? Listing { get; set; }

    public Guid RenterId { get; set; }
    public User? Renter { get; set; }

    public Guid ListerId { get; set; }
    public User? Lister { get; set; }

    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }

    public int RentalCents { get; set; }
    public int DepositCents { get; set; }
    public int PlatformFeeCents { get; set; }
    public int TotalCents { get; set; }

    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public CancellationPolicy CancellationPolicy { get; set; } = CancellationPolicy.Moderate;

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? ConfirmedAt { get; set; }
    public DateTimeOffset? PickupConfirmedAt { get; set; }
    public DateTimeOffset? ReturnConfirmedAt { get; set; }
    public DateTimeOffset? CancelledAt { get; set; }
    [MaxLength(500)]
    public string? CancelReason { get; set; }

    // Navigation
    public ICollection<BookingEvent> Events { get; set; } = [];
    public ICollection<Payment> Payments { get; set; } = [];
    public Payout? Payout { get; set; }
    public Dispute? Dispute { get; set; }
    public ICollection<Review> Reviews { get; set; } = [];
}

public class BookingEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BookingId { get; set; }
    public Booking? Booking { get; set; }

    public BookingEventKind Kind { get; set; }

    [Required, MaxLength(120)]
    public string Label { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Detail { get; set; }

    public Guid? ActorUserId { get; set; }
    public DateTimeOffset OccurredAt { get; set; } = DateTimeOffset.UtcNow;
}
