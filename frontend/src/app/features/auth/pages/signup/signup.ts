import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Alert, Button, FormField, Input, Stepper, type StepDef } from '../../../../shared';
import { AuthService } from '../../../../core/services/auth.service';

const STEPS: StepDef[] = [
  { label: 'Account' },
  { label: 'Profile' },
  { label: 'Intent' },
];

type Intent = 'renter' | 'lister' | 'both';

@Component({
  selector: 'app-auth-signup',
  imports: [ReactiveFormsModule, RouterLink, Alert, Button, FormField, Input, Stepper],
  template: `
    <div class="mx-auto max-w-xl px-(--kitlo-page-gutter) py-12">
      <div class="border border-line bg-bone p-8">
        <app-stepper [steps]="steps" [currentIndex]="step()" />
        <div class="h-8"></div>

        @switch (step()) {
          @case (0) {
            <h1 class="font-condensed text-h1 font-black uppercase text-slate leading-none mb-2">
              Create your account
            </h1>
            <p class="text-body text-muted mb-7">It takes about a minute. We'll never share your email.</p>

            <button appButton variant="secondary" type="button" class="w-full mb-3">Continue with Google</button>
            <button appButton variant="secondary" type="button" class="w-full mb-5">Continue with Apple</button>

            <div class="relative my-5 text-center text-xs text-muted">
              <span class="bg-bone px-3 relative z-[1]">or sign up with email</span>
              <div class="absolute inset-x-0 top-1/2 border-t border-line"></div>
            </div>

            <form [formGroup]="account" (ngSubmit)="advance()">
              <app-form-field label="Email" required [control]="account.controls.email">
                <input
                  appInput
                  type="email"
                  formControlName="email"
                  placeholder="you@example.com"
                  [invalid]="showError(account.controls.email)"
                />
              </app-form-field>
              <app-form-field
                label="Create a password"
                hint="At least 8 characters."
                required
                [control]="account.controls.password"
              >
                <input
                  appInput
                  type="password"
                  formControlName="password"
                  placeholder="At least 8 characters"
                  [invalid]="showError(account.controls.password)"
                />
              </app-form-field>
              <button appButton variant="primary" type="submit" class="w-full">
                Continue
              </button>
            </form>

            <p class="text-center text-xs text-muted mt-5 leading-relaxed">
              By creating an account, you agree to our
              <a routerLink="/terms" class="text-olive underline">Terms</a> and
              <a routerLink="/privacy" class="text-olive underline">Privacy Policy</a>.
            </p>
          }

          @case (1) {
            <h1 class="font-condensed text-h1 font-black uppercase text-slate leading-none mb-2">
              Tell us about yourself
            </h1>
            <p class="text-body text-muted mb-7">
              Hunters trust real people. A photo and a city help build that trust.
            </p>

            <div class="text-center mb-6">
              <div class="w-24 h-24 mx-auto rounded-full bg-surface border border-line flex items-center justify-center font-mono text-xs text-muted">UPLOAD</div>
              <button appButton variant="ghost" type="button" size="sm" class="mt-3">Upload photo</button>
              <button appButton variant="ghost" type="button" size="sm" class="ml-2 text-muted">Skip</button>
            </div>

            <form [formGroup]="profile" (ngSubmit)="advance()">
              <div class="grid grid-cols-2 gap-3">
                <app-form-field label="First name" required [control]="profile.controls.firstName">
                  <input
                    appInput
                    formControlName="firstName"
                    [invalid]="showError(profile.controls.firstName)"
                  />
                </app-form-field>
                <app-form-field label="Last name" required [control]="profile.controls.lastName">
                  <input
                    appInput
                    formControlName="lastName"
                    [invalid]="showError(profile.controls.lastName)"
                  />
                </app-form-field>
              </div>
              <app-form-field label="City & state" required [control]="profile.controls.location">
                <input
                  appInput
                  formControlName="location"
                  placeholder="Bozeman, MT"
                  [invalid]="showError(profile.controls.location)"
                />
              </app-form-field>
              <div class="flex gap-2 mt-3">
                <button appButton variant="ghost" type="button" (click)="back()">Back</button>
                <button appButton variant="primary" type="submit" class="flex-1">
                  Continue
                </button>
              </div>
            </form>
          }

          @case (2) {
            <h1 class="font-condensed text-h1 font-black uppercase text-slate leading-none mb-2">
              What brings you to Kitlo?
            </h1>
            <p class="text-body text-muted mb-7">
              You can change this any time — we just want to point you at the right starting screen.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              @for (option of intentOptions; track option.id) {
                <button
                  type="button"
                  class="flex flex-col items-start p-5 border text-left transition-colors"
                  [class.border-olive]="intent() === option.id"
                  [class.bg-olive-pale]="intent() === option.id"
                  [class.border-line]="intent() !== option.id"
                  (click)="intent.set(option.id)"
                >
                  <div class="font-condensed text-h3 font-extrabold text-slate uppercase mb-1">
                    {{ option.title }}
                  </div>
                  <p class="text-sm text-muted leading-relaxed">{{ option.body }}</p>
                </button>
              }
            </div>
            @if (error(); as msg) {
              <app-alert tone="danger" class="block mb-3">{{ msg }}</app-alert>
            }
            <div class="flex gap-2">
              <button appButton variant="ghost" type="button" (click)="back()">Back</button>
              <button
                appButton
                variant="primary"
                type="button"
                class="flex-1"
                [disabled]="submitting()"
                (click)="finish()"
              >
                {{ submitting() ? 'Creating account…' : ctaLabel() }}
              </button>
            </div>
          }
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSignup {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly steps = STEPS;
  protected readonly step = signal(0);
  protected readonly intent = signal<Intent>('both');
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly account = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected readonly profile = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    location: ['', Validators.required],
  });

  protected readonly intentOptions: { id: Intent; title: string; body: string }[] = [
    { id: 'renter', title: 'Rent gear', body: 'Find thermal, NV, and high-value gear from verified hunters near you.' },
    { id: 'lister', title: 'List gear', body: 'Earn income from gear sitting in your safe between seasons.' },
    { id: 'both', title: 'Both', body: 'Rent when you need extras, list what you have. Most hunters pick this.' },
  ];

  protected readonly ctaLabel = computed(() =>
    this.intent() === 'renter' ? 'Find your first listing' : 'Continue to lister setup',
  );

  protected advance(): void {
    if (this.step() === 0 && this.account.invalid) {
      this.account.markAllAsTouched();
      return;
    }
    if (this.step() === 1 && this.profile.invalid) {
      this.profile.markAllAsTouched();
      return;
    }
    this.step.update((n) => Math.min(n + 1, STEPS.length - 1));
  }

  protected back(): void {
    this.step.update((n) => Math.max(0, n - 1));
  }

  protected showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  protected finish(): void {
    if (this.submitting()) return;
    this.error.set(null);
    this.submitting.set(true);
    const fullName = `${this.profile.value.firstName} ${this.profile.value.lastName}`.trim();
    const { city, state } = this.parseLocation(this.profile.value.location ?? '');
    this.auth
      .signup({
        name: fullName,
        email: this.account.value.email!,
        password: this.account.value.password!,
        intent: this.intent(),
        city,
        state,
      })
      .subscribe({
        next: () => {
          if (this.intent() === 'renter') {
            this.router.navigateByUrl('/search');
          } else {
            this.router.navigateByUrl('/dashboard/setup-onboarding');
          }
        },
        error: (err: { error?: { message?: string } }) => {
          this.error.set(err.error?.message ?? 'Could not create account.');
          this.submitting.set(false);
        },
      });
  }

  /** "Bozeman, MT" → { city: "Bozeman", state: "MT" }. Tolerates extra whitespace. */
  private parseLocation(value: string): { city?: string; state?: string } {
    const trimmed = value.trim();
    if (!trimmed) return {};
    const lastComma = trimmed.lastIndexOf(',');
    if (lastComma === -1) return { city: trimmed };
    return {
      city: trimmed.slice(0, lastComma).trim() || undefined,
      state: trimmed.slice(lastComma + 1).trim().toUpperCase() || undefined,
    };
  }
}
