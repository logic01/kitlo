import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  AvailabilityCalendar,
  Button,
  PageHeader,
  type Crumb,
} from '../../../../shared';
import { ListingsService } from '../../../../core/services';

@Component({
  selector: 'app-dashboard-availability-calendar',
  imports: [AvailabilityCalendar, Button, PageHeader],
  template: `
    @if (listing(); as l) {
      <div class="px-8 py-8 max-w-3xl">
        <app-page-header title="Availability" [breadcrumbs]="crumbs()">
          <div slot="actions">
            <button appButton variant="primary" type="button">Save</button>
          </div>
        </app-page-header>

        <p class="text-sm text-muted leading-relaxed mt-5 mb-5">
          Click days to block them. Booked dates are locked. Renters see a read-only view of this calendar.
        </p>
        <app-availability-calendar mode="select-range" />
      </div>
    } @else {
      <div class="px-8 py-16 text-center text-muted">Listing not found.</div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardAvailabilityCalendar {
  private readonly route = inject(ActivatedRoute);
  private readonly listings = inject(ListingsService);

  private readonly listingId = toSignal(
    this.route.params.pipe(map((p) => p['id'] as string | undefined)),
    { initialValue: undefined },
  );

  protected readonly listing = toSignal(
    this.route.params.pipe(
      map((p) => p['id'] as string | undefined),
      switchMap((id) => (id ? this.listings.getById(id) : of(null))),
    ),
    { initialValue: null },
  );

  protected readonly crumbs = computed<Crumb[]>(() => [
    { label: 'My listings', route: '/dashboard/listings' },
    { label: this.listing()?.title ?? '', route: `/dashboard/listings/${this.listingId() ?? ''}/edit` },
    { label: 'Availability' },
  ]);
}
