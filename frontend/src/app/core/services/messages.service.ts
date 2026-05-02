import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Message, MessageThread } from '../models/message';

export interface SendMessageInput {
  body: string;
  attachmentUrl?: string;
}

interface BackendMessage {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  sentAt: string;
  read: boolean;
}

interface BackendThread {
  id: string;
  participantIds: string[];
  participantName: string;
  participantAvatarUrl?: string | null;
  bookingId?: string | null;
  listingId?: string | null;
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount: number;
}

function mapMessage(b: BackendMessage): Message {
  return {
    id: b.id,
    threadId: b.threadId,
    senderId: b.senderId,
    body: b.body,
    sentAt: b.sentAt,
    read: b.read,
  };
}

function mapThread(b: BackendThread): MessageThread {
  return {
    id: b.id,
    participantIds: b.participantIds,
    participantName: b.participantName,
    participantAvatarUrl: b.participantAvatarUrl ?? undefined,
    bookingId: b.bookingId ?? undefined,
    listingId: b.listingId ?? undefined,
    lastMessagePreview: b.lastMessagePreview,
    lastMessageAt: b.lastMessageAt,
    unreadCount: b.unreadCount,
  };
}

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/messages`;

  listThreads(): Observable<MessageThread[]> {
    return this.http.get<BackendThread[]>(`${this.base}/threads`).pipe(map((rows) => rows.map(mapThread)));
  }

  getThread(threadId: string): Observable<Message[]> {
    return this.http.get<BackendMessage[]>(`${this.base}/threads/${threadId}`).pipe(map((rows) => rows.map(mapMessage)));
  }

  /** Fetch a single thread's metadata (participant, booking, unread count). */
  getThreadMeta(threadId: string): Observable<MessageThread> {
    return this.http.get<BackendThread>(`${this.base}/threads/${threadId}/meta`).pipe(map(mapThread));
  }

  /** Open or fetch a thread between the caller and the listing's lister. */
  startListingThread(listingId: string): Observable<MessageThread> {
    return this.http.post<BackendThread>(`${this.base}/threads/listing/${listingId}`, {}).pipe(map(mapThread));
  }

  sendMessage(threadId: string, input: SendMessageInput): Observable<Message> {
    return this.http
      .post<BackendMessage>(`${this.base}/threads/${threadId}`, { body: input.body })
      .pipe(map(mapMessage));
  }

  /**
   * Mark-thread-read happens automatically when `getThread` runs server-side.
   * Kept as a no-op to preserve the API surface.
   */
  markThreadRead(_threadId: string): Observable<void> {
    return of(undefined);
  }

  /**
   * Cloudinary attachment upload is scaffolded in 5.5; until then return a placeholder.
   */
  uploadAttachment(_threadId: string, _file: File | Blob): Observable<string> {
    return of(`https://placehold.co/600x400/333/eee?text=Attachment`);
  }
}
