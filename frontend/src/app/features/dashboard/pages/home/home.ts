import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Alert, BookingCard, Button, PageHeader, StatCard } from '../../../../shared';
import { AuthService } from '../../../../core/services/auth.service';
import { MOCK_BOOKINGS } from '../../../../core/mock-data';

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

      <app-alert tone="warning" class="block mb-6">
        <strong>Return today.</strong>
        Your rental of <strong>Pulsar Helion 2 XP50 Pro</strong> is due back to Marcus T. by 6:00 PM.
        <a routerLink="/dashboard/bookings/bk-001" class="text-olive underline">View booking →</a>
      </app-alert>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <app-stat-card overline="Active bookings" value="2" sublabel="1 as renter · 1 as lister" />
        <app-stat-card overline="Unread messages" value="3" sublabel="From 2 conversations" tone="pending" />
        <app-stat-card overline="Next payout" value="$224.50" sublabel="Tue, Oct 21" tone="primary" />
        <app-stat-card overline="YTD earnings" value="$3,142" sublabel="12 rentals completed" />
      </div>

      <h2 class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] text-slate mb-4">
        Active & upcoming
      </h2>
      <div class="space-y-3">
        @for (booking of upcomingBookings(); track booking.id) {
          <app-booking-card [booking]="booking" />
        }
      </div>
      <a routerLink="/dashboard/bookings" class="text-olive text-sm underline mt-4 inline-block">
        View all bookings →
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHome {
  private readonly auth = inject(AuthService);
  protected readonly firstName = computed(() => this.auth.currentUser()?.name.split(' ')[0] ?? 'Hunter');
  protected readonly upcomingBookings = computed(() =>
    MOCK_BOOKINGS.filter((b) => b.status === 'active' || b.status === 'confirmed').slice(0, 3),
  );
}
