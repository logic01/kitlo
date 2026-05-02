using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitlo.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly NotificationService _notifications;
    public NotificationsController(NotificationService notifications) => _notifications = notifications;

    [HttpGet]
    public Task<PagedResult<NotificationDto>> List([FromQuery] bool unreadOnly, [FromQuery] int? page, [FromQuery] int? pageSize, CancellationToken ct) =>
        _notifications.ListAsync(User.RequireUserId(), unreadOnly, page, pageSize, ct);

    [HttpGet("unread-count")]
    public async Task<IActionResult> UnreadCount(CancellationToken ct) =>
        Ok(new { count = await _notifications.UnreadCountAsync(User.RequireUserId(), ct) });

    [HttpPut("{id:guid}/read")]
    public async Task<IActionResult> Read(Guid id, CancellationToken ct)
    {
        await _notifications.MarkReadAsync(id, User.RequireUserId(), ct);
        return NoContent();
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> ReadAll(CancellationToken ct)
    {
        await _notifications.MarkAllReadAsync(User.RequireUserId(), ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _notifications.DeleteAsync(id, User.RequireUserId(), ct);
        return NoContent();
    }

    [HttpGet("preferences")]
    public Task<NotificationPreferencesDto> GetPreferences(CancellationToken ct) =>
        _notifications.GetPreferencesAsync(User.RequireUserId(), ct);

    [HttpPut("preferences")]
    public Task<NotificationPreferencesDto> UpdatePreferences([FromBody] NotificationPreferencesDto req, CancellationToken ct) =>
        _notifications.UpdatePreferencesAsync(User.RequireUserId(), req, ct);
}
