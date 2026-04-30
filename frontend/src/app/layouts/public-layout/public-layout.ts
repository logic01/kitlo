import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNav, Footer } from '../../shared';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, TopNav, Footer],
  template: `
    <app-top-nav
      mode="public"
      [links]="[
        { label: 'How it works', route: '/how-it-works' },
        { label: 'Browse gear', route: '/search' },
        { label: 'For listers', route: '/list-your-gear' }
      ]"
    />
    <main class="bg-bone min-h-[calc(100vh-60px-72px)]">
      <router-outlet />
    </main>
    <app-footer />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayout {}
