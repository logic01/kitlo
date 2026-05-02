using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitlo.Api.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly ReviewService _reviews;
    public ReviewsController(ReviewService reviews) => _reviews = reviews;

    [HttpPost("bookings/{bookingId:guid}")]
    [Authorize]
    public Task<ReviewDto> Submit(Guid bookingId, [FromBody] SubmitReviewRequest req, CancellationToken ct) =>
        _reviews.SubmitAsync(bookingId, User.RequireUserId(), req, ct);

    [HttpGet]
    public Task<PagedResult<ReviewDto>> ByUser([FromQuery] Guid userId, [FromQuery] int? page, [FromQuery] int? pageSize, CancellationToken ct) =>
        _reviews.GetByUserAsync(userId, page, pageSize, ct);
}

[ApiController]
[Route("api/listings")]
public class ListingReviewsController : ControllerBase
{
    private readonly ReviewService _reviews;
    public ListingReviewsController(ReviewService reviews) => _reviews = reviews;

    [HttpGet("{id:guid}/reviews")]
    public Task<PagedResult<ReviewDto>> Reviews(Guid id, [FromQuery] int? page, [FromQuery] int? pageSize, CancellationToken ct) =>
        _reviews.GetByListingAsync(id, page, pageSize, ct);
}
