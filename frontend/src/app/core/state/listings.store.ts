import { Injectable, computed, signal } from '@angular/core';
import type { Listing, ListingSummary } from '../models/listing';

interface ListingsState {
  summaries: ListingSummary[];
  detailsById: Record<string, Listing>;
  loading: boolean;
  error: string | null;
}

const INITIAL: ListingsState = {
  summaries: [],
  detailsById: {},
  loading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class ListingsStore {
  private readonly state = signal<ListingsState>(INITIAL);

  readonly summaries = computed(() => this.state().summaries);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  detail(id: string) {
    return computed(() => this.state().detailsById[id] ?? null);
  }

  setSummaries(summaries: ListingSummary[]): void {
    this.state.update((s) => ({ ...s, summaries }));
  }

  upsertDetail(listing: Listing): void {
    this.state.update((s) => ({
      ...s,
      detailsById: { ...s.detailsById, [listing.id]: listing },
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
