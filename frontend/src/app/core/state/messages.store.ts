import { Injectable, computed, signal } from '@angular/core';
import type { Message, MessageThread } from '../models/message';

interface MessagesState {
  threads: MessageThread[];
  messagesByThread: Record<string, Message[]>;
  loading: boolean;
  error: string | null;
}

const INITIAL: MessagesState = {
  threads: [],
  messagesByThread: {},
  loading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class MessagesStore {
  private readonly state = signal<MessagesState>(INITIAL);

  readonly threads = computed(() => this.state().threads);
  readonly unreadTotal = computed(() =>
    this.state().threads.reduce((sum, t) => sum + t.unreadCount, 0),
  );
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  messages(threadId: string) {
    return computed(() => this.state().messagesByThread[threadId] ?? []);
  }

  setThreads(threads: MessageThread[]): void {
    this.state.update((s) => ({ ...s, threads }));
  }

  setMessages(threadId: string, messages: Message[]): void {
    this.state.update((s) => ({
      ...s,
      messagesByThread: { ...s.messagesByThread, [threadId]: messages },
    }));
  }

  appendMessage(threadId: string, message: Message): void {
    this.state.update((s) => ({
      ...s,
      messagesByThread: {
        ...s.messagesByThread,
        [threadId]: [...(s.messagesByThread[threadId] ?? []), message],
      },
    }));
  }

  markThreadRead(threadId: string): void {
    this.state.update((s) => ({
      ...s,
      threads: s.threads.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t)),
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
