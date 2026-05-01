import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Badge, Button, EmptyState, PageHeader, Spinner, StatusBadge, Tabs, type TabDef } from '../../../../shared';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { AuthService } from '../../../../core/services/auth.service';
import { ListingsService } from '../../../../core/services/listings.service';
import type { ListingSummary } from '../../../../core/models/listing';

interface ListingRow extends ListingSummary {
  rowStatus: 'active' | 'paused' | 'pending' | 'archived';
  bookingsCount: number;
  monthlyEarningsCents: number;
}

@Component({
  selector: 'app-dashboard-listings',
  imports: [RouterLink, MoneyPipe, Badge, Button, EmptyState, PageHeader, Spinner, StatusBadge, Tabs],
  template: `
    <div class="px-8 py-8">
      <app-page-header title="My listings" subtitle="Pause, edit, or archive your gear.">
        <div slot="actions" class="flex gap-2">
          <a appButton variant="ghost" routerLink="/dashboard/listings/bundle/new">New bundle</a>
          <a appButton variant="primary" routerLink="/dashboard/listings/new">New listing</a>
        </div>
      </app-page-header>

      <app-tabs [tabs]="tabs()" [(activeId)]="activeTab" />

      @if (loading()) {
        <div class="mt-10 text-center"><app-spinner /></div>
      } @else {
      <div class="mt-6 space-y-3">
        @for (row of filtered(); track row.id) {
          <article class="grid grid-cols-[120px_1fr_auto] gap-4 items-center border border-line bg-bone p-3">
            <div class="h-20 bg-surface"></div>
            <div>
              <div class="flex gap-2 mb-1">
                <app-status-badge [status]="row.rowStatus" />
                <app-badge kind="condition" [condition]="row.condition" />
                <app-badge kind="gear-type" [label]="row.gearTypeLabel" />
              </div>
              <h3 class="font-condensed text-h3 font-extrabold uppercase text-slate">{{ row.title }}</h3>
              <p class="text-xs text-muted">
                {{ row.dailyRateCents | money }}/day · {{ row.bookingsCount }} bookings · {{ row.monthlyEarningsCents | money }} this month
              </p>
            </div>
            <div class="flex flex-col gap-2 justify-end">
              <a appButton variant="ghost" [routerLink]="['/dashboard/listings', row.id, 'calendar']">Calendar</a>
              <a appButton variant="secondary" [routerLink]="['/dashboard/listings', row.id, 'edit']">Edit</a>
            </div>
          </article>
        } @empty {
          <app-empty-state title="No listings yet" body="Add your first piece of gear to start renting." />
        }
      </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardListings {
  private readonly listings = inject(ListingsService);
  private readonly auth = inject(AuthService);

  protected readonly activeTab = signal('all');

  private readonly result = toSignal(
    this.listings
      .search({ pageSize: 50 })
      .pipe(
        map((page) => {
          const myName = this.auth.currentUser()?.name;
          const items = myName
            ? page.items.filter((l) => l.listerName === myName)
            : page.items.slice(0, 6);
          return items.map<ListingRow>((l, i) => ({
            ...l,
            rowStatus: i === 1 ? 'paused' : 'active',
            bookingsCount: 8 + i,
            monthlyEarningsCents: 23000 + i * 4500,
          }));
        }),
      ),
    { initialValue: undefined },
  );

  protected readonly loading = computed(() => this.result() === undefined);

  protected readonly rows = computed<ListingRow[]>(() => this.result() ?? []);

  protected readonly filtered = computed(() => {
    const tab = this.activeTab();
    if (tab === 'all') return this.rows();
    return this.rows().filter((r) => r.rowStatus === tab);
  });

  protected readonly tabs = computed<TabDef[]>(() => [
    { id: 'all', label: 'All', count: this.rows().length },
    { id: 'active', label: 'Active' },
    { id: 'paused', label: 'Paused' },
    { id: 'archived', label: 'Archived' },
  ]);
}
