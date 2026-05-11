import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import type { Condition } from '../badge/badge';

interface Option {
  value: Condition;
  label: string;
  description: string;
  tone: string;
}

const OPTIONS: Option[] = [
  {
    value: 'mint',
    label: 'Mint',
    description: 'Like new. Minimal use, no visible wear.',
    tone: 'text-mint',
  },
  {
    value: 'fieldReady',
    label: 'Field-Ready',
    description: 'Solid working order. Honest wear from time in the field.',
    tone: 'text-olive',
  },
  {
    value: 'battleScarred',
    label: 'Battle-Scarred',
    description: 'Functional but well-used. Visible wear and tear.',
    tone: 'text-battle',
  },
];

@Component({
  selector: 'app-condition-rating-input',
  template: `
    <div
      class="grid grid-cols-3 gap-0.5 bg-line border border-line"
      role="radiogroup"
      aria-label="Condition rating"
    >
      @for (option of options; track option.value) {
        <button
          type="button"
          role="radio"
          [attr.aria-checked]="option.value === value()"
          [class]="optionClass(option.value)"
          (click)="value.set(option.value)"
        >
          <span [class]="'font-condensed text-[22px] font-black uppercase tracking-[0.08em] mb-2 block ' + option.tone">
            {{ option.label }}
          </span>
          <span class="text-sm text-muted leading-relaxed">{{ option.description }}</span>
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionRatingInput {
  readonly value = model<Condition>('mint');
  protected readonly options = OPTIONS;

  protected optionClass(option: Condition): string {
    const base = 'p-7 bg-bone text-left cursor-pointer transition-colors';
    return option === this.value()
      ? `${base} ring-2 ring-slate ring-inset`
      : `${base} hover:bg-surface`;
  }
}
