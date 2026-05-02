using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Kitlo.Api.Common;

public static class CurrentUser
{
    public static Guid? GetUserId(this ClaimsPrincipal principal)
    {
        var raw = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                  ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(raw, out var id) ? id : null;
    }

    public static Guid RequireUserId(this ClaimsPrincipal principal)
        => principal.GetUserId() ?? throw new UnauthorizedAccessException("Authenticated principal has no user id.");

    public static string? GetRole(this ClaimsPrincipal principal)
        => principal.FindFirst(ClaimTypes.Role)?.Value;
}
