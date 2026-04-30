import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Avatar } from '../avatar/avatar';
import { RoleSwitcher } from '../role-switcher/role-switcher';

export type NavMode = 'public' | 'authenticated' | 'minimal';

export interface NavLink {
  label: string;
  route: string;
}

export interface CurrentUser {
  name: string;
  avatarUrl?: string;
  role: 'renter' | 'lister' | 'admin';
}

@Component({
  selector: 'app-top-nav',
  imports: [RouterLink, RouterLinkActive, Avatar, RoleSwitcher],
  template: `
    <nav
      class="bg-bone border-b border-line sticky top-0 z-[100] flex items-center justify-between px-(--kitlo-page-gutter) h-[60px]"
    >
      <a
        routerLink="/"
        class="font-condensed font-extrabold text-[22px] uppercase tracking-[0.12em] text-slate no-underline"
      >
        Kit<span class="text-olive">lo</span>
      </a>

      @if (mode() === 'public' && links().length) {
        <ul class="flex gap-8 list-none">
          @for (link of links(); track link.route) {
            <li>
              <a
                [routerLink]="link.route"
                routerLinkActive="text-slate font-semibold"
                [routerLinkActiveOptions]="{ exact: false }"
                class="font-medium text-sm text-muted hover:text-ink transition-colors"
              >{{ link.label }}</a>
            </li>
          }
        </ul>
      }

      <div class="flex items-center gap-3.5">
        <app-role-switcher />
        @if (mode() === 'minimal') {
          <!-- minimal nav: logo only -->
        } @else if (currentUser(); as user) {
          <button
            type="button"
            class="flex items-center gap-2 cursor-pointer"
            (click)="signOut.emit()"
            [attr.aria-label]="'Signed in as ' + user.name"
          >
            <app-avatar [name]="user.name" [imageUrl]="user.avatarUrl" size="sm" />
            <span class="text-sm font-medium text-ink">{{ user.name }}</span>
          </button>
        } @else {
          <a routerLink="/auth/login" class="font-medium text-sm text-muted hover:text-ink">
            Sign in
          </a>
          <a routerLink="/auth/signup?intent=lister" class="bg-slate text-on-dark px-5 py-2.5 rounded-md text-sm font-bold hover:bg-slate-mid">
            List your gear
          </a>
        }
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopNav {
  readonly mode = input<NavMode>('public');
  readonly currentUser = input<CurrentUser | null>(null);
  readonly links = input<NavLink[]>([]);
  readonly signOut = output<void>();
}
