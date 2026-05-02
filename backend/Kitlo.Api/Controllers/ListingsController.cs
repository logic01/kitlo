using Kitlo.Api.Auth;
using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Api.Services;
using Kitlo.Core.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitlo.Api.Controllers;

[ApiController]
[Route("api/listings")]
public class ListingsController : ControllerBase
{
    private readonly ListingService _listings;
    public ListingsController(ListingService listings) => _listings = listings;

    [HttpGet]
    public Task<PagedResult<ListingSummaryDto>> Search(
        [FromQuery] GearType? gearType,
        [FromQuery] string? conditions,
        [FromQuery] int? minPriceCents,
        [FromQuery] int? maxPriceCents,
        [FromQuery] bool verifiedOnly,
        [FromQuery] string? location,
        [FromQuery] string? sort,
        [FromQuery] Guid? listerId,
        [FromQuery] int? page,
        [FromQuery] int? pageSize,
        CancellationToken ct)
    {
        Condition[]? parsed = null;
        if (!string.IsNullOrWhiteSpace(conditions))
        {
            parsed = conditions.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(c => Enum.TryParse<Condition>(c.Replace("-", ""), true, out var v) ? v : (Condition?)null)
                .Where(c => c is not null).Select(c => c!.Value).ToArray();
        }
        return _listings.SearchAsync(gearType, parsed, minPriceCents, maxPriceCents, verifiedOnly, location, sort, listerId, includeUnpublished: false, page, pageSize, ct);
    }

    /// <summary>Caller's own listings — includes drafts/paused, not just published.</summary>
    [HttpGet("mine")]
    [Authorize(Policy = KitloPolicies.Lister)]
    public Task<PagedResult<ListingSummaryDto>> Mine(
        [FromQuery] int? page,
        [FromQuery] int? pageSize,
        CancellationToken ct) =>
        _listings.SearchAsync(null, null, null, null, false, null, "newest", User.RequireUserId(), includeUnpublished: true, page, pageSize, ct);

    [HttpGet("{id:guid}")]
    public Task<ListingDto> Get(Guid id, CancellationToken ct) => _listings.GetByIdAsync(id, ct);

    [HttpPost]
    [Authorize(Policy = KitloPolicies.Lister)]
    public Task<ListingDto> Create([FromBody] CreateListingRequest req, CancellationToken ct) =>
        _listings.CreateDraftAsync(User.RequireUserId(), req, ct);

    [HttpPut("{id:guid}")]
    [Authorize(Policy = KitloPolicies.Lister)]
    public Task<ListingDto> Update(Guid id, [FromBody] UpdateListingRequest req, CancellationToken ct) =>
        _listings.UpdateAsync(id, User.RequireUserId(), req, ct);

    [HttpPost("{id:guid}/publish")]
    [Authorize(Policy = KitloPolicies.Lister)]
    public Task<ListingDto> Publish(Guid id, CancellationToken ct) =>
        _listings.PublishAsync(id, User.RequireUserId(), ct);

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = KitloPolicies.Lister)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _listings.DeleteAsync(id, User.RequireUserId(), ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/photos")]
    [Authorize(Policy = KitloPolicies.Lister)]
    public Task<ListingPhotoDto> AddPhoto(Guid id, [FromBody] ListingPhotoUploadRequest req, CancellationToken ct) =>
        _listings.AddPhotoAsync(id, User.RequireUserId(), req, ct);

    [HttpGet("{id:guid}/availability")]
    public async Task<IActionResult> Availability(Guid id, CancellationToken ct)
    {
        var blocks = await _listings.GetAvailabilityAsync(id, ct);
        return Ok(blocks.Select(b => new { b.StartDate, b.EndDate, status = b.Reason.ToString().ToLowerInvariant() }));
    }
}
