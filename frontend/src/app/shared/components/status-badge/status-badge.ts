import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BookingStatus =
  | 'confirmed'
  | 'active'
  | 'returned'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export type ListingStatus = 'draft' | 'pending' | 'paused' | 'flagged' | 'archived' | 'active';

export type Status = BookingStatus | ListingStatus;

const TONE: Record<Status, string> = {
  confirmed: 'text-[#1A6B52] bg-[rgba(26,107,82,0.07)] border-[rgba(26,107,82,0.20)]',
  active: 'text-olive bg-olive-pale border-olive-border',
  returned: 'text-muted bg-surface border-line',
  completed: 'text-slate bg-surface border-line',
  disputed: 'text-battle bg-[rgba(212,120,30,0.07)] border-[rgba(212,120,30,0.20)]',
  cancelled: 'text-muted bg-surface border-line line-through',
  draft: 'text-muted bg-surface border-line',
  pending: 'text-[#7B5200] bg-[rgba(242,153,74,0.10)] border-[rgba(242,153,74,0.25)]',
  paused: 'text-muted bg-surface border-line',
  flagged: 'text-[#8B0000] bg-[rgba(139,0,0,0.07)] border-[rgba(139,0,0,0.20)]',
  archived: 'text-faint bg-surface border-line',
};

@Component({
  selector: 'app-status-badge',
  template: `<span [class]="classes()">{{ label() ?? status() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadge {
  readonly status = input.required<Status>();
  readonly label = input<string>();

  protected readonly classes = computed(
    () =>
      `inline-flex items-center gap-1 font-mono text-overline uppercase tracking-[0.10em] px-2.5 py-0.5 border ${TONE[this.status()]}`,
  );
}
