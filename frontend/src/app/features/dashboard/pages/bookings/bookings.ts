import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  BookingCard,
  BookingCardSkeleton,
  EmptyState,
  PageHeader,
  Tabs,
  type TabDef,
} from '../../../../shared';
import { BookingsService } from '../../../../core/services/bookings.service';
import { loadable } from '../../../../core/loading/loadable';
import type { BookingStatus } from '../../../../shared';

const TAB_FILTERS: Record<string, BookingStatus[]> = {
  all: [],
  upcoming: ['confirmed'],
  active: ['active'],
  past: ['completed', 'returned', 'cancelled', 'disputed'],
};

@Component({
  selector: 'app-dashboard-bookings',
  imports: [BookingCard, BookingCardSkeleton, EmptyState, PageHeader, Tabs],
  template: `
    <div class="px-8 py-8">
      <app-page-header title="Bookings" subtitle="Your rentals as renter and lister." />

      <app-tabs [tabs]="tabs" [(activeId)]="activeTab" />

      <div class="mt-6 space-y-3" [attr.aria-busy]="loading()">
        @if (loading()) {
          @for (_ of skeletonSlots; track $index) {
            <app-booking-card-skeleton />
          }
        } @else {
          @for (booking of filtered(); track booking.id) {
            <app-booking-card [booking]="booking" />
          } @empty {
            <app-empty-state title="Nothing here yet" body="Bookings in this view will show up once they're created." />
          }
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBookings {
  private readonly bookings = inject(BookingsService);

  protected readonly activeTab = signal<string>('all');
  protected readonly tabs: TabDef[] = [
    { id: 'all', label: 'All' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'active', label: 'Active' },
    { id: 'past', label: 'Past' },
  ];

  private readonly page = loadable(
    this.bookings.list({ pageSize: 50 }).pipe(map((p) => p.items)),
  );

  protected readonly loading = this.page.loading;
  protected readonly skeletonSlots = Array(4).fill(0);

  protected readonly filtered = computed(() => {
    const items = this.page.data() ?? [];
    const filter = TAB_FILTERS[this.activeTab()] ?? [];
    if (!filter.length) return items;
    return items.filter((b) => filter.includes(b.status));
  });
}
