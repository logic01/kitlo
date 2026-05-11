import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { BookingStatus } from '../../shared/components/status-badge/status-badge';
import type { BookingSummary, BookingTimelineEvent } from '../models/booking';

export interface BookingListQuery {
  role?: 'renter' | 'lister';
  status?: BookingStatus | BookingStatus[];
  page?: number;
  pageSize?: number;
}

export interface BookingPage {
  items: BookingSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BookingRequestInput {
  listingId: string;
  gearTitle: string;
  gearPhotoUrl: string;
  startDate: string;
  endDate: string;
  counterpartyName: string;
  totalCents: number;
}

export interface CancelPreview {
  refundCents: number;
  feeRetainedCents: number;
  policy: 'flexible' | 'moderate' | 'strict';
  hoursUntilStart: number;
  message: string;
}

interface BackendBookingSummary {
  id: string;
  // Backend now serializes enums as camelCase strings via JsonStringEnumConverter.
  // Kept as a wide type so the legacy int branch in mapSummary remains a no-op
  // until any cached responses fully roll over.
  status: BookingStatus | number;
  startDate: string;
  endDate: string;
  gearTitle: string;
  gearPhotoUrl: string;
  counterpartyName: string;
  counterpartyAvatarUrl?: string | null;
  totalCents: number;
}

interface BackendBookingDetail {
  booking: BackendBookingSummary;
  status: string;
  startDate: string;
  endDate: string;
  rentalCents: number;
  depositCents: number;
  platformFeeCents: number;
  totalCents: number;
  timeline: BackendTimelineEvent[];
}

interface BackendTimelineEvent {
  id: string;
  label: string;
  detail?: string | null;
  occurredAt: string;
  state: string;
}

const STATUSES: BookingStatus[] = ['pending', 'confirmed', 'active', 'returned', 'completed', 'cancelled', 'disputed'];

function statusFromInt(n: number): BookingStatus {
  return STATUSES[n] ?? 'pending';
}

function mapSummary(b: BackendBookingSummary): BookingSummary {
  return {
    id: b.id,
    status: typeof b.status === 'number' ? statusFromInt(b.status) : (b.status as BookingStatus),
    startDate: b.startDate,
    endDate: b.endDate,
    gearTitle: b.gearTitle,
    gearPhotoUrl: b.gearPhotoUrl,
    counterpartyName: b.counterpartyName,
    counterpartyAvatarUrl: b.counterpartyAvatarUrl ?? undefined,
    totalCents: b.totalCents,
  };
}

function mapTimeline(rows: BackendTimelineEvent[]): BookingTimelineEvent[] {
  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    detail: r.detail ?? undefined,
    occurredAt: r.occurredAt,
    state: (r.state === 'now' || r.state === 'alert' ? r.state : 'done') as BookingTimelineEvent['state'],
  }));
}

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/bookings`;

  list(query: BookingListQuery = {}): Observable<BookingPage> {
    let params = new HttpParams();
    if (query.role) params = params.set('role', query.role);
    if (query.status) {
      const list = Array.isArray(query.status) ? query.status : [query.status];
      params = params.set('status', list.join(','));
    }
    if (query.page) params = params.set('page', String(query.page));
    if (query.pageSize) params = params.set('pageSize', String(query.pageSize));

    return this.http
      .get<{ items: BackendBookingSummary[]; total: number; page: number; pageSize: number }>(this.base, { params })
      .pipe(
        map((r) => ({
          items: r.items.map(mapSummary),
          total: r.total,
          page: r.page,
          pageSize: r.pageSize,
        })),
      );
  }

  getById(id: string): Observable<BookingSummary> {
    return this.http.get<BackendBookingDetail>(`${this.base}/${id}`).pipe(map((r) => mapSummary(r.booking)));
  }

  getTimeline(id: string): Observable<BookingTimelineEvent[]> {
    return this.http.get<BackendTimelineEvent[]>(`${this.base}/${id}/timeline`).pipe(map(mapTimeline));
  }

  create(input: BookingRequestInput): Observable<BookingSummary> {
    return this.http
      .post<BackendBookingSummary>(this.base, {
        listingId: input.listingId,
        startDate: input.startDate,
        endDate: input.endDate,
      })
      .pipe(map(mapSummary));
  }

  confirm(id: string): Observable<BookingSummary> {
    return this.transition(id, 'confirm');
  }

  confirmPickup(id: string): Observable<BookingSummary> {
    return this.transition(id, 'pickup');
  }

  flagCondition(id: string, _note: string): Observable<BookingSummary> {
    // No backend endpoint for soft "flag condition" today; surface via dispute or message.
    return this.getById(id);
  }

  confirmHandoff(id: string): Observable<BookingSummary> {
    return this.transition(id, 'pickup');
  }

  confirmReturn(id: string): Observable<BookingSummary> {
    return this.transition(id, 'return');
  }

  complete(id: string): Observable<BookingSummary> {
    return this.transition(id, 'complete');
  }

  flagDamage(id: string, _note: string): Observable<BookingSummary> {
    return this.getById(id);
  }

  /**
   * Extensions are owed on the backend — for now no-op so the dashboard stays usable.
   */
  requestExtension(id: string, _newEndDate: string): Observable<BookingSummary> {
    return this.getById(id);
  }

  cancel(id: string, reason?: string): Observable<BookingSummary> {
    return this.transition(id, 'cancel', reason);
  }

  /**
   * Cancellation refund is computed client-side from booking dates + policy.
   * The backend can take over once a `/api/bookings/{id}/cancel-preview` endpoint lands.
   */
  cancelPreview(id: string): Observable<CancelPreview> {
    return this.getById(id).pipe(
      map((b) => {
        const start = new Date(b.startDate).getTime();
        const hoursUntilStart = Math.max(0, Math.round((start - Date.now()) / 3_600_000));
        const policy: CancelPreview['policy'] = hoursUntilStart > 168 ? 'flexible' : hoursUntilStart > 48 ? 'moderate' : 'strict';
        const refundPct = policy === 'flexible' ? 1 : policy === 'moderate' ? 0.5 : 0;
        const refundCents = Math.round(b.totalCents * refundPct);
        return {
          refundCents,
          feeRetainedCents: b.totalCents - refundCents,
          policy,
          hoursUntilStart,
          message:
            policy === 'flexible'
              ? 'Full refund — cancellation more than 7 days before pickup.'
              : policy === 'moderate'
                ? '50% refund — cancellation between 48 hours and 7 days before pickup.'
                : 'No refund — cancellation within 48 hours of pickup.',
        };
      }),
    );
  }

  requestMutualCancel(_id: string): Observable<void> {
    return of(undefined);
  }

  private transition(id: string, action: string, reason?: string): Observable<BookingSummary> {
    return this.http
      .put<BackendBookingSummary>(`${this.base}/${id}/status`, { action, reason })
      .pipe(map(mapSummary));
  }
}
