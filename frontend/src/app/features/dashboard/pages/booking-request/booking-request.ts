import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Badge, Button, CostTable, FormField, Input, PageHeader, type CostLine, type Crumb } from '../../../../shared';
import { listingById, MOCK_LISTINGS } from '../../../../core/mock-data';

@Component({
  selector: 'app-dashboard-booking-request',
  imports: [RouterLink, FormsModule, Badge, Button, CostTable, FormField, Input, PageHeader],
  template: `
    @if (listing(); as l) {
      <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-10">
        <app-page-header title="Review your booking" [breadcrumbs]="crumbs()" />

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-6">
          <div>
            <div class="flex gap-4 p-5 border border-line bg-bone mb-6">
              <div class="w-24 h-20 bg-surface flex-shrink-0"></div>
              <div class="flex-1">
                <div class="flex gap-2 mb-2">
                  <app-badge kind="condition" [condition]="l.condition" />
                  <app-badge kind="gear-type" [label]="l.gearTypeLabel" />
                </div>
                <h3 class="font-condensed text-h3 font-extrabold uppercase text-slate mb-1">{{ l.title }}</h3>
                <p class="text-xs text-muted">
                  Listed by {{ l.listerName }}
                  @if (l.rating) { · ★ {{ l.rating.average }} ({{ l.rating.count }}) }
                </p>
              </div>
            </div>

            <section class="mb-6">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-2">Rental period</p>
              <div class="grid grid-cols-2 border border-line">
                <div class="p-4 border-r border-line">
                  <div class="font-mono text-xs text-muted uppercase tracking-[0.10em] mb-1">Pickup</div>
                  <div class="font-condensed text-h3 font-extrabold uppercase text-slate">Wed, Oct 15</div>
                </div>
                <div class="p-4">
                  <div class="font-mono text-xs text-muted uppercase tracking-[0.10em] mb-1">Return</div>
                  <div class="font-condensed text-h3 font-extrabold uppercase text-slate">Sun, Oct 19</div>
                </div>
              </div>
              <p class="text-xs text-muted mt-2">
                {{ nights }} nights · <a class="text-olive underline" [routerLink]="['/listing', l.id]">Edit dates</a>
              </p>
            </section>

            <section class="mb-6">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-2">Pickup</p>
              <p class="text-body text-slate mb-1">ZIP {{ l.pickupZip }} · full address shared after confirmation</p>
              <p class="text-sm text-muted leading-relaxed">
                {{ l.listerName }} will message you to coordinate exact time and location once they accept your request.
              </p>
            </section>

            <section>
              <app-form-field [label]="'Message to ' + l.listerName + ' (optional)'"
                hint="A short note increases your odds of acceptance, especially with a lister you haven't rented from before.">
                <textarea
                  appInput
                  rows="4"
                  [(ngModel)]="message"
                  placeholder="Hey — heading out for an elk hunt the week of Oct 15…"
                ></textarea>
              </app-form-field>
            </section>
          </div>

          <aside>
            <div class="sticky top-20 border border-line bg-bone p-6">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Cost breakdown</p>
              <app-cost-table [lines]="costLines()" [totalCents]="totalCents()" totalLabel="Total to charge" [depositCents]="l.depositCents" />
              <button appButton variant="primary" class="w-full mt-5" (click)="continueToCheckout()">
                Continue to payment
              </button>
              <p class="text-center text-xs text-muted mt-3">You won't be charged until {{ l.listerName }} accepts.</p>
            </div>
          </aside>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBookingRequest {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly listingId = toSignal(
    this.route.params.pipe(map((p) => p['id'] as string)),
    { initialValue: MOCK_LISTINGS[0].id },
  );

  protected readonly listing = computed(() => listingById(this.listingId()) ?? null);
  protected readonly nights = 4;
  protected readonly costLines = computed<CostLine[]>(() => {
    const l = this.listing();
    if (!l) return [];
    return [
      { label: `$${l.dailyRateCents / 100} × ${this.nights} days`, amountCents: l.dailyRateCents * this.nights },
      { label: `Service fee (${l.serviceFeePct}%)`, amountCents: Math.round(l.dailyRateCents * this.nights * l.serviceFeePct / 100) },
    ];
  });
  protected readonly totalCents = computed(() =>
    this.costLines().reduce((sum, line) => sum + line.amountCents, 0),
  );

  protected readonly crumbs = computed<Crumb[]>(() => {
    const l = this.listing();
    return l ? [{ label: l.title, route: `/listing/${l.id}` }, { label: 'Review & request' }] : [];
  });

  protected message = '';

  protected continueToCheckout(): void {
    const l = this.listing();
    if (!l) return;
    this.router.navigate(['/booking', `bk-new-${l.id}`, 'checkout']);
  }
}
