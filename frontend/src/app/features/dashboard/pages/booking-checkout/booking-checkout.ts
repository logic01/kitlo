import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, startWith, switchMap } from 'rxjs';
import {
  Alert,
  Button,
  CostTable,
  PageHeader,
  Spinner,
  StripePaymentForm,
  type CostLine,
} from '../../../../shared';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { BookingsService, PaymentsService } from '../../../../core/services';
import type { BookingSummary } from '../../../../core/models';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-dashboard-booking-checkout',
  imports: [RouterLink, Alert, Button, CostTable, MoneyPipe, PageHeader, Spinner, StripePaymentForm],
  template: `
    @if (loading()) {
      <div class="px-8 py-16 text-center"><app-spinner /></div>
    } @else if (booking(); as b) {
      <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-10">
        <app-page-header title="Confirm payment" />

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-6">
          <div>
            <div class="flex gap-4 p-5 border border-line bg-bone mb-6">
              @if (b.gearPhotoUrl) {
                <img [src]="b.gearPhotoUrl" [alt]="b.gearTitle" class="w-20 h-16 object-cover flex-shrink-0" />
              } @else {
                <div class="w-20 h-16 bg-surface flex-shrink-0"></div>
              }
              <div class="flex-1">
                <h3 class="font-condensed text-h3 font-extrabold uppercase text-slate mb-1">{{ b.gearTitle }}</h3>
                <p class="text-xs text-muted">
                  {{ formatDate(b.startDate) }} → {{ formatDate(b.endDate) }} · {{ b.counterpartyName }}
                </p>
              </div>
            </div>

            <section class="mb-6">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Pay with</p>
              <app-stripe-payment-form
                [amountCents]="b.totalCents"
                [clientSecret]="clientSecret()"
                (submitted)="onPaymentSucceeded(b.id)"
              />
            </section>

            @if (error(); as msg) {
              <app-alert tone="danger" class="block">{{ msg }}</app-alert>
            }

            <p class="text-xs text-muted leading-relaxed">
              By confirming, you agree to the
              <a routerLink="/terms" class="text-olive underline">Kitlo cancellation policy</a>
              and authorize the deposit hold.
            </p>
          </div>

          <aside>
            <div class="sticky top-20 border border-line bg-bone p-6">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Order summary</p>
              <app-cost-table
                [lines]="costLines(b)"
                [totalCents]="b.totalCents"
                totalLabel="Total today"
              />
              <p class="text-sm text-muted mt-3">
                Charge total: <span class="font-mono">{{ b.totalCents | money }}</span>
              </p>
              @if (!stripeKeyConfigured) {
                <button
                  appButton
                  variant="primary"
                  class="w-full mt-5"
                  [disabled]="submitting()"
                  (click)="confirmWithoutStripe(b.id)"
                >
                  {{ submitting() ? 'Confirming…' : 'Confirm booking (test)' }}
                </button>
                <p class="font-mono text-xs text-muted text-center mt-2">
                  Test mode — Stripe key not configured.
                </p>
              }
            </div>
          </aside>
        </div>
      </div>
    } @else {
      <div class="px-8 py-16 text-center text-muted">Booking not found.</div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBookingCheckout {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookings = inject(BookingsService);
  private readonly payments = inject(PaymentsService);

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly clientSecret = signal<string | null>(null);
  protected readonly stripeKeyConfigured = !!environment.stripePublicKey;

  private readonly bookingResult = toSignal(
    this.route.params.pipe(
      switchMap((p) => {
        const id = p['id'] as string;
        if (!id) return of<BookingSummary | null>(null);
        // Fetch booking + create the payment intent in parallel-ish.
        return this.bookings.getById(id).pipe(
          switchMap((b) =>
            this.payments.createIntent(b.id).pipe(
              switchMap((pi) => {
                this.clientSecret.set(pi.clientSecret);
                return of<BookingSummary | null>(b);
              }),
              catchError(() => of<BookingSummary | null>(b)),
            ),
          ),
          catchError(() => of<BookingSummary | null>(null)),
        );
      }),
      startWith(undefined as BookingSummary | null | undefined),
    ),
    { initialValue: undefined as BookingSummary | null | undefined },
  );

  protected readonly loading = computed(() => this.bookingResult() === undefined);
  protected readonly booking = computed(() => this.bookingResult() ?? null);

  protected costLines(b: BookingSummary): CostLine[] {
    return [{ label: 'Booking total', amountCents: b.totalCents }];
  }

  protected formatDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso + (iso.length === 10 ? 'T00:00:00' : '')).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }

  /** Stripe Elements path — payment confirmed client-side, then ack server-side. */
  protected onPaymentSucceeded(bookingId: string): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.payments.confirm(bookingId).subscribe({
      next: () => this.router.navigate(['/booking', bookingId, 'confirmed']),
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err.error?.message ?? 'Server failed to confirm the payment.');
        this.submitting.set(false);
      },
    });
  }

  /** No-Stripe-key fallback: skip the card element and capture server-side directly. */
  protected confirmWithoutStripe(bookingId: string): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.payments.confirm(bookingId).subscribe({
      next: () => this.router.navigate(['/booking', bookingId, 'confirmed']),
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err.error?.message ?? 'Could not confirm the booking.');
        this.submitting.set(false);
      },
    });
  }
}
