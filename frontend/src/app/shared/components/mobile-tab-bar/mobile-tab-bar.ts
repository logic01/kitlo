import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface MobileTabItem {
  label: string;
  route: string;
  icon: string;
  badgeCount?: number;
}

@Component({
  selector: 'app-mobile-tab-bar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav
      class="fixed bottom-0 inset-x-0 bg-bone border-t border-line flex justify-around items-stretch h-[64px] z-[90]"
      role="tablist"
    >
      @for (item of items(); track item.route) {
        <a
          [routerLink]="item.route"
          routerLinkActive="!text-slate"
          [routerLinkActiveOptions]="{ exact: false }"
          class="flex-1 flex flex-col items-center justify-center gap-1 text-muted no-underline relative"
        >
          <span aria-hidden="true" class="text-[18px]">{{ item.icon }}</span>
          <span class="font-mono text-[10px] tracking-[0.06em] uppercase">{{ item.label }}</span>
          @if (item.badgeCount; as count) {
            <span
              class="absolute top-2 right-1/2 translate-x-3 bg-amber text-white font-mono text-[9px] px-1 rounded-full min-w-[14px] text-center"
            >{{ count }}</span>
          }
        </a>
      }
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileTabBar {
  readonly items = input.required<MobileTabItem[]>();
}
