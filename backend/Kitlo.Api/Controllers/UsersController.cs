using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitlo.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly UserService _users;
    public UsersController(UserService users) => _users = users;

    [HttpGet("me")]
    [Authorize]
    public Task<UserDto> Me(CancellationToken ct) => _users.GetMeAsync(User.RequireUserId(), ct);

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<UserDto>> Update(Guid id, [FromBody] UpdateUserRequest req, CancellationToken ct)
    {
        if (User.RequireUserId() != id) return Forbid();
        return await _users.UpdateAsync(id, req, ct);
    }

    [HttpGet("{id:guid}/profile")]
    public Task<PublicProfileDto> Profile(Guid id, CancellationToken ct) => _users.GetPublicProfileAsync(id, ct);
}
