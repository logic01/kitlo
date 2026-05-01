import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import type { UserRole } from '../../../core/models/user';

const OPTIONS: { value: UserRole | 'guest'; label: string }[] = [
  { value: 'guest', label: 'Logged out' },
  { value: 'renter', label: 'Renter' },
  { value: 'lister', label: 'Lister' },
  { value: 'admin', label: 'Admin' },
];

/**
 * Dev-only role switcher. Hidden in production builds via environment.production.
 * Lets the user walk every workflow without re-signup.
 */
@Component({
  selector: 'app-role-switcher',
  template: `
    @if (visible()) {
      <div class="flex items-center gap-2 text-xs text-muted">
        <label for="kitlo-role-switcher" class="font-mono uppercase tracking-[0.08em]">Role</label>
        <select
          id="kitlo-role-switcher"
          class="bg-bone border border-line text-xs font-mono px-2 py-1 cursor-pointer"
          [value]="current()"
          (change)="onChange($event)"
        >
          @for (option of options; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleSwitcher {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly options = OPTIONS;

  protected readonly visible = computed(() => !environment.production);

  protected readonly current = computed<UserRole | 'guest'>(
    () => this.auth.role() ?? 'guest',
  );

  protected onChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as UserRole | 'guest';
    this.auth.switchTo(value);
    this.router.navigate(['/']);
  }
}
