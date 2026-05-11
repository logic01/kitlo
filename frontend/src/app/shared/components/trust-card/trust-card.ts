import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-trust-card',
  host: { class: 'block h-full' },
  template: `
    <article class="h-full p-5 border border-line-dark">
      <p
        class="font-mono text-overline text-amber tracking-[0.10em] uppercase mb-2"
      >
        {{ label() }}
      </p>
      <h3
        class="font-condensed text-[17px] font-extrabold uppercase text-on-dark mb-2 tracking-[0.06em]"
      >
        {{ title() }}
      </h3>
      <p class="text-xs text-on-dark-faint leading-relaxed">{{ body() }}</p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustCard {
  readonly label = input.required<string>();
  readonly title = input.required<string>();
  readonly body = input.required<string>();
}
