using System.ComponentModel.DataAnnotations;
using Kitlo.Core.Enums;

namespace Kitlo.Core.Models;

public class Payment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BookingId { get; set; }
    public Booking? Booking { get; set; }

    [MaxLength(120)]
    public string? StripePaymentIntentId { get; set; }

    public int AmountCents { get; set; }
    public PaymentKind Kind { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? AuthorizedAt { get; set; }
    public DateTimeOffset? CapturedAt { get; set; }
    public DateTimeOffset? RefundedAt { get; set; }
    public int RefundedCents { get; set; }

    [MaxLength(500)]
    public string? FailureReason { get; set; }
}
