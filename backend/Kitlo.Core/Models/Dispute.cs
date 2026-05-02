using System.ComponentModel.DataAnnotations;
using Kitlo.Core.Enums;

namespace Kitlo.Core.Models;

public class Dispute
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid BookingId { get; set; }
    public Booking? Booking { get; set; }

    public Guid FiledById { get; set; }
    public User? FiledBy { get; set; }

    public DisputeStatus Status { get; set; } = DisputeStatus.Open;
    public DisputeReason Reason { get; set; }

    [MaxLength(120)]
    public string ReasonLabel { get; set; } = string.Empty;

    [Required, MaxLength(4000)]
    public string Summary { get; set; } = string.Empty;

    public int AmountInDisputeCents { get; set; }

    public DisputeResolution? Resolution { get; set; }

    [MaxLength(2000)]
    public string? ResolutionNote { get; set; }

    public Guid? ResolvedByAdminId { get; set; }
    public User? ResolvedByAdmin { get; set; }

    public DateTimeOffset FiledAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? ResolvedAt { get; set; }

    public ICollection<DisputeEvidence> Evidence { get; set; } = [];
}

public class DisputeEvidence
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid DisputeId { get; set; }
    public Dispute? Dispute { get; set; }

    public Guid UploadedById { get; set; }
    public User? UploadedBy { get; set; }

    public DisputeEvidenceKind Kind { get; set; }

    [MaxLength(500)]
    public string? Url { get; set; }

    [MaxLength(4000)]
    public string? Text { get; set; }

    public DateTimeOffset UploadedAt { get; set; } = DateTimeOffset.UtcNow;
}
