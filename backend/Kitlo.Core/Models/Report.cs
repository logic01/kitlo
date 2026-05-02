using System.ComponentModel.DataAnnotations;
using Kitlo.Core.Enums;

namespace Kitlo.Core.Models;

/// <summary>User-submitted report (abuse, listing concerns, etc.) — admin reviews.</summary>
public class Report
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ReporterId { get; set; }
    public User? Reporter { get; set; }

    public ReportTargetType TargetType { get; set; }
    public Guid TargetId { get; set; }

    [Required, MaxLength(120)]
    public string Reason { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Note { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? ResolvedAt { get; set; }

    public Guid? ResolvedByAdminId { get; set; }
    public User? ResolvedByAdmin { get; set; }

    [MaxLength(2000)]
    public string? ResolutionNote { get; set; }
}
