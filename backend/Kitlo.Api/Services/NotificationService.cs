using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Core.Enums;
using Kitlo.Core.Models;
using Kitlo.Data;
using Microsoft.EntityFrameworkCore;

namespace Kitlo.Api.Services;

public class NotificationService
{
    private readonly KitloDbContext _db;
    public NotificationService(KitloDbContext db) => _db = db;

    public async Task<PagedResult<NotificationDto>> ListAsync(Guid userId, bool unreadOnly, int? page, int? pageSize, CancellationToken ct)
    {
        var (p, ps) = PagingDefaults.Normalize(page, pageSize);
        IQueryable<Notification> q = _db.Notifications.Where(n => n.UserId == userId);
        if (unreadOnly) q = q.Where(n => n.ReadAt == null);
        var total = await q.CountAsync(ct);
        var rows = await q.OrderByDescending(n => n.CreatedAt).Skip((p - 1) * ps).Take(ps).ToListAsync(ct);
        return new PagedResult<NotificationDto> { Items = rows.Select(ToDto).ToList(), Total = total, Page = p, PageSize = ps };
    }

    public async Task<int> UnreadCountAsync(Guid userId, CancellationToken ct) =>
        await _db.Notifications.CountAsync(n => n.UserId == userId && n.ReadAt == null, ct);

    public async Task MarkReadAsync(Guid id, Guid userId, CancellationToken ct)
    {
        var n = await _db.Notifications.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, ct);
        if (n is null) return;
        n.ReadAt ??= DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync(ct);
    }

    public async Task MarkAllReadAsync(Guid userId, CancellationToken ct)
    {
        var now = DateTimeOffset.UtcNow;
        await _db.Notifications
            .Where(n => n.UserId == userId && n.ReadAt == null)
            .ExecuteUpdateAsync(s => s.SetProperty(n => n.ReadAt, now), ct);
    }

    public async Task DeleteAsync(Guid id, Guid userId, CancellationToken ct)
    {
        await _db.Notifications.Where(n => n.Id == id && n.UserId == userId).ExecuteDeleteAsync(ct);
    }

    public async Task<NotificationPreferencesDto> GetPreferencesAsync(Guid userId, CancellationToken ct)
    {
        var p = await _db.NotificationPreferences.FindAsync([userId], ct);
        if (p is null)
        {
            p = new NotificationPreferences { UserId = userId };
            _db.NotificationPreferences.Add(p);
            await _db.SaveChangesAsync(ct);
        }
        return new NotificationPreferencesDto(p.EmailEnabled, p.PushEnabled, p.SmsEnabled, p.OptedOutMask);
    }

    public async Task<NotificationPreferencesDto> UpdatePreferencesAsync(Guid userId, NotificationPreferencesDto req, CancellationToken ct)
    {
        var p = await _db.NotificationPreferences.FindAsync([userId], ct)
            ?? new NotificationPreferences { UserId = userId };
        p.EmailEnabled = req.EmailEnabled;
        p.PushEnabled = req.PushEnabled;
        p.SmsEnabled = req.SmsEnabled;
        p.OptedOutMask = req.OptedOutMask;
        p.UpdatedAt = DateTimeOffset.UtcNow;
        if (_db.Entry(p).State == EntityState.Detached) _db.NotificationPreferences.Add(p);
        await _db.SaveChangesAsync(ct);
        return new NotificationPreferencesDto(p.EmailEnabled, p.PushEnabled, p.SmsEnabled, p.OptedOutMask);
    }

    /// <summary>Internal: enqueue a notification. Other services call this to fan out.</summary>
    public async Task EnqueueAsync(Guid userId, NotificationKind kind, string title, string body, string? link, CancellationToken ct)
    {
        _db.Notifications.Add(new Notification
        {
            UserId = userId, Kind = kind, Title = title, Body = body, Link = link
        });
        await _db.SaveChangesAsync(ct);
    }

    public static NotificationDto ToDto(Notification n) =>
        new(n.Id, n.Kind, n.Title, n.Body, n.CreatedAt, n.ReadAt is not null, n.Link);
}
