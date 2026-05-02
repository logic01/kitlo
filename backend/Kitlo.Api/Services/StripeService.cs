using Kitlo.Api.Common;
using Kitlo.Api.Models;
using Kitlo.Core.Enums;
using Kitlo.Core.Models;
using Kitlo.Data;
using Microsoft.EntityFrameworkCore;

namespace Kitlo.Api.Services;

/// <summary>
/// Stripe Connect integration. <b>Scaffolded only</b> — real Stripe.NET wiring lands in Phase 5
/// after live keys are provisioned. Today every method records the booking-side state machine
/// and emits a fake <c>pi_xxx</c> id so the rest of the app exercises the right code paths.
/// </summary>
public class StripeService
{
    private readonly KitloDbContext _db;
    private readonly IConfiguration _config;

    public StripeService(KitloDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    /// <summary>True once a real <c>STRIPE_SECRET_KEY</c> is configured. Webhook verification + Stripe.NET calls only run in this mode.</summary>
    public bool IsLive => !string.IsNullOrEmpty(_config["Stripe:SecretKey"]);

    /// <summary>Two-PI pattern: rental charge (auto-capture on confirm) + deposit hold (manual-capture; voided on clean return).</summary>
    public async Task<PaymentIntentResponse> CreatePaymentIntentAsync(Guid bookingId, Guid renterId, CancellationToken ct)
    {
        var booking = await _db.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId, ct)
            ?? throw DomainException.NotFound("Booking");
        if (booking.RenterId != renterId) throw DomainException.Forbidden();
        if (booking.Status != BookingStatus.Pending && booking.Status != BookingStatus.Confirmed)
            throw new DomainException("Booking is past the payment stage.");

        // Rental charge
        var rentalIntentId = $"pi_test_{Guid.NewGuid():N}";
        _db.Payments.Add(new Payment
        {
            BookingId = bookingId,
            StripePaymentIntentId = rentalIntentId,
            AmountCents = booking.RentalCents + booking.PlatformFeeCents,
            Kind = PaymentKind.Rental,
            Status = PaymentStatus.Pending
        });

        // Deposit hold (only if listing has a deposit)
        if (booking.DepositCents > 0)
        {
            _db.Payments.Add(new Payment
            {
                BookingId = bookingId,
                StripePaymentIntentId = $"pi_test_{Guid.NewGuid():N}",
                AmountCents = booking.DepositCents,
                Kind = PaymentKind.Deposit,
                Status = PaymentStatus.Pending
            });
        }

        await _db.SaveChangesAsync(ct);

        // In live mode this would call StripeClient.PaymentIntents.CreateAsync and return the real client_secret.
        return new PaymentIntentResponse(
            ClientSecret: $"{rentalIntentId}_secret_test",
            PaymentIntentId: rentalIntentId);
    }

    public async Task ConfirmAsync(Guid bookingId, Guid renterId, CancellationToken ct)
    {
        var booking = await _db.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId, ct)
            ?? throw DomainException.NotFound("Booking");
        if (booking.RenterId != renterId) throw DomainException.Forbidden();

        var payments = await _db.Payments.Where(p => p.BookingId == bookingId).ToListAsync(ct);
        foreach (var p in payments.Where(p => p.Kind == PaymentKind.Rental))
        {
            p.Status = PaymentStatus.Captured;
            p.CapturedAt = DateTimeOffset.UtcNow;
        }
        foreach (var p in payments.Where(p => p.Kind == PaymentKind.Deposit))
        {
            p.Status = PaymentStatus.Authorized;
            p.AuthorizedAt = DateTimeOffset.UtcNow;
        }
        await _db.SaveChangesAsync(ct);
    }

    public async Task RefundAsync(Guid paymentId, Guid actorId, bool isAdmin, int? amountCents, CancellationToken ct)
    {
        if (amountCents is < 0)
            throw new DomainException("Refund amount must be non-negative.");

        var payment = await _db.Payments.Include(p => p.Booking).FirstOrDefaultAsync(p => p.Id == paymentId, ct)
            ?? throw DomainException.NotFound("Payment");

        if (!isAdmin)
        {
            // Only the lister of the booking can issue a refund (and admins).
            // Renters request via cancel/dispute, not direct refund.
            if (payment.Booking is null || payment.Booking.ListerId != actorId)
                throw DomainException.Forbidden();
        }

        var requested = amountCents ?? (payment.AmountCents - payment.RefundedCents);
        var remaining = payment.AmountCents - payment.RefundedCents;
        if (requested > remaining)
            throw new DomainException($"Refund of {requested} exceeds remaining {remaining}.");

        payment.RefundedCents += requested;
        payment.Status = payment.RefundedCents >= payment.AmountCents
            ? PaymentStatus.Refunded
            : PaymentStatus.PartiallyRefunded;
        payment.RefundedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync(ct);
    }

    /// <summary>
    /// Stripe Connect onboarding URL. In live mode this would return an Account Link.
    /// </summary>
    public Task<string> CreateOnboardingLinkAsync(Guid userId, CancellationToken ct)
    {
        // Live: var link = await accountLinkService.CreateAsync(...)
        return Task.FromResult($"https://connect.stripe.com/express/onboarding/test/{userId}");
    }

    /// <summary>Webhook receiver. Stripe.NET signature verification gets wired in Phase 5.</summary>
    public Task HandleWebhookAsync(string rawBody, string? signatureHeader, CancellationToken ct)
    {
        // Live mode would call Stripe.Webhook.ConstructEvent(rawBody, signatureHeader, _config["Stripe:WebhookSecret"]);
        // and dispatch on event.Type. Today we accept and no-op.
        return Task.CompletedTask;
    }
}
