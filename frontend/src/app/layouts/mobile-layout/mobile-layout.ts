import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MobileTabBar, MobileTabItem } from '../../shared';

const DEFAULT_MOBILE_TABS: MobileTabItem[] = [
  { label: 'Home', route: '/', icon: '⌂' },
  { label: 'Search', route: '/search', icon: '⌕' },
  { label: 'Bookings', route: '/dashboard/bookings', icon: '◷' },
  { label: 'Profile', route: '/dashboard/profile', icon: '◯' },
];

@Component({
  selector: 'app-mobile-layout',
  imports: [RouterOutlet, MobileTabBar],
  template: `
    <main class="bg-bone min-h-dvh pb-16">
      <router-outlet />
    </main>
    <app-mobile-tab-bar [items]="tabs()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileLayout {
  readonly tabs = input<MobileTabItem[]>(DEFAULT_MOBILE_TABS);
}
