namespace Kitlo.Api.Common;

public class PagedResult<T>
{
    public required IReadOnlyList<T> Items { get; init; }
    public required int Total { get; init; }
    public required int Page { get; init; }
    public required int PageSize { get; init; }
}

public static class PagingDefaults
{
    public const int DefaultPageSize = 20;
    public const int MaxPageSize = 100;

    public static (int page, int pageSize) Normalize(int? page, int? pageSize)
    {
        var p = page is null or < 1 ? 1 : page.Value;
        var ps = pageSize is null or < 1
            ? DefaultPageSize
            : Math.Min(pageSize.Value, MaxPageSize);
        return (p, ps);
    }
}
