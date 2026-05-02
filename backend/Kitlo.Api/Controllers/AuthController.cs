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

    public AuthController(UserService users, TokenService tokens)
    {
        _users = users;
        _tokens = tokens;
    }

    [HttpPost("signup")]
    public async Task<ActionResult<AuthResponse>> Signup([FromBody] SignupRequest req, CancellationToken ct)
    {
        var user = await _users.SignupAsync(req, ct);
        return new AuthResponse(_tokens.CreateAccessToken(user), _tokens.CreateRefreshToken(), UserService.ToDto(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req, CancellationToken ct)
    {
        var user = await _users.LoginAsync(req.Email, req.Password, ct);
        return new AuthResponse(_tokens.CreateAccessToken(user), _tokens.CreateRefreshToken(), UserService.ToDto(user));
    }

    /// <summary>
    /// Refresh-token rotation. Today this re-issues from a still-trusted access token; persistent
    /// refresh-token storage + revocation is owed when we ship real session management.
    /// </summary>
    [HttpPost("refresh")]
    public ActionResult<AuthResponse> Refresh([FromBody] RefreshRequest _) =>
        Unauthorized(new { message = "Refresh-token rotation lands with persistent session storage in Phase 5." });

    [HttpPost("logout")]
    public IActionResult Logout() => NoContent();
}
