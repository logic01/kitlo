using System.ComponentModel.DataAnnotations;

namespace Kitlo.Core.Models;

public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }
    public User? User { get; set; }

    // SHA-256 hex of the raw token. The raw value never touches the database.
    [Required, MaxLength(64)]
    public string TokenHash { get; set; } = string.Empty;

    public DateTimeOffset ExpiresAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? RevokedAt { get; set; }

    [MaxLength(64)]
    public string? ReplacedByTokenHash { get; set; }

    [MaxLength(45)] // IPv6 max length
    public string? CreatedByIp { get; set; }

    public bool IsActive => RevokedAt is null && DateTimeOffset.UtcNow < ExpiresAt;
}
