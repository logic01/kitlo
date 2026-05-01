import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

const DEFAULT_LATENCY_MS = 120;

export function mockResponse<T>(value: T, latencyMs = DEFAULT_LATENCY_MS): Observable<T> {
  return of(value).pipe(delay(latencyMs));
}

export function mockError<T = never>(message: string, latencyMs = DEFAULT_LATENCY_MS): Observable<T> {
  return throwError(() => new Error(message)).pipe(delay(latencyMs));
}

export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
