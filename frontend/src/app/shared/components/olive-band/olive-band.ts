import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface OliveBandPillar {
  title: string;
  body: string;
}

@Component({
  selector: 'app-olive-band',
  template: `
    <section class="bg-olive py-10 px-(--kitlo-page-gutter)">
      <div
        class="mx-auto max-w-(--kitlo-max-width) grid md:grid-cols-[auto_1fr] gap-10 md:gap-15 items-center"
      >
        <div>
          <p
            class="font-condensed text-[11px] font-bold tracking-[0.20em] uppercase text-on-dark-muted mb-2"
          >{{ label() }}</p>
          <h2
            class="font-condensed text-[38px] font-black uppercase text-on-dark tracking-[0.02em] leading-none"
          >{{ headline() }}</h2>
          <p class="text-body text-on-dark-muted leading-relaxed mt-2">{{ sub() }}</p>
        </div>
        <ul class="grid grid-cols-1 md:grid-cols-3 gap-8 list-none">
          @for (pillar of pillars(); track pillar.title) {
            <li class="border-t-2 border-on-dark-muted/40 pt-4">
              <p
                class="font-condensed text-base font-extrabold uppercase text-on-dark tracking-[0.06em] mb-2"
              >{{ pillar.title }}</p>
              <p class="text-xs text-on-dark-faint leading-relaxed">{{ pillar.body }}</p>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OliveBand {
  readonly label = input.required<string>();
  readonly headline = input.required<string>();
  readonly sub = input.required<string>();
  readonly pillars = input.required<OliveBandPillar[]>();
}
