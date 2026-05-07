import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Alert, BookingCard, Button, PageHeader, StatCard } from '../../../../shared';
import { AuthService } from '../../../../core/services/auth.service';
import { BookingsService } from '../../../../core/services/bookings.service';
import { loadable } from '../../../../core/loading/loadable';

@Component({
  selector: 'app-dashboard-home',
  imports: [RouterLink, Alert, BookingCard, Button, PageHeader, StatCard],
  template: `
    <div class="px-8 py-8">
      <app-page-header [title]="'Welcome back, ' + firstName()" subtitle="Here's what's happening with your gear today.">
        <div slot="actions" class="flex gap-2">
          <a appButton variant="ghost" routerLink="/search">Browse gear</a>
          <a appButton variant="secondary" routerLink="/dashboard/listings/new">Create listing</a>
        </div>
      </app-page-header>

      @if (firstActive(); as active) {
        <app-alert tone="warning" class="block mb-6">
          <strong>Active rental.</strong>
          {{ active.gearTitle }} — counterparty {{ active.counterpartyName }}.
          <a [routerLink]="['/dashboard/bookings', active.id]" class="text-olive underline">View booking →</a>
        </app-alert>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <app-stat-card overline="Active bookings" [value]="activeCount()" sublabel="Confirmed or in-progress" />
        <app-stat-card overline="Unread messages" value="—" sublabel="See messages tab" tone="pending" />
        <app-stat-card overline="Next payout" value="—" sublabel="See earnings" tone="primary" />
        <app-stat-card overline="YTD earnings" value="—" sublabel="See earnings" />
      </div>

      <h2 class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] text-slate mb-4">
        Active & upcoming
      </h2>
      @if (loading()) {
        <div class="text-sm text-muted">Loading bookings…</div>
      } @else {
        <div class="space-y-3">
          @for (booking of upcomingBookings(); track booking.id) {
            <app-booking-card [booking]="booking" />
          } @empty {
            <p class="text-sm text-muted">No upcoming bookings.</p>
          }
        </div>
      }
      <a routerLink="/dashboard/bookings" class="text-olive text-sm underline mt-4 inline-block">
        View all bookings →
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHome {
  private readonly auth = inject(AuthService);
  private readonly bookings = inject(BookingsService);

  protected readonly firstName = computed(() => this.auth.currentUser()?.name.split(' ')[0] ?? 'Hunter');

  private readonly activeAndConfirmed = loadable(
    this.bookings.list({ status: ['active', 'confirmed'], pageSize: 10 }),
  );
  protected readonly loading = this.activeAndConfirmed.loading;
  protected readonly upcomingBookings = computed(() =>
    (this.activeAndConfirmed.data()?.items ?? []).slice(0, 3),
  );
  protected readonly firstActive = computed(() =>
    (this.activeAndConfirmed.data()?.items ?? []).find((b) => b.status === 'active'),
  );
  protected readonly activeCount = computed(() => String(this.activeAndConfirmed.data()?.total ?? 0));
}
