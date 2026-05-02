using Kitlo.Api.Auth;
using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitlo.Api.Controllers;

[ApiController]
[Authorize(Policy = KitloPolicies.Admin)]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AdminService _admin;
    public AdminController(AdminService admin) => _admin = admin;

    [HttpGet("stats")]
    public Task<AdminStatsDto> Stats(CancellationToken ct) => _admin.StatsAsync(ct);

    [HttpGet("listings")]
    public Task<IReadOnlyList<AdminQueueItemDto>> ListingQueue(CancellationToken ct) => _admin.ListingQueueAsync(ct);

    [HttpPost("listings/{id:guid}/approve")]
    public async Task<IActionResult> Approve(Guid id, CancellationToken ct)
    {
        await _admin.ApproveListingAsync(id, User.RequireUserId(), ct);
        return NoContent();
    }

    [HttpPost("listings/{id:guid}/reject")]
    public async Task<IActionResult> Reject(Guid id, [FromBody] AdminRejectRequest req, CancellationToken ct)
    {
        await _admin.RejectListingAsync(id, User.RequireUserId(), req.Note ?? "", ct);
        return NoContent();
    }

    [HttpGet("users")]
    public Task<PagedResult<UserDto>> Users([FromQuery] string? q, [FromQuery] int? page, [FromQuery] int? pageSize, CancellationToken ct) =>
        _admin.SearchUsersAsync(q, page, pageSize, ct);

    [HttpGet("users/{id:guid}")]
    public Task<UserDto> GetUser(Guid id, CancellationToken ct) =>
        _admin.GetUserAsync(id, ct);

    [HttpPut("users/{id:guid}/status")]
    public Task<UserDto> UserStatus(Guid id, [FromBody] UserAdminActionRequest req, CancellationToken ct) =>
        _admin.ApplyUserActionAsync(id, User.RequireUserId(), req, ct);
}

public record AdminRejectRequest(string? Note);
