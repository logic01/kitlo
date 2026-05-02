using System.ComponentModel.DataAnnotations;
using Kitlo.Core.Enums;

namespace Kitlo.Core.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, MaxLength(254)]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(80)]
    public string? City { get; set; }

    [MaxLength(2)]
    public string? State { get; set; }

    [MaxLength(500)]
    public string? AvatarUrl { get; set; }

    [MaxLength(2000)]
    public string? Bio { get; set; }

    public UserRole Role { get; set; } = UserRole.Renter;
    public UserStatus Status { get; set; } = UserStatus.Active;

    public bool EmailVerified { get; set; }
    public bool IdentityVerified { get; set; }

    [MaxLength(120)]
    public string? StripeAccountId { get; set; }

    public DateTimeOffset JoinedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? LastLoginAt { get; set; }

    // Navigation
    public ICollection<Listing> Listings { get; set; } = [];
    public ICollection<Booking> BookingsAsRenter { get; set; } = [];
    public ICollection<Booking> BookingsAsLister { get; set; } = [];
    public NotificationPreferences? NotificationPreferences { get; set; }
}
