import { Injectable, computed, signal } from '@angular/core';
import type { AppNotification } from '../models/notification';

interface NotificationsState {
  items: AppNotification[];
  loading: boolean;
  error: string | null;
}

const INITIAL: NotificationsState = {
  items: [],
  loading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  private readonly state = signal<NotificationsState>(INITIAL);

  readonly items = computed(() => this.state().items);
  readonly unread = computed(() => this.state().items.filter((n) => !n.read));
  readonly unreadCount = computed(() => this.unread().length);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  setAll(items: AppNotification[]): void {
    this.state.update((s) => ({ ...s, items }));
  }

  add(item: AppNotification): void {
    this.state.update((s) => ({ ...s, items: [item, ...s.items] }));
  }

  markRead(id: string): void {
    this.state.update((s) => ({
      ...s,
      items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }

  markAllRead(): void {
    this.state.update((s) => ({
      ...s,
      items: s.items.map((n) => ({ ...n, read: true })),
    }));
  }

  remove(id: string): void {
    this.state.update((s) => ({ ...s, items: s.items.filter((n) => n.id !== id) }));
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
