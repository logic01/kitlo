import { Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, map, of } from 'rxjs';

interface LoadableState<T> {
  status: 'loading' | 'ready' | 'error';
  data: T | null;
  error: unknown;
}

export interface Loadable<T> {
  /** Latest value, or `null` while loading or on error. */
  readonly data: Signal<T | null>;
  readonly loading: Signal<boolean>;
  readonly error: Signal<unknown>;
  readonly hasData: Signal<boolean>;
}

/**
 * Wraps an `Observable<T>` into a triple of signals — `{ data, loading, error }`.
 * Standardizes the loading-state pattern so pages stop re-rolling
 * `toSignal(obs, { initialValue: undefined })` + `loading = computed(() => sig() === undefined)`.
 *
 * Pages can still use `toSignal` directly when they need the raw value;
 * this is the convenience wrapper for the common case.
 */
export function loadable<T>(source$: Observable<T>): Loadable<T> {
  const state = toSignal(
    source$.pipe(
      map((data): LoadableState<T> => ({ status: 'ready', data, error: null })),
      catchError((err): Observable<LoadableState<T>> =>
        of({ status: 'error', data: null, error: err }),
      ),
    ),
    { initialValue: { status: 'loading', data: null, error: null } as LoadableState<T> },
  );

  return {
    data: computed(() => state().data),
    loading: computed(() => state().status === 'loading'),
    error: computed(() => state().error),
    hasData: computed(() => state().status === 'ready'),
  };
}
