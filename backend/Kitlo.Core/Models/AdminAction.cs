using System.ComponentModel.DataAnnotations;
using Kitlo.Core.Enums;

namespace Kitlo.Core.Models;

/// <summary>Audit log of admin moderation decisions.</summary>
public class AdminAction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid AdminUserId { get; set; }
    public User? AdminUser { get; set; }

    public AdminActionKind Kind { get; set; }

    public Guid? TargetUserId { get; set; }
    public Guid? TargetListingId { get; set; }
    public Guid? TargetBookingId { get; set; }
    public Guid? TargetDisputeId { get; set; }

    [MaxLength(2000)]
    public string? Note { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
