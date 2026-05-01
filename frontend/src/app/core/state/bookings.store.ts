import { Injectable, computed, signal } from '@angular/core';
import type { BookingSummary, BookingTimelineEvent } from '../models/booking';
import type { BookingStatus } from '../../shared/components/status-badge/status-badge';

interface BookingsState {
  bookings: BookingSummary[];
  timelinesById: Record<string, BookingTimelineEvent[]>;
  loading: boolean;
  error: string | null;
}

const INITIAL: BookingsState = {
  bookings: [],
  timelinesById: {},
  loading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class BookingsStore {
  private readonly state = signal<BookingsState>(INITIAL);

  readonly all = computed(() => this.state().bookings);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  byStatus(status: BookingStatus) {
    return computed(() => this.state().bookings.filter((b) => b.status === status));
  }

  timeline(id: string) {
    return computed(() => this.state().timelinesById[id] ?? []);
  }

  setAll(bookings: BookingSummary[]): void {
    this.state.update((s) => ({ ...s, bookings }));
  }

  upsertOne(booking: BookingSummary): void {
    this.state.update((s) => {
      const idx = s.bookings.findIndex((b) => b.id === booking.id);
      const next = idx >= 0
        ? s.bookings.map((b, i) => (i === idx ? booking : b))
        : [...s.bookings, booking];
      return { ...s, bookings: next };
    });
  }

  setTimeline(id: string, events: BookingTimelineEvent[]): void {
    this.state.update((s) => ({
      ...s,
      timelinesById: { ...s.timelinesById, [id]: events },
    }));
  }

  setLoading(loading: boolean): void {
    this.state.update((s) => ({ ...s, loading }));
  }

  setError(error: string | null): void {
    this.state.update((s) => ({ ...s, error }));
  }

  reset(): void {
    this.state.set(INITIAL);
  }
}
