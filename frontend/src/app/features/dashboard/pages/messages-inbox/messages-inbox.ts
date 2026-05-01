import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Avatar, EmptyState, PageHeader, Spinner } from '../../../../shared';
import { MessagesService } from '../../../../core/services/messages.service';

@Component({
  selector: 'app-dashboard-messages-inbox',
  imports: [RouterLink, DatePipe, Avatar, EmptyState, PageHeader, Spinner],
  template: `
    <div class="px-8 py-8">
      <app-page-header title="Messages" subtitle="Conversations with renters and listers." />

      @if (loading()) {
        <div class="mt-10 text-center"><app-spinner /></div>
      } @else {
      <div class="mt-6 border border-line bg-bone divide-y divide-line">
        @for (thread of threadList(); track thread.id) {
          <a
            class="flex items-center gap-4 p-4 hover:bg-surface no-underline"
            [routerLink]="['/dashboard/messages', thread.id]"
          >
            <app-avatar size="md" [name]="thread.participantName" [imageUrl]="thread.participantAvatarUrl" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-0.5">
                <span class="font-semibold text-slate truncate">{{ thread.participantName }}</span>
                <span class="font-mono text-xs text-muted">{{ thread.lastMessageAt | date: 'MMM d' }}</span>
              </div>
              <p class="text-sm text-muted truncate">{{ thread.lastMessagePreview }}</p>
            </div>
            @if (thread.unreadCount > 0) {
              <span class="ml-2 bg-amber text-slate text-xs font-mono font-semibold px-2 py-0.5 rounded-full">
                {{ thread.unreadCount }}
              </span>
            }
          </a>
        } @empty {
          <app-empty-state title="No messages yet" body="When you book a rental or someone messages your listing, threads land here." />
        }
      </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardMessagesInbox {
  private readonly messages = inject(MessagesService);

  private readonly threads = toSignal(this.messages.listThreads(), { initialValue: undefined });
  protected readonly loading = computed(() => this.threads() === undefined);
  protected readonly threadList = computed(() => this.threads() ?? []);
}
