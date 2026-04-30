import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { AdminQueueItem, QueueReason } from '../../../core/models/admin';

const REASON_TONE: Record<QueueReason, string> = {
  'high-value': 'text-[#7B5200] bg-[rgba(242,153,74,0.10)] border-[rgba(242,153,74,0.25)]',
  flagged: 'text-[#8B0000] bg-[rgba(139,0,0,0.06)] border-[rgba(139,0,0,0.20)]',
};

@Component({
  selector: 'app-queue-item',
  imports: [RouterLink],
  template: `
    <a
      [routerLink]="route()"
      class="grid grid-cols-[1fr_auto_auto_auto] gap-6 items-center px-5 py-4 border-b border-line bg-bone text-inherit no-underline transition-colors hover:bg-surface"
    >
      <div class="min-w-0">
        <p
          class="font-condensed text-base font-extrabold uppercase tracking-[0.04em] text-slate truncate"
        >
          {{ item().name }}
        </p>
        <p
          class="font-mono text-[11px] text-muted uppercase tracking-[0.06em] flex gap-3"
        >
          @for (m of item().meta; track m) {
            <span>{{ m }}</span>
          }
        </p>
      </div>
      <span [class]="reasonClass()">{{ item().reasonLabel }}</span>
      <span [class]="slaClass()">
        {{ item().slaHoursRemaining }}h
      </span>
      <span aria-hidden="true" class="text-muted">→</span>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueItem {
  readonly item = input.required<AdminQueueItem>();
  readonly route = input.required<string | unknown[]>();

  protected readonly reasonClass = computed(
    () =>
      `font-mono text-overline tracking-[0.08em] uppercase px-2 py-0.5 border ${REASON_TONE[this.item().reason]}`,
  );

  protected readonly slaClass = computed(() => {
    const hours = this.item().slaHoursRemaining;
    const base = 'font-mono text-xs text-right';
    if (hours < 0) return `${base} text-[#8B0000] font-medium`;
    if (hours < 4) return `${base} text-amber-dark`;
    return `${base} text-muted`;
  });
}
