import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { EmptyState, PageHeader, QueueItem, Tabs, type TabDef } from '../../../../shared';
import { AdminService } from '../../../../core/services/admin.service';
import { loadable } from '../../../../core/loading/loadable';

@Component({
  selector: 'app-admin-listings',
  imports: [EmptyState, PageHeader, QueueItem, Tabs],
  template: `
    <div class="px-8 py-8">
      <app-page-header title="Listing review queue" subtitle="High-value and flagged listings awaiting approval." />

      <app-tabs [tabs]="tabs()" [(activeId)]="activeTab" />

      <div class="mt-5 space-y-2" [attr.aria-busy]="loading()">
        @if (loading()) {
          @for (_ of skeletonSlots; track $index) {
            <div class="border border-line bg-bone p-4 flex items-center gap-4" aria-hidden="true">
              <span class="w-12 h-12 bg-surface kitlo-pulse shrink-0"></span>
              <div class="flex-1 space-y-2">
                <span class="block h-4 w-1/2 bg-surface kitlo-pulse"></span>
                <span class="block h-3 w-1/3 bg-surface kitlo-pulse"></span>
              </div>
              <span class="block h-6 w-20 bg-surface kitlo-pulse"></span>
            </div>
          }
        } @else {
          @for (item of filtered(); track item.id) {
            <app-queue-item [item]="item" [route]="['/admin/listings', item.id]" />
          } @empty {
            <app-empty-state title="Queue clear" body="No listings awaiting review." />
          }
        }
      </div>
    </div>
  `,
  styles: `
    .kitlo-pulse { animation: kitlo-skeleton 1.4s ease-in-out infinite; }
    @keyframes kitlo-skeleton {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.55; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminListings {
  private readonly admin = inject(AdminService);

  protected readonly activeTab = signal('all');

  private readonly queue = loadable(this.admin.getListingQueue());
  protected readonly loading = this.queue.loading;
  protected readonly skeletonSlots = Array(4).fill(0);

  protected readonly tabs = computed<TabDef[]>(() => [
    { id: 'all', label: 'All', count: (this.queue.data() ?? []).length },
    { id: 'high-value', label: 'High value' },
    { id: 'flagged', label: 'Flagged' },
  ]);

  protected readonly filtered = computed(() => {
    const items = this.queue.data() ?? [];
    if (this.activeTab() === 'all') return items;
    return items.filter((q) => q.reason === this.activeTab());
  });
}
