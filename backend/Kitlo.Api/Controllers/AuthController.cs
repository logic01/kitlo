using Kitlo.Api.Auth;
using Kitlo.Api.Models;
using Kitlo.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kitlo.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserService _users;
    private readonly TokenService _tokens;
    private readonly RefreshTokenService _refresh;

    public AuthController(UserService users, TokenService tokens, RefreshTokenService refresh)
    {
        _users = users;
        _tokens = tokens;
        _refresh = refresh;
    }

    [HttpPost("signup")]
    public async Task<ActionResult<AuthResponse>> Signup([FromBody] SignupRequest req, CancellationToken ct)
    {
        var user = await _users.SignupAsync(req, ct);
        var refresh = await _refresh.IssueAsync(user.Id, ClientIp(), ct);
        return new AuthResponse(_tokens.CreateAccessToken(user), refresh, UserService.ToDto(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req, CancellationToken ct)
    {
        var user = await _users.LoginAsync(req.Email, req.Password, ct);
        var refresh = await _refresh.IssueAsync(user.Id, ClientIp(), ct);
        return new AuthResponse(_tokens.CreateAccessToken(user), refresh, UserService.ToDto(user));
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> Refresh([FromBody] RefreshRequest req, CancellationToken ct)
    {
        var (newRaw, user) = await _refresh.RotateAsync(req.RefreshToken, ClientIp(), ct);
        return new AuthResponse(_tokens.CreateAccessToken(user), newRaw, UserService.ToDto(user));
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] RefreshRequest? req, CancellationToken ct)
    {
        if (!string.IsNullOrWhiteSpace(req?.RefreshToken))
            await _refresh.RevokeAsync(req.RefreshToken, ct);
        return NoContent();
    }

    private string? ClientIp() => HttpContext.Connection.RemoteIpAddress?.ToString();
}
