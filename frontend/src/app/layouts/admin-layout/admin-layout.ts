import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopNav, Sidebar, CurrentUser, SidebarItem } from '../../shared';
import { AuthService } from '../../core/services/auth.service';

const ADMIN_ITEMS: SidebarItem[] = [
  { label: 'Listing review', route: '/admin/listings', section: 'Moderation', badgeCount: 4 },
  { label: 'Disputes', route: '/admin/disputes', section: 'Moderation', badgeCount: 2 },
  { label: 'Users', route: '/admin/users', section: 'Operations' },
  { label: 'Payouts', route: '/admin/payouts', section: 'Operations' },
];

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, TopNav, Sidebar],
  template: `
    <app-top-nav mode="authenticated" [currentUser]="navUser()" (signOut)="onSignOut()" />
    <div class="grid grid-cols-[220px_1fr] min-h-[calc(100vh-60px)]">
      <app-sidebar [items]="items()" />
      <main class="bg-bone overflow-x-hidden">
        <router-outlet />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly items = input<SidebarItem[]>(ADMIN_ITEMS);

  protected readonly navUser = computed<CurrentUser | null>(() => {
    const u = this.auth.currentUser();
    return u ? { name: u.name, avatarUrl: u.avatarUrl, role: u.role } : null;
  });

  protected onSignOut(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
