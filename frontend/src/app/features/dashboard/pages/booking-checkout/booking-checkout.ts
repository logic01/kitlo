import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button, CostTable, FormField, Input, PageHeader, StripePaymentForm, type CostLine } from '../../../../shared';
import { BookingsService } from '../../../../core/services/bookings.service';

@Component({
  selector: 'app-dashboard-booking-checkout',
  imports: [RouterLink, Button, CostTable, FormField, Input, PageHeader, StripePaymentForm],
  template: `
    <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-10">
      <app-page-header title="Confirm payment" />

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-6">
        <div>
          <div class="flex gap-4 p-5 border border-line bg-bone mb-6">
            <div class="w-20 h-16 bg-surface flex-shrink-0"></div>
            <div class="flex-1">
              <h3 class="font-condensed text-h3 font-extrabold uppercase text-slate mb-1">
                Pulsar Helion 2 XP50 Pro
              </h3>
              <p class="text-xs text-muted">Oct 15 → Oct 19 · 4 nights · Marcus T.</p>
            </div>
          </div>

          <section class="mb-6">
            <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Pay with</p>
            <button
              type="button"
              class="w-full flex items-center gap-4 p-4 border-2 transition-colors text-left mb-3"
              [class.border-olive]="cardId() === 'saved'"
              [class.bg-olive-pale]="cardId() === 'saved'"
              [class.border-line]="cardId() !== 'saved'"
              (click)="cardId.set('saved')"
            >
              <div class="w-9 h-6 bg-surface flex items-center justify-center font-mono text-xs">VISA</div>
              <div class="flex-1">
                <div class="font-semibold text-sm">Visa ending in 4242</div>
                <div class="font-mono text-xs text-muted">Exp 09 / 2028</div>
              </div>
              @if (cardId() === 'saved') {
                <span class="font-mono text-xs text-olive font-semibold">SELECTED</span>
              }
            </button>
            <button
              type="button"
              class="w-full p-3 border border-dashed border-line text-sm text-muted hover:border-slate"
              (click)="cardId.set('new')"
            >
              + Use a different card
            </button>

            @if (cardId() === 'new') {
              <div class="mt-4">
                <app-stripe-payment-form [amountCents]="totalCents" />
              </div>
            }
          </section>

          <section class="mb-6">
            <app-form-field label="Billing ZIP">
              <input appInput placeholder="59715" maxlength="10" class="max-w-[160px]" />
            </app-form-field>
          </section>

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
              [lines]="costLines"
              [totalCents]="totalCents"
              totalLabel="Total today"
              [depositCents]="25000"
            />
            <button
              appButton
              variant="primary"
              class="w-full mt-5"
              [disabled]="submitting()"
              (click)="confirm()"
            >
              {{ submitting() ? 'Confirming…' : 'Confirm booking — charge $392.00' }}
            </button>
            <p class="text-center font-mono text-xs text-muted mt-2">🔒 Secured by Stripe</p>
          </div>
        </aside>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBookingCheckout {
  private readonly router = inject(Router);
  private readonly bookings = inject(BookingsService);

  protected readonly cardId = signal<'saved' | 'new'>('saved');
  protected readonly submitting = signal(false);
  protected readonly costLines: CostLine[] = [
    { label: '$85 × 4 days', amountCents: 34000 },
    { label: 'Service fee', amountCents: 3400 },
    { label: 'Protection plan', amountCents: 1800 },
  ];
  protected readonly totalCents = 39200;

  protected confirm(): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.bookings
      .create({
        listingId: 'lst-001',
        gearTitle: 'Pulsar Helion 2 XP50 Pro',
        gearPhotoUrl: '',
        startDate: '2026-10-15',
        endDate: '2026-10-19',
        counterpartyName: 'Marcus T.',
        totalCents: this.totalCents,
      })
      .subscribe({
        next: (booking) => this.router.navigate(['/booking', booking.id, 'confirmed']),
        error: () => this.submitting.set(false),
      });
  }
}
