import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Alert, Button, FormField, Input } from '../../../../shared';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-auth-login',
  imports: [ReactiveFormsModule, RouterLink, Alert, Button, FormField, Input],
  template: `
    <div class="mx-auto max-w-md px-(--kitlo-page-gutter) py-16">
      <div class="border border-line bg-bone p-8">
        <h1 class="font-condensed text-h1 font-black uppercase text-slate leading-none mb-2">
          Sign in
        </h1>
        <p class="text-body text-muted mb-7">Welcome back. Pick up where you left off.</p>

        <button appButton variant="secondary" type="button" class="w-full mb-3">
          Continue with Google
        </button>
        <button appButton variant="secondary" type="button" class="w-full mb-5">
          Continue with Apple
        </button>

        <div class="relative my-5 text-center text-xs text-muted">
          <span class="bg-bone px-3 relative z-[1]">or</span>
          <div class="absolute inset-x-0 top-1/2 border-t border-line"></div>
        </div>

        @if (error(); as msg) {
          <app-alert tone="danger" class="block mb-4">{{ msg }}</app-alert>
        }

        <form [formGroup]="form" (ngSubmit)="submit()">
          <app-form-field label="Email" required [control]="form.controls.email">
            <input
              appInput
              type="email"
              formControlName="email"
              placeholder="you@example.com"
              [invalid]="showError(form.controls.email)"
            />
          </app-form-field>
          <app-form-field label="Password" required [control]="form.controls.password">
            <input
              appInput
              type="password"
              formControlName="password"
              placeholder="••••••••••"
              [invalid]="showError(form.controls.password)"
            />
          </app-form-field>
          <div class="text-right -mt-2 mb-3">
            <a routerLink="/auth/forgot-password" class="text-xs text-olive underline">
              Forgot password?
            </a>
          </div>
          <button
            appButton
            variant="primary"
            type="submit"
            class="w-full"
            [disabled]="submitting()"
          >
            {{ submitting() ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>

        <p class="text-center text-xs text-muted mt-6">
          Don't have an account?
          <a routerLink="/auth/signup" class="text-olive underline">Create one</a>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLogin {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected submit(): void {
    if (this.submitting()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.submitting.set(true);
    try {
      this.auth.login(this.form.value.email!, this.form.value.password!);
      this.router.navigateByUrl('/dashboard');
    } catch {
      this.error.set('Email or password is incorrect.');
      this.submitting.set(false);
    }
  }

  protected showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }
}
