import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type DotTone = 'active' | 'confirmed' | 'disputed' | 'pending' | 'paused';

const TONE: Record<DotTone, string> = {
  active: 'bg-olive',
  confirmed: 'bg-[#1A6B52]',
  disputed: 'bg-battle',
  pending: 'bg-amber',
  paused: 'bg-faint',
};

@Component({
  selector: 'app-status-dot',
  template: `<span [class]="classes()" [attr.aria-label]="tone()"></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusDot {
  readonly tone = input.required<DotTone>();
  protected readonly classes = computed(
    () => `inline-block w-2 h-2 rounded-full shrink-0 ${TONE[this.tone()]}`,
  );
}
