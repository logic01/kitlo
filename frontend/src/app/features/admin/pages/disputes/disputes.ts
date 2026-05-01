import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EmptyState, PageHeader, QueueItem, Spinner } from '../../../../shared';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-admin-disputes',
  imports: [EmptyState, PageHeader, QueueItem, Spinner],
  template: `
    <div class="px-8 py-8">
      <app-page-header title="Disputes" subtitle="Open and in-mediation disputes." />
      @if (loading()) {
        <div class="mt-10 text-center"><app-spinner /></div>
      } @else {
        <div class="mt-5 space-y-2">
          @for (item of queueList(); track item.id) {
            <app-queue-item [item]="item" [route]="['/admin/disputes', item.id]" />
          } @empty {
            <app-empty-state title="No open disputes" body="All disputes have been resolved." />
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDisputes {
  private readonly admin = inject(AdminService);

  private readonly queue = toSignal(this.admin.getDisputeQueue(), { initialValue: undefined });
  protected readonly loading = computed(() => this.queue() === undefined);
  protected readonly queueList = computed(() => this.queue() ?? []);
}
