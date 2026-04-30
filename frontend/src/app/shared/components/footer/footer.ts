import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface FooterLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer
      class="bg-charcoal text-on-dark-muted px-(--kitlo-page-gutter) py-8 flex justify-between items-center"
    >
      <a
        routerLink="/"
        class="font-condensed font-black text-[20px] uppercase tracking-[0.12em] text-on-dark"
      >
        Kit<span class="text-amber">lo</span>
      </a>
      @if (links().length) {
        <ul class="flex gap-6 list-none">
          @for (link of links(); track link.route) {
            <li>
              <a
                [routerLink]="link.route"
                class="text-xs hover:text-on-dark transition-colors"
              >{{ link.label }}</a>
            </li>
          }
        </ul>
      }
      <p class="font-mono text-[11px] text-on-dark-faint">
        © {{ year }} Kitlo. All rights reserved.
      </p>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly links = input<FooterLink[]>([
    { label: 'How it works', route: '/how-it-works' },
    { label: 'Trust & safety', route: '/trust' },
    { label: 'Terms', route: '/terms' },
    { label: 'Privacy', route: '/privacy' },
  ]);

  protected readonly year = new Date().getFullYear();
}
