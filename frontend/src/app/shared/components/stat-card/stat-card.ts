import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type StatTone = 'default' | 'primary' | 'pending';

const VALUE_TONE: Record<StatTone, string> = {
  default: 'text-slate',
  primary: 'text-olive',
  pending: 'text-amber-dark',
};

@Component({
  selector: 'app-stat-card',
  template: `
    <article class="border border-line bg-bone px-6 py-5">
      <span
        class="font-mono text-overline tracking-[0.12em] uppercase text-muted mb-2 block"
      >
        {{ overline() }}
      </span>
      <p [class]="valueClass()">{{ value() }}</p>
      @if (sublabel()) {
        <p class="text-xs text-muted mt-1">{{ sublabel() }}</p>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  readonly overline = input.required<string>();
  readonly value = input.required<string>();
  readonly sublabel = input<string>();
  readonly tone = input<StatTone>('default');

  protected readonly valueClass = computed(
    () =>
      `font-mono text-h2 font-medium leading-none ${VALUE_TONE[this.tone()]}`,
  );
}
