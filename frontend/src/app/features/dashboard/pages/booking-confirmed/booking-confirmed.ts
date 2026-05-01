import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, Timeline, Alert } from '../../../../shared';
import type { BookingTimelineEvent } from '../../../../core/models/booking';

@Component({
  selector: 'app-dashboard-booking-confirmed',
  imports: [RouterLink, Button, Timeline, Alert],
  template: `
    <div class="mx-auto max-w-2xl px-(--kitlo-page-gutter) py-12 text-center">
      <div class="font-condensed text-display text-olive font-black mb-3">✓</div>
      <h1 class="font-condensed text-h1 font-black uppercase text-slate leading-none mb-2">
        Booking confirmed
      </h1>
      <p class="text-body text-muted mb-8">
        Marcus accepted your request. The deposit hold is in place and pickup details are ready.
      </p>

      <div class="border border-line bg-bone p-6 text-left mb-6">
        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-2">Pickup</p>
        <p class="font-condensed text-h3 font-extrabold uppercase text-slate mb-1">
          Wed, Oct 15 · 7:30 AM
        </p>
        <p class="text-sm text-muted">Boulder REI · 1881 28th St, Boulder, CO 80301</p>
        <p class="text-sm text-muted mt-1">Marcus T. · (555) 014-1287</p>
      </div>

      <app-alert tone="info" class="block text-left mb-6">
        Bring a government photo ID. Marcus will inspect alongside you and you'll both sign off on condition before keys.
      </app-alert>

      <div class="text-left">
        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">What happens next</p>
        <app-timeline [events]="events" />
      </div>

      <div class="mt-8 flex justify-center gap-3">
        <a appButton variant="primary" routerLink="/dashboard/bookings">View my bookings</a>
        <a appButton variant="ghost" routerLink="/search">Browse more gear</a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBookingConfirmed {
  protected readonly events: BookingTimelineEvent[] = [
    { id: 'e-1', label: 'Booking confirmed', detail: 'Deposit authorized · payment held in escrow', occurredAt: new Date().toISOString(), state: 'done' },
    { id: 'e-2', label: 'Pickup scheduled', detail: 'Wed, Oct 15 · 7:30 AM', occurredAt: '2026-05-12T13:30:00Z', state: 'now' },
    { id: 'e-3', label: 'Active rental', detail: 'Returns Sun, Oct 19', occurredAt: '2026-05-15T13:30:00Z', state: 'done' },
    { id: 'e-4', label: 'Return & review', detail: 'Funds release after both sides confirm', occurredAt: '2026-05-19T20:00:00Z', state: 'done' },
  ];
}
