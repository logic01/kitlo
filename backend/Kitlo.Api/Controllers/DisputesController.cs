using Kitlo.Api.Auth;
using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Api.Services;
using Kitlo.Core.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitlo.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/disputes")]
public class DisputesController : ControllerBase
{
    private readonly DisputeService _disputes;
    public DisputesController(DisputeService disputes) => _disputes = disputes;

    [HttpPost]
    public Task<DisputeDto> File([FromBody] FileDisputeRequest req, CancellationToken ct) =>
        _disputes.FileAsync(User.RequireUserId(), req, ct);

    [HttpGet("{id:guid}")]
    public Task<DisputeDto> Get(Guid id, CancellationToken ct) =>
        _disputes.GetAsync(id, User.RequireUserId(), User.IsInRole("admin"), ct);

    [HttpPost("{id:guid}/evidence")]
    public Task<DisputeEvidenceDto> AddEvidence(Guid id, [FromBody] AddEvidenceRequest req, CancellationToken ct) =>
        _disputes.AddEvidenceAsync(id, User.RequireUserId(), User.IsInRole("admin"), req, ct);

    [HttpPut("{id:guid}/resolution")]
    [Authorize(Policy = KitloPolicies.Admin)]
    public Task<DisputeDto> Resolve(Guid id, [FromBody] ResolveDisputeRequest req, CancellationToken ct) =>
        _disputes.ResolveAsync(id, User.RequireUserId(), req, ct);

    [HttpGet]
    [Authorize(Policy = KitloPolicies.Admin)]
    public Task<PagedResult<DisputeDto>> List([FromQuery] DisputeStatus? status, [FromQuery] int? page, [FromQuery] int? pageSize, CancellationToken ct) =>
        _disputes.ListAsync(status, page, pageSize, ct);
}
