namespace Kitlo.Api.Common;

/// <summary>Maps to a 400/404/409. Use for *expected* failures that should surface to the client.</summary>
public class DomainException : Exception
{
    public int StatusCode { get; }

    public DomainException(string message, int statusCode = 400) : base(message)
    {
        StatusCode = statusCode;
    }

    public static DomainException NotFound(string what) => new($"{what} not found.", 404);
    public static DomainException Conflict(string message) => new(message, 409);
    public static DomainException Forbidden(string message = "Forbidden.") => new(message, 403);
}
