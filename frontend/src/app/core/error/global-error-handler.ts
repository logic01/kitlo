import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

/**
 * Catches uncaught exceptions, logs them, and shows a generic toast so the
 * user sees something happened. The interceptor handles HTTP errors before
 * they reach here — this is for runtime / template / signal failures.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly toast = inject(ToastService);
  private readonly zone = inject(NgZone);

  handleError(error: unknown): void {
    console.error('[Kitlo] uncaught error:', error);

    const message = this.extractMessage(error);
    this.zone.run(() => {
      this.toast.error(message, { label: 'Unexpected error' });
    });
  }

  private extractMessage(error: unknown): string {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === 'string') return error;
    return 'Something unexpected happened. The error has been logged.';
  }
}
