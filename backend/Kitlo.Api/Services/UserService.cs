using Kitlo.Api.Auth;
using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Core.Enums;
using Kitlo.Core.Models;
using Kitlo.Data;
using Microsoft.EntityFrameworkCore;

namespace Kitlo.Api.Services;

public class UserService
{
    private readonly KitloDbContext _db;
    private readonly PasswordHasher _hasher;

    public UserService(KitloDbContext db, PasswordHasher hasher)
    {
        _db = db;
        _hasher = hasher;
    }

    public async Task<User> SignupAsync(SignupRequest req, CancellationToken ct)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        if (await _db.Users.AnyAsync(u => u.Email == email, ct))
            throw DomainException.Conflict("An account with this email already exists.");

        // 'lister' and 'both' both grant lister capabilities; 'both' renters
        // can still be renters because the Lister policy does not exclude renters
        // from booking. Default ('renter' or unset) gets renter only.
        var role = req.Intent?.ToLowerInvariant() switch
        {
            "lister" or "both" => UserRole.Lister,
            _ => UserRole.Renter
        };

        var user = new User
        {
            Email = email,
            PasswordHash = _hasher.Hash(req.Password),
            Name = req.Name.Trim(),
            City = string.IsNullOrWhiteSpace(req.City) ? null : req.City.Trim(),
            State = string.IsNullOrWhiteSpace(req.State) ? null : req.State.Trim().ToUpperInvariant(),
            Role = role,
            JoinedAt = DateTimeOffset.UtcNow
        };
        _db.Users.Add(user);
        _db.NotificationPreferences.Add(new NotificationPreferences { UserId = user.Id });
        await _db.SaveChangesAsync(ct);
        return user;
    }

    public async Task<User> LoginAsync(string email, string password, CancellationToken ct)
    {
        var normalized = email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == normalized, ct)
            ?? throw new DomainException("Email or password is incorrect.", 401);

        if (!_hasher.Verify(password, user.PasswordHash))
            throw new DomainException("Email or password is incorrect.", 401);

        if (user.Status is UserStatus.Suspended or UserStatus.Banned)
            throw new DomainException("This account is not allowed to sign in.", 403);

        user.LastLoginAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync(ct);
        return user;
    }

    public async Task<UserDto> GetMeAsync(Guid id, CancellationToken ct)
    {
        var user = await _db.Users.FindAsync([id], ct)
            ?? throw DomainException.NotFound("User");
        return ToDto(user);
    }

    public async Task<UserDto> UpdateAsync(Guid id, UpdateUserRequest req, CancellationToken ct)
    {
        var user = await _db.Users.FindAsync([id], ct)
            ?? throw DomainException.NotFound("User");

        if (!string.IsNullOrWhiteSpace(req.Name)) user.Name = req.Name.Trim();
        if (req.City is not null) user.City = req.City.Trim();
        if (req.State is not null) user.State = req.State.Trim().ToUpperInvariant();
        if (req.AvatarUrl is not null) user.AvatarUrl = req.AvatarUrl;
        if (req.Bio is not null) user.Bio = req.Bio.Trim();

        await _db.SaveChangesAsync(ct);
        return ToDto(user);
    }

    public async Task<PublicProfileDto> GetPublicProfileAsync(Guid id, CancellationToken ct)
    {
        var user = await _db.Users.FindAsync([id], ct)
            ?? throw DomainException.NotFound("User");

        var (avg, count) = await GetRatingAggregateAsync(id, ct);
        return new PublicProfileDto(
            user.Id, user.Name, user.AvatarUrl, user.IdentityVerified,
            user.City, user.State, user.JoinedAt, avg, count);
    }

    public async Task<(double avg, int count)> GetRatingAggregateAsync(Guid userId, CancellationToken ct)
    {
        var reviews = _db.Reviews.Where(r => r.RevieweeId == userId && r.VisibleAt != null && r.VisibleAt <= DateTimeOffset.UtcNow);
        var count = await reviews.CountAsync(ct);
        if (count == 0) return (0d, 0);
        var avg = await reviews.AverageAsync(r => (double)r.Rating, ct);
        return (Math.Round(avg, 2), count);
    }

    public static UserDto ToDto(User u) =>
        new(u.Id, u.Email, u.Name, u.Role switch
        {
            UserRole.Admin => "admin",
            UserRole.Lister => "lister",
            _ => "renter"
        }, u.IdentityVerified, u.City, u.State, u.AvatarUrl, u.JoinedAt,
            u.Status switch
            {
                UserStatus.Restricted => "restricted",
                UserStatus.Suspended => "suspended",
                UserStatus.Banned => "banned",
                _ => "active"
            });
}
