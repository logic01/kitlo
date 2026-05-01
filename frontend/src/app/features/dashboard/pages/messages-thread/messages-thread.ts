import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import { Avatar, Button, Input } from '../../../../shared';
import { AuthService } from '../../../../core/services/auth.service';
import { MessagesService } from '../../../../core/services/messages.service';
import type { Message, MessageThread } from '../../../../core/models/message';

@Component({
  selector: 'app-dashboard-messages-thread',
  imports: [RouterLink, FormsModule, DatePipe, Avatar, Button, Input],
  template: `
    @if (thread(); as t) {
      <div class="flex flex-col h-[calc(100vh-72px)]">
        <header class="flex items-center gap-4 p-4 border-b border-line">
          <a routerLink="/dashboard/messages" class="text-muted text-sm">←</a>
          <app-avatar size="md" [name]="t.participantName" [imageUrl]="t.participantAvatarUrl" />
          <div class="flex-1">
            <div class="font-semibold text-slate">{{ t.participantName }}</div>
            @if (t.bookingId) {
              <div class="text-xs text-muted">Booking {{ t.bookingId }}</div>
            }
          </div>
          @if (t.bookingId) {
            <a appButton variant="ghost" [routerLink]="['/dashboard/bookings', t.bookingId]">
              View booking
            </a>
          }
        </header>

        <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-surface">
          @for (msg of messages(); track msg.id) {
            <div class="flex" [class.justify-end]="isMine(msg)">
              <div
                class="max-w-md p-3 px-4 border"
                [class.bg-olive-pale]="isMine(msg)"
                [class.border-olive-border]="isMine(msg)"
                [class.bg-bone]="!isMine(msg)"
                [class.border-line]="!isMine(msg)"
              >
                <p class="text-sm leading-relaxed">{{ msg.body }}</p>
                <p class="font-mono text-[10px] text-muted mt-1">{{ msg.sentAt | date: 'MMM d, h:mm a' }}</p>
              </div>
            </div>
          }
        </div>

        <form class="p-4 border-t border-line bg-bone flex gap-3" (ngSubmit)="send()">
          <input
            appInput
            class="flex-1"
            [(ngModel)]="draft"
            name="body"
            placeholder="Write a message…"
          />
          <button appButton variant="primary" type="submit" [disabled]="!draft.trim()">Send</button>
        </form>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardMessagesThread {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly messagesApi = inject(MessagesService);

  private readonly threadId = toSignal(
    this.route.params.pipe(map((p) => p['id'] as string)),
    { initialValue: '' },
  );

  protected readonly thread = toSignal(
    toObservable(this.threadId).pipe(
      switchMap((id) =>
        id
          ? this.messagesApi
              .listThreads()
              .pipe(map((all) => all.find((t) => t.id === id) ?? null))
          : of(null),
      ),
    ),
    { initialValue: null as MessageThread | null },
  );

  protected readonly messages = signal<Message[]>([]);
  protected draft = '';

  constructor() {
    effect(() => {
      const id = this.threadId();
      if (!id) return;
      this.messagesApi
        .getThread(id)
        .pipe(catchError(() => of([] as Message[])))
        .subscribe((msgs) => this.messages.set(msgs));
      this.messagesApi.markThreadRead(id).subscribe();
    });
  }

  protected isMine(msg: Message): boolean {
    return msg.senderId === this.auth.currentUser()?.id;
  }

  protected send(): void {
    const body = this.draft.trim();
    if (!body) return;
    const id = this.threadId();
    if (!id) return;
    this.messagesApi.sendMessage(id, { body }).subscribe((msg) => {
      this.messages.update((msgs) => [...msgs, msg]);
    });
    this.draft = '';
  }
}
