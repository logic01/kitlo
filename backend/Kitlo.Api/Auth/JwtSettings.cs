namespace Kitlo.Api.Auth;

public class JwtSettings
{
    public string Issuer { get; set; } = "kitlo";
    public string Audience { get; set; } = "kitlo-api";
    public string Key { get; set; } = string.Empty;
    public int AccessTokenMinutes { get; set; } = 60;
    public int RefreshTokenDays { get; set; } = 30;
}

public static class KitloPolicies
{
    public const string Admin = "admin";
    public const string Lister = "lister";
}
