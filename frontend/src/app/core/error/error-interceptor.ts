import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

/**
 * Maps HTTP failures to user-facing toasts and routes catastrophic 5xx
 * responses to the server-error page. Re-throws so callers can still react.
 *
 * 401/403 are surfaced as toasts here; the AuthService / route guards own
 * redirect-to-login behavior.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        handle(err, toast, router);
      } else if (err instanceof Error) {
        toast.error(err.message || 'Something went wrong.');
      } else {
        toast.error('Something went wrong.');
      }
      return throwError(() => err);
    }),
  );
};

function handle(err: HttpErrorResponse, toast: ToastService, router: Router): void {
  const message = extractMessage(err);
  const status = err.status;

  if (status === 0) {
    toast.error('Network error — check your connection and try again.', { label: 'Offline' });
    return;
  }
  if (status === 401) {
    toast.warning('Your session has expired. Please sign in again.', { label: 'Signed out' });
    return;
  }
  if (status === 403) {
    toast.warning(message ?? "You don't have permission to do that.", { label: 'Forbidden' });
    return;
  }
  if (status === 404) {
    toast.error(message ?? 'Not found.', { label: 'Missing' });
    return;
  }
  if (status >= 500) {
    toast.error(message ?? 'Our servers are having trouble. Try again shortly.', {
      label: 'Server error',
    });
    void router.navigate(['/server-error']);
    return;
  }
  toast.error(message ?? 'Request failed.');
}

function extractMessage(err: HttpErrorResponse): string | null {
  const body = err.error;
  if (!body) return null;
  if (typeof body === 'string') return body;
  if (typeof body === 'object') {
    const record = body as Record<string, unknown>;
    if (typeof record['message'] === 'string') return record['message'] as string;
    if (typeof record['error'] === 'string') return record['error'] as string;
  }
  return null;
}
