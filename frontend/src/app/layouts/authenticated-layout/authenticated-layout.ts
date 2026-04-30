import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopNav, Sidebar, CurrentUser, SidebarItem } from '../../shared';
import { AuthService } from '../../core/services/auth.service';

const DEFAULT_RENTER_ITEMS: SidebarItem[] = [
  { label: 'Bookings', route: '/dashboard/bookings', section: 'Renting' },
  { label: 'Messages', route: '/dashboard/messages', section: 'Renting' },
  { label: 'Reviews', route: '/dashboard/reviews', section: 'Renting' },
  { label: 'Profile', route: '/dashboard/profile', section: 'Account' },
  { label: 'Notifications', route: '/dashboard/notifications', section: 'Account' },
];

const LISTER_ITEMS: SidebarItem[] = [
  { label: 'Listings', route: '/dashboard/listings', section: 'Listing' },
  { label: 'Earnings', route: '/dashboard/earnings', section: 'Listing' },
  { label: 'Bookings', route: '/dashboard/bookings', section: 'Renting' },
  { label: 'Messages', route: '/dashboard/messages', section: 'Renting' },
  { label: 'Profile', route: '/dashboard/profile', section: 'Account' },
];

@Component({
  selector: 'app-authenticated-layout',
  imports: [RouterOutlet, TopNav, Sidebar],
  template: `
    <app-top-nav mode="authenticated" [currentUser]="navUser()" (signOut)="onSignOut()" />
    <div class="grid grid-cols-[220px_1fr] min-h-[calc(100vh-60px)]">
      <app-sidebar [items]="resolvedItems()" />
      <main class="bg-bone overflow-x-hidden">
        <router-outlet />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticatedLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly sidebarItems = input<SidebarItem[] | null>(null);

  protected readonly navUser = computed<CurrentUser | null>(() => {
    const u = this.auth.currentUser();
    return u ? { name: u.name, avatarUrl: u.avatarUrl, role: u.role } : null;
  });

  protected readonly resolvedItems = computed<SidebarItem[]>(() => {
    if (this.sidebarItems()) return this.sidebarItems()!;
    return this.auth.role() === 'lister' ? LISTER_ITEMS : DEFAULT_RENTER_ITEMS;
  });

  protected onSignOut(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
