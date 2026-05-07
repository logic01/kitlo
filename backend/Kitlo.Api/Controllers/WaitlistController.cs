using Kitlo.Api.Auth;
using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitlo.Api.Controllers;

[ApiController]
[Route("api/waitlist")]
public class WaitlistController : ControllerBase
{
    private readonly WaitlistService _waitlist;

    public WaitlistController(WaitlistService waitlist) => _waitlist = waitlist;

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<WaitlistJoinResponse>> Join(
        [FromBody] WaitlistJoinRequest req,
        CancellationToken ct)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var ua = Request.Headers.UserAgent.ToString();
        var result = await _waitlist.JoinAsync(req, ip, string.IsNullOrEmpty(ua) ? null : ua, ct);
        return Ok(result);
    }

    [HttpGet]
    [Authorize(Policy = KitloPolicies.Admin)]
    public Task<PagedResult<WaitlistEntryDto>> List(
        [FromQuery] string? q,
        [FromQuery] string? zip,
        [FromQuery] bool? listersOnly,
        [FromQuery] int? page,
        [FromQuery] int? pageSize,
        CancellationToken ct) =>
        _waitlist.ListAsync(q, zip, listersOnly, page, pageSize, ct);

    [HttpGet("export.csv")]
    [Authorize(Policy = KitloPolicies.Admin)]
    public async Task<IActionResult> Export(CancellationToken ct)
    {
        var (name, bytes) = await _waitlist.ExportCsvAsync(ct);
        return File(bytes, "text/csv", name);
    }
}
