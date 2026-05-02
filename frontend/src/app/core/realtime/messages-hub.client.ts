import { Injectable, inject } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorage } from '../auth/token-storage';
import type { Message } from '../models/message';

interface BackendMessage {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  sentAt: string;
  read: boolean;
}

/**
 * Wraps a single SignalR connection to <c>/hubs/messages</c>. Pages call
 * `joinThread(id)` when they open a conversation; emitted Observables
 * deliver new messages as they arrive from the backend hub.
 */
@Injectable({ providedIn: 'root' })
export class MessagesHubClient {
  private readonly tokens = inject(TokenStorage);
  private connection?: HubConnection;
  private readonly _incoming = new Subject<Message>();

  readonly messages$: Observable<Message> = this._incoming.asObservable();

  async ensureConnected(): Promise<void> {
    if (this.connection && this.connection.state === HubConnectionState.Connected) return;
    if (this.connection && this.connection.state === HubConnectionState.Connecting) {
      // Wait for the in-flight connect to finish.
      await new Promise<void>((resolve) => setTimeout(resolve, 200));
      return;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(`${environment.signalRUrl}/messages`, {
        accessTokenFactory: () => this.tokens.accessToken() ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    this.connection.on('messageReceived', (raw: BackendMessage) => {
      this._incoming.next({
        id: raw.id,
        threadId: raw.threadId,
        senderId: raw.senderId,
        body: raw.body,
        sentAt: raw.sentAt,
        read: raw.read,
      });
    });

    await this.connection.start();
  }

  async joinThread(threadId: string): Promise<void> {
    await this.ensureConnected();
    await this.connection!.invoke('JoinThread', threadId);
  }

  async leaveThread(threadId: string): Promise<void> {
    if (!this.connection || this.connection.state !== HubConnectionState.Connected) return;
    await this.connection.invoke('LeaveThread', threadId);
  }

  async disconnect(): Promise<void> {
    if (this.connection) await this.connection.stop();
    this.connection = undefined;
  }
}
