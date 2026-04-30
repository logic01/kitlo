import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Crumb {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-page-header',
  imports: [RouterLink],
  template: `
    <header class="px-10 py-8 border-b border-line flex items-start justify-between gap-6">
      <div>
        @if (breadcrumbs().length) {
          <nav aria-label="Breadcrumb" class="flex items-center gap-2 mb-2">
            @for (crumb of breadcrumbs(); track $index; let last = $last) {
              @if (crumb.route && !last) {
                <a
                  [routerLink]="crumb.route"
                  class="font-mono text-overline tracking-[0.10em] uppercase text-muted no-underline"
                >{{ crumb.label }}</a>
              } @else {
                <span
                  class="font-mono text-overline tracking-[0.10em] uppercase"
                  [class.text-slate]="last"
                  [class.text-muted]="!last"
                >{{ crumb.label }}</span>
              }
              @if (!last) {
                <span class="text-line font-mono text-overline" aria-hidden="true">/</span>
              }
            }
          </nav>
        }
        <h1
          class="font-condensed font-black text-h1 uppercase tracking-[0.02em] text-slate leading-none"
        >{{ title() }}</h1>
        @if (subtitle()) {
          <p class="text-sm text-muted mt-1">{{ subtitle() }}</p>
        }
      </div>
      <div class="flex gap-3 shrink-0 items-center">
        <ng-content select="[slot=actions]" />
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly breadcrumbs = input<Crumb[]>([]);
}
