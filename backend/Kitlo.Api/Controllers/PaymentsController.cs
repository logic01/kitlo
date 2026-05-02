using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitlo.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly StripeService _stripe;
    public PaymentsController(StripeService stripe) => _stripe = stripe;

    [HttpPost("intent")]
    public Task<PaymentIntentResponse> CreateIntent([FromBody] CreatePaymentIntentRequest req, CancellationToken ct) =>
        _stripe.CreatePaymentIntentAsync(req.BookingId, User.RequireUserId(), ct);

    [HttpPost("confirm")]
    public async Task<IActionResult> Confirm([FromBody] CreatePaymentIntentRequest req, CancellationToken ct)
    {
        await _stripe.ConfirmAsync(req.BookingId, User.RequireUserId(), ct);
        return NoContent();
    }

    [HttpPost("{paymentId:guid}/refund")]
    public async Task<IActionResult> Refund(Guid paymentId, [FromQuery] int? amountCents, CancellationToken ct)
    {
        await _stripe.RefundAsync(paymentId, User.RequireUserId(), User.IsInRole("admin"), amountCents, ct);
        return NoContent();
    }
}

[ApiController]
[Route("api/webhooks")]
public class WebhooksController : ControllerBase
{
    private readonly StripeService _stripe;
    public WebhooksController(StripeService stripe) => _stripe = stripe;

    [HttpPost("stripe")]
    public async Task<IActionResult> Stripe(CancellationToken ct)
    {
        using var reader = new StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync(ct);
        var sig = Request.Headers["Stripe-Signature"].FirstOrDefault();
        await _stripe.HandleWebhookAsync(body, sig, ct);
        return Ok();
    }
}

[ApiController]
[Authorize]
[Route("api/stripe-connect")]
public class StripeConnectController : ControllerBase
{
    private readonly StripeService _stripe;
    public StripeConnectController(StripeService stripe) => _stripe = stripe;

    [HttpGet("onboarding-link")]
    public async Task<IActionResult> Onboarding(CancellationToken ct)
    {
        var url = await _stripe.CreateOnboardingLinkAsync(User.RequireUserId(), ct);
        return Ok(new { url });
    }
}
