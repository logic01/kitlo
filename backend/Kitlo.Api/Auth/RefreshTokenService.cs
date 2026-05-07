using Kitlo.Api.Common;
using Kitlo.Core.Models;
using Kitlo.Data;
using Microsoft.EntityFrameworkCore;

namespace Kitlo.Api.Auth;

/// <summary>
/// Issues, persists, validates and rotates refresh tokens. Raw tokens are returned to the
/// caller; only SHA-256 hashes are stored, so a database leak does not yield usable tokens.
/// </summary>
public class RefreshTokenService
{
    private readonly KitloDbContext _db;
    private readonly TokenService _tokens;

    public RefreshTokenService(KitloDbContext db, TokenService tokens)
    {
        _db = db;
        _tokens = tokens;
    }

    public async Task<string> IssueAsync(Guid userId, string? createdByIp, CancellationToken ct)
    {
        var raw = _tokens.CreateRefreshToken();
        var entity = new RefreshToken
        {
            UserId = userId,
            TokenHash = TokenService.HashRefreshToken(raw),
            ExpiresAt = DateTimeOffset.UtcNow.Add(_tokens.RefreshTokenLifetime),
            CreatedByIp = createdByIp,
        };
        _db.RefreshTokens.Add(entity);
        await _db.SaveChangesAsync(ct);
        return raw;
    }

    /// <summary>
    /// Rotate: validates the presented raw token, revokes it, and issues a fresh one for the
    /// same user. Returns the new raw token and the user. Throws 401 on any failure.
    /// </summary>
    public async Task<(string newRawToken, User user)> RotateAsync(string presentedRawToken, string? createdByIp, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(presentedRawToken))
            throw new DomainException("Invalid refresh token.", 401);

        var hash = TokenService.HashRefreshToken(presentedRawToken);
        var existing = await _db.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.TokenHash == hash, ct);

        if (existing is null)
            throw new DomainException("Invalid refresh token.", 401);

        if (existing.RevokedAt is not null)
        {
            // Reuse of a revoked token is an attack signal: revoke every active token for this
            // user so the attacker and the legitimate client are both forced to log in again.
            await RevokeAllForUserAsync(existing.UserId, ct);
            throw new DomainException("Refresh token reuse detected.", 401);
        }

        if (DateTimeOffset.UtcNow >= existing.ExpiresAt)
            throw new DomainException("Refresh token expired.", 401);

        if (existing.User is null)
            throw new DomainException("Invalid refresh token.", 401);

        var newRaw = _tokens.CreateRefreshToken();
        var newHash = TokenService.HashRefreshToken(newRaw);

        existing.RevokedAt = DateTimeOffset.UtcNow;
        existing.ReplacedByTokenHash = newHash;

        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = existing.UserId,
            TokenHash = newHash,
            ExpiresAt = DateTimeOffset.UtcNow.Add(_tokens.RefreshTokenLifetime),
            CreatedByIp = createdByIp,
        });

        await _db.SaveChangesAsync(ct);
        return (newRaw, existing.User);
    }

    public async Task RevokeAsync(string presentedRawToken, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(presentedRawToken)) return;
        var hash = TokenService.HashRefreshToken(presentedRawToken);
        var existing = await _db.RefreshTokens.FirstOrDefaultAsync(r => r.TokenHash == hash, ct);
        if (existing is null || existing.RevokedAt is not null) return;
        existing.RevokedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync(ct);
    }

    public async Task RevokeAllForUserAsync(Guid userId, CancellationToken ct)
    {
        var now = DateTimeOffset.UtcNow;
        await _db.RefreshTokens
            .Where(r => r.UserId == userId && r.RevokedAt == null)
            .ExecuteUpdateAsync(s => s.SetProperty(r => r.RevokedAt, now), ct);
    }
}
