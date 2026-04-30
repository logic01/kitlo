import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SearchBar, SearchQuery } from '../search-bar/search-bar';

@Component({
  selector: 'app-hero',
  imports: [SearchBar],
  template: `
    <section class="border-b-2 border-slate">
      <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) grid md:grid-cols-2">
        <div class="py-20 pr-15 md:border-r border-line">
          @if (kicker()) {
            <p
              class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-7 pb-3.5 border-b border-line"
            >{{ kicker() }}</p>
          }
          <h1
            class="font-condensed font-black text-hero uppercase text-slate"
          >
            {{ headline() }}
            @if (accent()) {
              <span class="text-olive"> {{ accent() }}</span>
            }
          </h1>
          @if (sub()) {
            <p class="text-body-lg text-muted mt-7 max-w-md">{{ sub() }}</p>
          }
          @if (showSearch()) {
            <div class="mt-10">
              <app-search-bar variant="hero" (submitted)="searched.emit($event)" />
            </div>
          }
        </div>
        <div class="py-15 pl-15 flex flex-col justify-center">
          <ng-content select="[slot=right]" />
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  readonly kicker = input<string>();
  readonly headline = input.required<string>();
  readonly accent = input<string>();
  readonly sub = input<string>();
  readonly showSearch = input<boolean>(true);
  readonly searched = output<SearchQuery>();
}
