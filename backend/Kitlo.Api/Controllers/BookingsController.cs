using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Api.Services;
using Kitlo.Core.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitlo.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/bookings")]
public class BookingsController : ControllerBase
{
    private readonly BookingService _bookings;
    public BookingsController(BookingService bookings) => _bookings = bookings;

    [HttpGet]
    public Task<PagedResult<BookingSummaryDto>> List(
        [FromQuery] string? role,
        [FromQuery] string? status,
        [FromQuery] int? page,
        [FromQuery] int? pageSize,
        CancellationToken ct)
    {
        BookingStatus[]? parsed = null;
        if (!string.IsNullOrWhiteSpace(status))
        {
            parsed = status.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(s => Enum.TryParse<BookingStatus>(s, true, out var v) ? v : (BookingStatus?)null)
                .Where(v => v is not null).Select(v => v!.Value).ToArray();
        }
        return _bookings.ListAsync(User.RequireUserId(), role, parsed, page, pageSize, ct);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var b = await _bookings.GetAsync(id, User.RequireUserId(), ct);
        return Ok(new
        {
            booking = BookingService.ToSummary(b, User.RequireUserId()),
            status = b.Status.ToString().ToLowerInvariant(),
            startDate = b.StartDate,
            endDate = b.EndDate,
            rentalCents = b.RentalCents,
            depositCents = b.DepositCents,
            platformFeeCents = b.PlatformFeeCents,
            totalCents = b.TotalCents,
            timeline = BookingService.ToTimeline(b)
        });
    }

    [HttpPost]
    public async Task<ActionResult<BookingSummaryDto>> Create([FromBody] CreateBookingRequest req, CancellationToken ct)
    {
        var booking = await _bookings.CreateAsync(User.RequireUserId(), req, ct);
        return BookingService.ToSummary(booking, User.RequireUserId());
    }

    [HttpPut("{id:guid}/status")]
    public async Task<ActionResult<BookingSummaryDto>> UpdateStatus(Guid id, [FromBody] UpdateBookingStatusRequest req, CancellationToken ct)
    {
        var booking = await _bookings.TransitionAsync(id, User.RequireUserId(), req.Action, req.Reason, ct);
        return BookingService.ToSummary(booking, User.RequireUserId());
    }

    [HttpGet("{id:guid}/timeline")]
    public async Task<ActionResult<IReadOnlyList<BookingTimelineEventDto>>> Timeline(Guid id, CancellationToken ct)
    {
        var b = await _bookings.GetAsync(id, User.RequireUserId(), ct);
        return Ok(BookingService.ToTimeline(b));
    }
}
