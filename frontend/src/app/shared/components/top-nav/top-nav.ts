import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
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
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
  styles: `
    .menu-panel {
      animation: kitlo-menu-in 160ms ease-out;
    }
    @keyframes kitlo-menu-in {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  template: `
    <nav
      aria-label="Primary"
      class="bg-bone border-b border-line sticky top-0 z-[100] flex items-center justify-between px-(--kitlo-page-gutter) h-[60px]"
    >
      <a
        routerLink="/"
        class="font-condensed font-extrabold text-[22px] uppercase tracking-[0.12em] text-slate no-underline"
        (click)="closeMenu()"
      >
        Kit<span class="text-olive">lo</span>
      </a>

      @if (mode() === 'public' && links().length) {
        <ul class="hidden md:flex gap-8 list-none">
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

      <div class="hidden md:flex items-center gap-3.5">
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
          <a
            routerLink="/auth/signup"
            [queryParams]="{ intent: 'lister' }"
            class="bg-slate text-on-dark px-5 py-2.5 rounded-md text-sm font-bold hover:bg-slate-mid"
          >
            List your gear
          </a>
        }
      </div>

      @if (showMobileToggle()) {
        <button
          #toggleBtn
          type="button"
          class="md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-slate cursor-pointer"
          [attr.aria-expanded]="menuOpen()"
          [attr.aria-label]="menuOpen() ? 'Close menu' : 'Open menu'"
          aria-controls="kitlo-mobile-menu"
          (click)="toggleMenu()"
        >
          @if (menuOpen()) {
            <svg
              viewBox="0 0 20 20"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              stroke-width="1.25"
              aria-hidden="true"
            >
              <path d="M5 5l10 10M15 5l-10 10" stroke-linecap="square" />
            </svg>
          } @else {
            <svg
              viewBox="0 0 20 20"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              stroke-width="1.25"
              aria-hidden="true"
            >
              <path d="M3 6h14M3 10h14M3 14h14" stroke-linecap="square" />
            </svg>
          }
        </button>
      }
    </nav>

    @if (menuOpen()) {
      <nav
        id="kitlo-mobile-menu"
        aria-label="Mobile"
        class="menu-panel md:hidden fixed inset-x-0 top-[60px] bottom-0 bg-bone z-[99] flex flex-col overflow-y-auto"
      >
        <div class="flex flex-col px-(--kitlo-page-gutter) pt-2 pb-10">
          @if (mode() === 'public' && links().length) {
            <ul class="flex flex-col list-none border-t border-line">
              @for (link of links(); track link.route) {
                <li class="border-b border-line">
                  <a
                    [routerLink]="link.route"
                    routerLinkActive="text-olive"
                    [routerLinkActiveOptions]="{ exact: false }"
                    class="font-condensed font-bold text-h3 uppercase tracking-[0.06em] text-slate hover:text-olive py-5 block transition-colors"
                    (click)="closeMenu()"
                  >{{ link.label }}</a>
                </li>
              }
            </ul>
          }

          <div class="mt-10 flex flex-col gap-3">
            @if (currentUser(); as user) {
              <button
                type="button"
                class="flex items-center gap-3 cursor-pointer py-3 text-left"
                (click)="onSignOut()"
                [attr.aria-label]="'Sign out (' + user.name + ')'"
              >
                <app-avatar [name]="user.name" [imageUrl]="user.avatarUrl" size="sm" />
                <span class="font-mono text-overline tracking-[0.10em] uppercase text-muted">
                  Signed in as {{ user.name }} — sign out
                </span>
              </button>
            } @else {
              <a
                routerLink="/auth/login"
                class="font-medium text-body text-ink py-3 border-b border-line"
                (click)="closeMenu()"
              >Sign in</a>
              <a
                routerLink="/auth/signup"
                [queryParams]="{ intent: 'lister' }"
                class="bg-slate text-on-dark text-center px-5 py-4 rounded-md text-sm font-bold hover:bg-slate-mid mt-2"
                (click)="closeMenu()"
              >
                List your gear
              </a>
            }
            <div class="mt-6">
              <app-role-switcher />
            </div>
          </div>
        </div>
      </nav>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopNav {
  readonly mode = input<NavMode>('public');
  readonly currentUser = input<CurrentUser | null>(null);
  readonly links = input<NavLink[]>([]);
  readonly signOut = output<void>();

  protected readonly menuOpen = signal(false);

  private readonly toggleBtn = viewChild<ElementRef<HTMLButtonElement>>('toggleBtn');

  protected readonly showMobileToggle = computed(() => this.mode() !== 'minimal');

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  protected closeMenu(returnFocus = false): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    if (returnFocus) {
      queueMicrotask(() => this.toggleBtn()?.nativeElement.focus());
    }
  }

  protected onEscape(): void {
    this.closeMenu(true);
  }

  protected onSignOut(): void {
    this.signOut.emit();
    this.closeMenu();
  }
}
