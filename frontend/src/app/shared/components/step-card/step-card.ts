import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-step-card',
  template: `
    <article class="p-7 border border-line">
      <div
        class="font-condensed text-[64px] font-black text-faint leading-none mb-3"
        aria-hidden="true"
      >
        {{ stepNumber() }}
      </div>
      <h3
        class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] text-slate mb-2"
      >
        {{ title() }}
      </h3>
      <p class="text-sm text-muted leading-relaxed">{{ body() }}</p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepCard {
  readonly stepNumber = input.required<string | number>();
  readonly title = input.required<string>();
  readonly body = input.required<string>();
}
