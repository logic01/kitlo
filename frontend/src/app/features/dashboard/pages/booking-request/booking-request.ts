import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import {
  Alert,
  Badge,
  Button,
  CostTable,
  FormField,
  Input,
  PageHeader,
  type CostLine,
  type Crumb,
} from '../../../../shared';
import { BookingsService, ListingsService } from '../../../../core/services';
import type { Listing } from '../../../../core/models';

@Component({
  selector: 'app-dashboard-booking-request',
  imports: [RouterLink, FormsModule, Alert, Badge, Button, CostTable, FormField, Input, PageHeader],
  template: `
    @if (listing(); as l) {
      <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-10">
        <app-page-header title="Review your booking" [breadcrumbs]="crumbs()" />

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-6">
          <div>
            <div class="flex gap-4 p-5 border border-line bg-bone mb-6">
              @if (l.heroPhotoUrl) {
                <img [src]="l.heroPhotoUrl" [alt]="l.title" class="w-24 h-20 object-cover flex-shrink-0" />
              } @else {
                <div class="w-24 h-20 bg-surface flex-shrink-0"></div>
              }
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
                  <div class="font-condensed text-h3 font-extrabold uppercase text-slate">{{ formatDate(startDate()) }}</div>
                </div>
                <div class="p-4">
                  <div class="font-mono text-xs text-muted uppercase tracking-[0.10em] mb-1">Return</div>
                  <div class="font-condensed text-h3 font-extrabold uppercase text-slate">{{ formatDate(endDate()) }}</div>
                </div>
              </div>
              <p class="text-xs text-muted mt-2">
                {{ days() }} day{{ days() === 1 ? '' : 's' }} ·
                <a class="text-olive underline" [routerLink]="['/listing', l.id]">Edit dates</a>
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

            @if (error(); as msg) {
              <app-alert tone="danger" class="block mt-4">{{ msg }}</app-alert>
            }
          </div>

          <aside>
            <div class="sticky top-20 border border-line bg-bone p-6">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Cost breakdown</p>
              <app-cost-table [lines]="costLines()" [totalCents]="totalCents()" totalLabel="Total to charge" [depositCents]="l.depositCents" />
              <button
                appButton
                variant="primary"
                class="w-full mt-5"
                [disabled]="submitting() || !validRange()"
                (click)="submitRequest(l.id)"
              >
                {{ submitting() ? 'Submitting…' : 'Continue to payment' }}
              </button>
              <p class="text-center text-xs text-muted mt-3">You won't be charged until {{ l.listerName }} accepts.</p>
            </div>
          </aside>
        </div>
      </div>
    } @else {
      <div class="px-8 py-16 text-center text-muted">Listing not found.</div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBookingRequest {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly listings = inject(ListingsService);
  private readonly bookings = inject(BookingsService);

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected message = '';

  private readonly listingId = toSignal(
    this.route.params.pipe(switchMap((p) => of(p['id'] as string))),
    { initialValue: '' },
  );

  protected readonly listing = toSignal(
    this.route.params.pipe(
      switchMap((p) =>
        this.listings.getById(p['id'] as string).pipe(catchError(() => of(null as Listing | null))),
      ),
    ),
    { initialValue: null as Listing | null },
  );

  /** ISO `yyyy-MM-dd` from the public listing detail page. */
  protected readonly startDate = toSignal(
    this.route.queryParamMap.pipe(switchMap((q) => of(q.get('start') ?? ''))),
    { initialValue: '' },
  );
  protected readonly endDate = toSignal(
    this.route.queryParamMap.pipe(switchMap((q) => of(q.get('end') ?? ''))),
    { initialValue: '' },
  );

  protected readonly validRange = computed(
    () => /^\d{4}-\d{2}-\d{2}$/.test(this.startDate()) && /^\d{4}-\d{2}-\d{2}$/.test(this.endDate()),
  );

  protected readonly days = computed(() => {
    if (!this.validRange()) return 0;
    const ms = +new Date(this.endDate()) - +new Date(this.startDate());
    return Math.max(1, Math.round(ms / 86_400_000));
  });

  protected readonly costLines = computed<CostLine[]>(() => {
    const l = this.listing();
    if (!l) return [];
    const days = this.days();
    if (days === 0) return [];
    const subtotal = l.dailyRateCents * days;
    const fee = Math.round(subtotal * (l.serviceFeePct / 100));
    return [
      { label: `$${l.dailyRateCents / 100} × ${days} day${days === 1 ? '' : 's'}`, amountCents: subtotal },
      { label: `Service fee (${l.serviceFeePct}%)`, amountCents: fee },
    ];
  });

  protected readonly totalCents = computed(() =>
    this.costLines().reduce((sum, line) => sum + line.amountCents, 0),
  );

  protected readonly crumbs = computed<Crumb[]>(() => {
    const l = this.listing();
    return l ? [{ label: l.title, route: `/listing/${l.id}` }, { label: 'Review & request' }] : [];
  });

  protected formatDate(iso: string): string {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '—';
    // Treat as local-date-only; appending T00:00:00 avoids UTC offset surprises.
    return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  protected submitRequest(listingId: string): void {
    if (this.submitting() || !this.validRange()) return;
    const l = this.listing();
    if (!l) return;
    this.error.set(null);
    this.submitting.set(true);
    this.bookings
      .create({
        listingId,
        gearTitle: l.title,
        gearPhotoUrl: l.heroPhotoUrl,
        startDate: this.startDate(),
        endDate: this.endDate(),
        counterpartyName: l.listerName,
        totalCents: this.totalCents(),
      })
      .subscribe({
        next: (booking) => this.router.navigate(['/booking', booking.id, 'checkout']),
        error: (err: { error?: { message?: string } }) => {
          this.error.set(err.error?.message ?? 'Could not create booking.');
          this.submitting.set(false);
        },
      });
  }
}
