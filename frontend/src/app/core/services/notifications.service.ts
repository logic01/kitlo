import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { AppNotification, NotificationKind } from '../models/notification';

export interface NotificationListQuery {
  unreadOnly?: boolean;
  kind?: NotificationKind | NotificationKind[];
  limit?: number;
}

interface BackendNotification {
  id: string;
  kind: number;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  link?: string | null;
}

const KINDS: NotificationKind[] = [
  'booking-request',
  'booking-confirmed',
  'booking-reminder',
  'message',
  'review-received',
  'payout-released',
  'dispute',
  'admin-action',
  'system',
];

function mapNotification(b: BackendNotification): AppNotification {
  return {
    id: b.id,
    kind: KINDS[b.kind] ?? 'system',
    title: b.title,
    body: b.body,
    createdAt: b.createdAt,
    read: b.read,
    link: b.link ?? undefined,
  };
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/notifications`;

  list(query: NotificationListQuery = {}): Observable<AppNotification[]> {
    let params = new HttpParams();
    if (query.unreadOnly) params = params.set('unreadOnly', 'true');
    if (query.limit != null) params = params.set('pageSize', String(query.limit));
    return this.http
      .get<{ items: BackendNotification[] }>(this.base, { params })
      .pipe(map((r) => r.items.map(mapNotification)));
  }

  unreadCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${this.base}/unread-count`).pipe(map((r) => r.count));
  }

  markRead(id: string): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}/read`, {});
  }

  markAllRead(): Observable<void> {
    return this.http.put<void>(`${this.base}/read-all`, {});
  }

  dismiss(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
