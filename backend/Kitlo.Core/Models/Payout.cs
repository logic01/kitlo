using System.ComponentModel.DataAnnotations;
using Kitlo.Core.Enums;

namespace Kitlo.Core.Models;

public class Payout
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BookingId { get; set; }
    public Booking? Booking { get; set; }

    public Guid ListerId { get; set; }
    public User? Lister { get; set; }

    public int GrossCents { get; set; }
    public int PlatformFeeCents { get; set; }
    public int NetCents { get; set; }

    public PayoutStatus Status { get; set; } = PayoutStatus.Scheduled;

    [MaxLength(120)]
    public string? StripeTransferId { get; set; }

    [MaxLength(8)]
    public string? BankLast4 { get; set; }

    public DateTimeOffset ScheduledFor { get; set; }
    public DateTimeOffset? PaidAt { get; set; }

    [MaxLength(500)]
    public string? FailureReason { get; set; }
}
