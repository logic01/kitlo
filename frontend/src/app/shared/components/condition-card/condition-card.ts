import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Condition } from '../badge/badge';

const NAME_TONE: Record<Condition, string> = {
  mint: 'text-mint',
  'field-ready': 'text-olive',
  'battle-scarred': 'text-battle',
};

const LABELS: Record<Condition, string> = {
  mint: 'Mint',
  'field-ready': 'Field-Ready',
  'battle-scarred': 'Battle-Scarred',
};

@Component({
  selector: 'app-condition-card',
  template: `
    <article class="bg-bone p-7">
      <h3 [class]="nameClasses()">{{ LABELS[condition()] }}</h3>
      <p class="text-sm text-muted leading-relaxed">{{ description() }}</p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionCard {
  readonly condition = input.required<Condition>();
  readonly description = input.required<string>();

  protected readonly LABELS = LABELS;
  protected readonly nameClasses = computed(
    () =>
      `font-condensed text-[22px] font-black uppercase tracking-[0.08em] mb-2 ${NAME_TONE[this.condition()]}`,
  );
}
