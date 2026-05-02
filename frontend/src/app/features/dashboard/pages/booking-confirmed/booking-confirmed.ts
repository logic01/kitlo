import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, startWith, switchMap } from 'rxjs';
import { Alert, Button, Spinner, Timeline } from '../../../../shared';
import { BookingsService } from '../../../../core/services';
import type { BookingSummary, BookingTimelineEvent } from '../../../../core/models';

@Component({
  selector: 'app-dashboard-booking-confirmed',
  imports: [RouterLink, Alert, Button, Spinner, Timeline],
  template: `
    @if (loading()) {
      <div class="px-8 py-16 text-center"><app-spinner /></div>
    } @else if (booking(); as b) {
      <div class="mx-auto max-w-2xl px-(--kitlo-page-gutter) py-12 text-center">
        <div class="font-condensed text-display text-olive font-black mb-3">✓</div>
        <h1 class="font-condensed text-h1 font-black uppercase text-slate leading-none mb-2">
          Booking submitted
        </h1>
        <p class="text-body text-muted mb-8">
          Your request was sent to {{ b.counterpartyName }}. Funds are held in escrow once they accept.
        </p>

        <div class="border border-line bg-bone p-6 text-left mb-6">
          <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-2">Pickup window</p>
          <p class="font-condensed text-h3 font-extrabold uppercase text-slate mb-1">
            {{ formatDate(b.startDate) }} → {{ formatDate(b.endDate) }}
          </p>
          <p class="text-sm text-muted">{{ b.counterpartyName }} will message you with pickup details.</p>
        </div>

        <app-alert tone="info" class="block text-left mb-6">
          Bring a government photo ID. {{ b.counterpartyName }} will inspect with you and you'll both confirm condition before keys.
        </app-alert>

        <div class="text-left">
          <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">What happens next</p>
          <app-timeline [events]="events()" />
        </div>

        <div class="mt-8 flex justify-center gap-3 flex-wrap">
          <a appButton variant="primary" [routerLink]="['/dashboard/bookings', b.id]">View booking</a>
          <a appButton variant="ghost" routerLink="/search">Browse more gear</a>
        </div>
      </div>
    } @else {
      <div class="px-8 py-16 text-center text-muted">Booking not found.</div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBookingConfirmed {
  private readonly route = inject(ActivatedRoute);
  private readonly bookings = inject(BookingsService);

  private readonly bookingResult = toSignal(
    this.route.params.pipe(
      switchMap((p) => {
        const id = p['id'] as string;
        if (!id) return of<BookingSummary | null>(null);
        return this.bookings.getById(id).pipe(catchError(() => of<BookingSummary | null>(null)));
      }),
      startWith(undefined as BookingSummary | null | undefined),
    ),
    { initialValue: undefined as BookingSummary | null | undefined },
  );

  protected readonly loading = computed(() => this.bookingResult() === undefined);
  protected readonly booking = computed(() => this.bookingResult() ?? null);

  protected readonly events = computed<BookingTimelineEvent[]>(() => {
    const b = this.booking();
    if (!b) return [];
    return [
      { id: 'e-1', label: 'Booking requested', detail: 'Awaiting lister approval', occurredAt: new Date().toISOString(), state: 'now' },
      { id: 'e-2', label: 'Pickup window', detail: this.formatDate(b.startDate), occurredAt: b.startDate, state: 'done' },
      { id: 'e-3', label: 'Return', detail: this.formatDate(b.endDate), occurredAt: b.endDate, state: 'done' },
      { id: 'e-4', label: 'Funds release', detail: 'After both sides confirm return', occurredAt: b.endDate, state: 'done' },
    ];
  });

  protected formatDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso + (iso.length === 10 ? 'T00:00:00' : '')).toLocaleDateString(undefined, {
      weekday: 'short', month: 'short', day: 'numeric',
    });
  }
}
