import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { AppNotification, NotificationKind } from '../models/notification';
import { MOCK_NOTIFICATIONS } from '../mock-data';
import { mockError, mockResponse } from './mock-response';

export interface NotificationListQuery {
  unreadOnly?: boolean;
  kind?: NotificationKind | NotificationKind[];
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private notifications: AppNotification[] = MOCK_NOTIFICATIONS.map((n) => ({ ...n }));

  list(query: NotificationListQuery = {}): Observable<AppNotification[]> {
    const kinds = Array.isArray(query.kind) ? query.kind : query.kind ? [query.kind] : null;
    let items = [...this.notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (query.unreadOnly) items = items.filter((n) => !n.read);
    if (kinds) items = items.filter((n) => kinds.includes(n.kind));
    if (query.limit != null) items = items.slice(0, query.limit);
    return mockResponse(items.map((n) => ({ ...n })));
  }

  unreadCount(): Observable<number> {
    return mockResponse(this.notifications.filter((n) => !n.read).length);
  }

  markRead(id: string): Observable<void> {
    const idx = this.notifications.findIndex((n) => n.id === id);
    if (idx < 0) return mockError(`Notification ${id} not found`);
    this.notifications[idx] = { ...this.notifications[idx], read: true };
    return mockResponse(undefined);
  }

  markAllRead(): Observable<void> {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    return mockResponse(undefined);
  }

  dismiss(id: string): Observable<void> {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    return mockResponse(undefined);
  }
}
