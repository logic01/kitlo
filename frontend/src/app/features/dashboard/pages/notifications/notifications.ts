import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Button, EmptyState, PageHeader } from '../../../../shared';
import { NotificationsService } from '../../../../core/services/notifications.service';
import type { AppNotification } from '../../../../core/models/notification';

@Component({
  selector: 'app-dashboard-notifications',
  imports: [DatePipe, RouterLink, Button, EmptyState, PageHeader],
  template: `
    <div class="px-8 py-8">
      <app-page-header title="Notifications" subtitle="Recent activity across all your bookings.">
        <div slot="actions">
          <button appButton variant="ghost" type="button" (click)="markAllRead()">
            Mark all as read
          </button>
        </div>
      </app-page-header>

      <div class="mt-6 border border-line bg-bone divide-y divide-line">
        @for (notification of notifications(); track notification.id) {
          <a
            class="flex gap-4 p-4 hover:bg-surface no-underline"
            [class.bg-olive-pale]="!notification.read"
            [routerLink]="notification.link"
            (click)="markRead(notification)"
          >
            <span class="font-condensed text-h3 font-black text-olive">⟡</span>
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline justify-between mb-0.5">
                <span class="font-semibold text-slate">{{ notification.title }}</span>
                <span class="font-mono text-xs text-muted">
                  {{ notification.createdAt | date: 'MMM d, h:mm a' }}
                </span>
              </div>
              <p class="text-sm text-muted">{{ notification.body }}</p>
            </div>
          </a>
        } @empty {
          <app-empty-state title="All clear" body="You're caught up. New activity will show up here." />
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNotifications {
  private readonly api = inject(NotificationsService);

  protected readonly notifications = signal<AppNotification[]>([]);

  constructor() {
    this.api.list().subscribe((items) => this.notifications.set(items));
  }

  protected markAllRead(): void {
    this.api.markAllRead().subscribe(() => {
      this.notifications.update((list) => list.map((n) => ({ ...n, read: true })));
    });
  }

  protected markRead(notification: AppNotification): void {
    if (notification.read) return;
    this.api.markRead(notification.id).subscribe(() => {
      this.notifications.update((list) =>
        list.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
      );
    });
  }
}
