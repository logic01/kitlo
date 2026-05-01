import { Injectable, signal } from '@angular/core';

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  tone: ToastTone;
  message: string;
  /** Optional short label rendered before the message (e.g. "Saved"). */
  label?: string;
  /** Milliseconds before auto-dismiss. 0 = stay until dismissed manually. */
  durationMs: number;
}

export interface ShowToastOptions {
  label?: string;
  durationMs?: number;
}

const DEFAULT_DURATION_MS: Record<ToastTone, number> = {
  success: 4000,
  info: 4000,
  warning: 6000,
  error: 7000,
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<readonly Toast[]>([]);
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly toasts = this._toasts.asReadonly();

  success(message: string, options: ShowToastOptions = {}): string {
    return this.show('success', message, options);
  }

  error(message: string, options: ShowToastOptions = {}): string {
    return this.show('error', message, options);
  }

  info(message: string, options: ShowToastOptions = {}): string {
    return this.show('info', message, options);
  }

  warning(message: string, options: ShowToastOptions = {}): string {
    return this.show('warning', message, options);
  }

  dismiss(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clear(): void {
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.timers.clear();
    this._toasts.set([]);
  }

  private show(tone: ToastTone, message: string, options: ShowToastOptions): string {
    const trimmed = message.trim();
    if (!trimmed) return '';

    // Dedupe: if an identical toast (same tone + message) is already visible,
    // reuse it instead of stacking a duplicate.
    const existing = this._toasts().find((t) => t.tone === tone && t.message === trimmed);
    if (existing) return existing.id;

    const id = `toast-${Math.random().toString(36).slice(2, 9)}`;
    const durationMs = options.durationMs ?? DEFAULT_DURATION_MS[tone];
    const toast: Toast = { id, tone, message: trimmed, label: options.label, durationMs };

    this._toasts.update((list) => [...list, toast]);

    if (durationMs > 0) {
      const timer = setTimeout(() => this.dismiss(id), durationMs);
      this.timers.set(id, timer);
    }
    return id;
  }
}
