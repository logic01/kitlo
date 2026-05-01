import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Alert, PageHeader, QueueItem, StatCard } from '../../../../shared';
import { AdminService } from '../../../../core/services/admin.service';
import type { AdminQueueItem } from '../../../../core/models/admin';

@Component({
  selector: 'app-admin-home',
  imports: [RouterLink, Alert, PageHeader, QueueItem, StatCard],
  template: `
    <div class="px-8 py-8">
      <app-page-header title="Admin overview" subtitle="Today: 3 SLA breaches · 7 listings to review" />

      <div class="space-y-3 mt-5 mb-7">
        <app-alert tone="danger">
          <strong>SLA breach.</strong>
          Dispute dp-001 has been open 5d 22h — past 5-day target.
          <a routerLink="/admin/disputes/dp-001" class="text-olive underline">Review now →</a>
        </app-alert>
        <app-alert tone="warning">
          <strong>SLA risk.</strong>
          2 high-value listings approaching 24h queue limit.
          <a routerLink="/admin/listings" class="text-olive underline">View queue →</a>
        </app-alert>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <app-stat-card overline="Listings pending" [value]="listingQueue().length.toString()" sublabel="In review queue" />
        <app-stat-card overline="Disputes open" [value]="disputeQueue().length.toString()" sublabel="Awaiting ruling" tone="pending" />
        <app-stat-card overline="Flagged users" [value]="verificationQueue().length.toString()" sublabel="Awaiting review" />
        <app-stat-card overline="Active rentals" value="142" sublabel="$48K in escrow" tone="primary" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] text-slate">
              Listings queue — top 3
            </h2>
            <a routerLink="/admin/listings" class="text-xs text-olive underline">View all →</a>
          </div>
          <div class="space-y-2">
            @for (item of topListings(); track item.id) {
              <app-queue-item [item]="item" [route]="['/admin/listings', item.id]" />
            }
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] text-slate">
              Disputes — open
            </h2>
            <a routerLink="/admin/disputes" class="text-xs text-olive underline">View all →</a>
          </div>
          <div class="space-y-2">
            @for (item of disputeQueue(); track item.id) {
              <app-queue-item [item]="item" [route]="['/admin/disputes', item.id]" />
            }
          </div>
        </section>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHome {
  private readonly admin = inject(AdminService);

  protected readonly listingQueue = toSignal(this.admin.getListingQueue(), {
    initialValue: [] as AdminQueueItem[],
  });
  protected readonly disputeQueue = toSignal(this.admin.getDisputeQueue(), {
    initialValue: [] as AdminQueueItem[],
  });
  protected readonly verificationQueue = toSignal(this.admin.getVerificationQueue(), {
    initialValue: [] as AdminQueueItem[],
  });

  protected readonly topListings = computed(() => this.listingQueue().slice(0, 3));
}
