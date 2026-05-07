using System.ComponentModel.DataAnnotations;

namespace Kitlo.Core.Models;

public class WaitlistEntry
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, MaxLength(254)]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(10)]
    public string Zip { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? FirstRental { get; set; }

    public bool InterestedAsLister { get; set; }

    [MaxLength(60)]
    public string? Source { get; set; }

    [MaxLength(45)]
    public string? IpAddress { get; set; }

    [MaxLength(500)]
    public string? UserAgent { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Guid? ConvertedUserId { get; set; }
    public User? ConvertedUser { get; set; }
}
