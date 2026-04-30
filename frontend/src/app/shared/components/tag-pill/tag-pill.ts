import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type TagPillTone = 'slate' | 'amber';

@Component({
  selector: 'app-tag-pill',
  template: `
    <button
      type="button"
      [class]="classes()"
      [attr.aria-pressed]="selected()"
      (click)="toggled.emit()"
    >
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagPill {
  readonly selected = input(false);
  readonly tone = input<TagPillTone>('slate');
  readonly toggled = output<void>();

  protected readonly classes = computed(() => {
    const base =
      'inline-flex items-center font-mono text-[10px] tracking-[0.06em] uppercase border px-2.5 py-1 cursor-pointer transition-colors select-none';
    if (!this.selected()) {
      return `${base} text-muted border-line bg-bone hover:border-slate hover:text-ink`;
    }
    return this.tone() === 'amber'
      ? `${base} bg-amber border-amber text-white`
      : `${base} bg-slate border-slate text-on-dark`;
  });
}
