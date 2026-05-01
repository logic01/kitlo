import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { BookingStatus } from '../../shared/components/status-badge/status-badge';
import type { BookingSummary, BookingTimelineEvent } from '../models/booking';
import { MOCK_BOOKINGS, MOCK_BOOKING_TIMELINES } from '../mock-data';
import { generateId, mockError, mockResponse, nowIso } from './mock-response';

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

const DEFAULT_PAGE_SIZE = 20;

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private bookings: BookingSummary[] = MOCK_BOOKINGS.map((b) => ({ ...b }));
  private timelines: Record<string, BookingTimelineEvent[]> = Object.fromEntries(
    Object.entries(MOCK_BOOKING_TIMELINES).map(([id, events]) => [id, events.map((e) => ({ ...e }))]),
  );

  list(query: BookingListQuery = {}): Observable<BookingPage> {
    const statuses = Array.isArray(query.status) ? query.status : query.status ? [query.status] : null;
    const filtered = this.bookings.filter((b) => !statuses || statuses.includes(b.status));
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
    const start = (page - 1) * pageSize;
    return mockResponse({
      items: filtered.slice(start, start + pageSize).map((b) => ({ ...b })),
      total: filtered.length,
      page,
      pageSize,
    });
  }

  getById(id: string): Observable<BookingSummary> {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) return mockError(`Booking ${id} not found`);
    return mockResponse({ ...booking });
  }

  getTimeline(id: string): Observable<BookingTimelineEvent[]> {
    if (!this.bookings.some((b) => b.id === id)) return mockError(`Booking ${id} not found`);
    return mockResponse((this.timelines[id] ?? []).map((e) => ({ ...e })));
  }

  create(input: BookingRequestInput): Observable<BookingSummary> {
    const booking: BookingSummary = {
      id: generateId('bk'),
      status: 'confirmed',
      startDate: input.startDate,
      endDate: input.endDate,
      gearTitle: input.gearTitle,
      gearPhotoUrl: input.gearPhotoUrl,
      counterpartyName: input.counterpartyName,
      totalCents: input.totalCents,
    };
    this.bookings = [booking, ...this.bookings];
    this.timelines[booking.id] = [
      { id: generateId('ev'), label: 'Request submitted', occurredAt: nowIso(), state: 'done' },
      { id: generateId('ev'), label: 'Lister approved', occurredAt: nowIso(), state: 'done' },
      { id: generateId('ev'), label: 'Payment authorized', detail: this.formatMoney(input.totalCents), occurredAt: nowIso(), state: 'now' },
    ];
    return mockResponse({ ...booking });
  }

  confirmPickup(id: string): Observable<BookingSummary> {
    return this.transition(id, 'active', { label: 'Pickup confirmed', detail: 'Renter signed off on condition' });
  }

  flagCondition(id: string, note: string): Observable<BookingSummary> {
    return this.appendEvent(id, { label: 'Condition flagged', detail: note, state: 'alert' });
  }

  confirmHandoff(id: string): Observable<BookingSummary> {
    return this.appendEvent(id, { label: 'Handoff confirmed', detail: 'Lister signed off' });
  }

  confirmReturn(id: string): Observable<BookingSummary> {
    return this.transition(id, 'returned', { label: 'Returned', detail: 'Awaiting lister confirmation' });
  }

  flagDamage(id: string, note: string): Observable<BookingSummary> {
    return this.transition(id, 'disputed', { label: 'Damage flagged', detail: note, state: 'alert' });
  }

  requestExtension(id: string, newEndDate: string): Observable<BookingSummary> {
    const idx = this.bookings.findIndex((b) => b.id === id);
    if (idx < 0) return mockError(`Booking ${id} not found`);
    const next = { ...this.bookings[idx], endDate: newEndDate };
    this.bookings[idx] = next;
    this.pushEvent(id, { label: 'Extension requested', detail: `New end date: ${newEndDate}` });
    return mockResponse({ ...next });
  }

  cancel(id: string, reason?: string): Observable<BookingSummary> {
    return this.transition(id, 'cancelled', { label: 'Cancelled', detail: reason, state: 'alert' });
  }

  cancelPreview(id: string): Observable<CancelPreview> {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) return mockError(`Booking ${id} not found`);
    const start = new Date(booking.startDate).getTime();
    const hoursUntilStart = Math.max(0, Math.round((start - Date.now()) / 3_600_000));
    const policy: CancelPreview['policy'] = hoursUntilStart > 168 ? 'flexible' : hoursUntilStart > 48 ? 'moderate' : 'strict';
    const refundPct = policy === 'flexible' ? 1 : policy === 'moderate' ? 0.5 : 0;
    const refundCents = Math.round(booking.totalCents * refundPct);
    return mockResponse({
      refundCents,
      feeRetainedCents: booking.totalCents - refundCents,
      policy,
      hoursUntilStart,
      message:
        policy === 'flexible'
          ? 'Full refund — cancellation more than 7 days before pickup.'
          : policy === 'moderate'
            ? '50% refund — cancellation between 48 hours and 7 days before pickup.'
            : 'No refund — cancellation within 48 hours of pickup.',
    });
  }

  requestMutualCancel(id: string): Observable<void> {
    if (!this.bookings.some((b) => b.id === id)) return mockError(`Booking ${id} not found`);
    this.pushEvent(id, { label: 'Mutual cancellation requested', detail: 'Awaiting counterparty agreement' });
    return mockResponse(undefined);
  }

  private transition(
    id: string,
    status: BookingStatus,
    event: { label: string; detail?: string; state?: BookingTimelineEvent['state'] },
  ): Observable<BookingSummary> {
    const idx = this.bookings.findIndex((b) => b.id === id);
    if (idx < 0) return mockError(`Booking ${id} not found`);
    const next = { ...this.bookings[idx], status };
    this.bookings[idx] = next;
    this.pushEvent(id, event);
    return mockResponse({ ...next });
  }

  private appendEvent(
    id: string,
    event: { label: string; detail?: string; state?: BookingTimelineEvent['state'] },
  ): Observable<BookingSummary> {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) return mockError(`Booking ${id} not found`);
    this.pushEvent(id, event);
    return mockResponse({ ...booking });
  }

  private pushEvent(
    id: string,
    event: { label: string; detail?: string; state?: BookingTimelineEvent['state'] },
  ): void {
    const events = this.timelines[id] ?? [];
    this.timelines[id] = [
      ...events,
      { id: generateId('ev'), label: event.label, detail: event.detail, occurredAt: nowIso(), state: event.state ?? 'done' },
    ];
  }

  private formatMoney(cents: number): string {
    return `Hold of $${(cents / 100).toFixed(2)} placed`;
  }
}
