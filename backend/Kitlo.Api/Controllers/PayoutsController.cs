using Kitlo.Api.Auth;
using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitlo.Api.Controllers;

[ApiController]
[Authorize(Policy = KitloPolicies.Lister)]
[Route("api/payouts")]
public class PayoutsController : ControllerBase
{
    private readonly PayoutService _payouts;
    public PayoutsController(PayoutService payouts) => _payouts = payouts;

    [HttpGet]
    public Task<PagedResult<PayoutDto>> List([FromQuery] int? page, [FromQuery] int? pageSize, CancellationToken ct) =>
        _payouts.ListAsync(User.RequireUserId(), page, pageSize, ct);

    [HttpGet("summary")]
    public Task<EarningsSummaryDto> Summary(CancellationToken ct) =>
        _payouts.SummaryAsync(User.RequireUserId(), ct);

    [HttpGet("export")]
    public async Task<IActionResult> Export(CancellationToken ct)
    {
        var csv = await _payouts.ExportCsvAsync(User.RequireUserId(), ct);
        return File(System.Text.Encoding.UTF8.GetBytes(csv), "text/csv", "kitlo-payouts.csv");
    }
}
