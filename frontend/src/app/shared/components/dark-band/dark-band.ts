import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TrustCard } from '../trust-card/trust-card';

export interface TrustCardData {
  label: string;
  title: string;
  body: string;
}

@Component({
  selector: 'app-dark-band',
  imports: [TrustCard],
  template: `
    <section class="bg-slate">
      <div
        class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-16 grid md:grid-cols-2 gap-16 items-center"
      >
        <div>
          <h2
            class="font-condensed text-[48px] font-black uppercase text-on-dark leading-tight tracking-[0.01em]"
          >
            {{ heading() }}
            @if (accent()) {
              <em class="not-italic text-amber"> {{ accent() }}</em>
            }
          </h2>
          @if (sub()) {
            <p class="text-body-lg text-on-dark-muted leading-relaxed mt-4">{{ sub() }}</p>
          }
        </div>
        <div class="grid grid-cols-2 gap-5">
          @for (card of cards(); track card.title) {
            <app-trust-card [label]="card.label" [title]="card.title" [body]="card.body" />
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkBand {
  readonly heading = input.required<string>();
  readonly accent = input<string>();
  readonly sub = input<string>();
  readonly cards = input.required<TrustCardData[]>();
}
