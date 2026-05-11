import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SearchBar, SearchQuery } from '../search-bar/search-bar';

@Component({
  selector: 'app-hero',
  imports: [SearchBar],
  template: `
    <section class="border-b-2 border-slate">
      <div
        class="mx-auto max-w-(--kitlo-max-width) flex flex-col md:grid md:grid-cols-2 md:px-(--kitlo-page-gutter)"
      >
        <!--
          Right slot renders first in DOM so on mobile (flex column) the image
          appears above the headline. Desktop reverses via grid order.
        -->
        <div
          class="order-1 md:order-2 flex flex-col justify-center md:py-15 md:pl-15"
        >
          <ng-content select="[slot=right]" />
        </div>
        <div
          class="order-2 md:order-1 px-(--kitlo-page-gutter) md:pl-0 md:pr-15 py-12 md:py-20 md:border-r border-line"
        >
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
