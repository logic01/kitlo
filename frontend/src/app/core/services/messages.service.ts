import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Message, MessageThread } from '../models/message';
import { MOCK_MESSAGES_BY_THREAD, MOCK_MESSAGE_THREADS } from '../mock-data';
import { AuthService } from './auth.service';
import { generateId, mockError, mockResponse, nowIso } from './mock-response';

export interface SendMessageInput {
  body: string;
  attachmentUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private readonly auth = inject(AuthService);
  private threads: MessageThread[] = MOCK_MESSAGE_THREADS.map((t) => ({ ...t }));
  private messagesByThread: Record<string, Message[]> = Object.fromEntries(
    Object.entries(MOCK_MESSAGES_BY_THREAD).map(([id, msgs]) => [id, msgs.map((m) => ({ ...m }))]),
  );

  listThreads(): Observable<MessageThread[]> {
    return mockResponse(
      [...this.threads]
        .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))
        .map((t) => ({ ...t })),
    );
  }

  getThread(threadId: string): Observable<Message[]> {
    const thread = this.threads.find((t) => t.id === threadId);
    if (!thread) return mockError(`Thread ${threadId} not found`);
    return mockResponse((this.messagesByThread[threadId] ?? []).map((m) => ({ ...m })));
  }

  sendMessage(threadId: string, input: SendMessageInput): Observable<Message> {
    const idx = this.threads.findIndex((t) => t.id === threadId);
    if (idx < 0) return mockError(`Thread ${threadId} not found`);
    const me = this.auth.currentUser();
    if (!me) return mockError('Not authenticated');
    const message: Message = {
      id: generateId('m'),
      threadId,
      senderId: me.id,
      body: input.body,
      sentAt: nowIso(),
      read: true,
    };
    this.messagesByThread[threadId] = [...(this.messagesByThread[threadId] ?? []), message];
    this.threads[idx] = {
      ...this.threads[idx],
      lastMessagePreview: input.body.slice(0, 80),
      lastMessageAt: message.sentAt,
    };
    return mockResponse({ ...message });
  }

  markThreadRead(threadId: string): Observable<void> {
    const idx = this.threads.findIndex((t) => t.id === threadId);
    if (idx < 0) return mockError(`Thread ${threadId} not found`);
    this.threads[idx] = { ...this.threads[idx], unreadCount: 0 };
    this.messagesByThread[threadId] = (this.messagesByThread[threadId] ?? []).map((m) => ({ ...m, read: true }));
    return mockResponse(undefined);
  }

  uploadAttachment(threadId: string, _file: File | Blob): Observable<string> {
    if (!this.threads.some((t) => t.id === threadId)) return mockError(`Thread ${threadId} not found`);
    const url = `https://images.unsplash.com/photo-${generateId('att')}?auto=format&fit=crop&w=600&q=80`;
    return mockResponse(url, 400);
  }
}
