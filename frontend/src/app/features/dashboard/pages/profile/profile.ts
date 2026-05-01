import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Alert, Avatar, Badge, Button, FormField, Input, PageHeader, Toggle } from '../../../../shared';
import { AuthService } from '../../../../core/services/auth.service';
import { UsersService } from '../../../../core/services/users.service';
import type { NotificationPreferences } from '../../../../core/services/users.service';

@Component({
  selector: 'app-dashboard-profile',
  imports: [ReactiveFormsModule, Alert, Avatar, Badge, Button, FormField, Input, PageHeader, Toggle],
  template: `
    <div class="px-8 py-8 max-w-3xl">
      <app-page-header title="Profile & settings" />

      <section class="mt-6 mb-10">
        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Public profile</p>
        <div class="flex items-center gap-5 p-5 border border-line bg-bone">
          <app-avatar size="lg" [name]="userName()" [imageUrl]="user()?.avatarUrl" />
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-condensed text-h3 font-extrabold uppercase text-slate">{{ userName() }}</span>
              @if (user()?.verified) {
                <app-badge kind="verified" label="Verified Hunter" />
              }
            </div>
            <div class="text-xs text-muted">{{ user()?.email }} · {{ user()?.city }}, {{ user()?.state }}</div>
          </div>
          <button appButton variant="ghost" type="button">Change photo</button>
        </div>
      </section>

      <form [formGroup]="form" (ngSubmit)="save()" class="mb-10">
        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Profile details</p>
        <div class="grid grid-cols-2 gap-3">
          <app-form-field label="First name">
            <input appInput formControlName="firstName" />
          </app-form-field>
          <app-form-field label="Last name">
            <input appInput formControlName="lastName" />
          </app-form-field>
        </div>
        <app-form-field label="City & state">
          <input appInput formControlName="location" />
        </app-form-field>
        <app-form-field label="Bio" hint="Renters see this on your profile.">
          <textarea appInput rows="4" formControlName="bio"></textarea>
        </app-form-field>
        @if (saved()) {
          <app-alert tone="success" class="block mb-3">Profile saved.</app-alert>
        }
        <button appButton variant="primary" type="submit" [disabled]="saving()">
          {{ saving() ? 'Saving…' : 'Save changes' }}
        </button>
      </form>

      <section class="mb-10">
        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Notifications</p>
        <div class="border border-line bg-bone p-5 space-y-4">
          <app-toggle
            label="Booking updates"
            sub="Email + push on confirmation, pickup, return"
            [checked]="prefs().emailBookingUpdates"
            (checkedChange)="updatePref('emailBookingUpdates', $event)"
          />
          <app-toggle
            label="New messages"
            sub="Email on every new message"
            [checked]="prefs().emailMessages"
            (checkedChange)="updatePref('emailMessages', $event)"
          />
          <app-toggle
            label="Marketing emails"
            sub="Featured gear and seasonal updates"
            [checked]="prefs().emailMarketing"
            (checkedChange)="updatePref('emailMarketing', $event)"
          />
        </div>
      </section>

      <section>
        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Account</p>
        <div class="border border-line p-5 bg-bone space-y-3">
          <button appButton variant="ghost" type="button">Change password</button>
          <button appButton variant="ghost" type="button">Export my data</button>
          <button appButton variant="ghost" type="button" class="text-battle">Delete account</button>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardProfile {
  private readonly auth = inject(AuthService);
  private readonly users = inject(UsersService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly user = this.auth.currentUser;
  protected readonly userName = () => this.auth.currentUser()?.name ?? '';
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);

  protected readonly form = this.fb.group({
    firstName: [this.user()?.name.split(' ')[0] ?? '', Validators.required],
    lastName: [this.user()?.name.split(' ').slice(1).join(' ') ?? ''],
    location: [`${this.user()?.city ?? ''}, ${this.user()?.state ?? ''}`.replace(/^,\s*/, '')],
    bio: [''],
  });

  protected readonly prefs = signal<NotificationPreferences>({
    emailBookingUpdates: true,
    emailMessages: true,
    emailMarketing: false,
    pushBookingUpdates: true,
    pushMessages: true,
    smsBookingReminders: false,
  });

  constructor() {
    this.users.getNotificationPreferences().subscribe((p) => this.prefs.set(p));
  }

  protected save(): void {
    if (this.saving()) return;
    this.saving.set(true);
    this.saved.set(false);
    const value = this.form.getRawValue();
    const [city, state] = (value.location ?? '').split(',').map((s) => s.trim());
    this.users
      .updateProfile({
        name: `${value.firstName} ${value.lastName}`.trim(),
        city: city || undefined,
        state: state || undefined,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.saved.set(true);
        },
        error: () => this.saving.set(false),
      });
  }

  protected updatePref(key: keyof NotificationPreferences, value: boolean): void {
    this.prefs.update((p) => ({ ...p, [key]: value }));
    this.users.updateNotificationPreferences({ [key]: value }).subscribe();
  }
}
