import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Alert, Button, FormField, Input } from '../../../../shared';

@Component({
  selector: 'app-auth-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, Alert, Button, FormField, Input],
  template: `
    <div class="mx-auto max-w-md px-(--kitlo-page-gutter) py-16">
      <div class="border border-line bg-bone p-8">
        <h1 class="font-condensed text-h1 font-black uppercase text-slate leading-none mb-2">
          Reset your password
        </h1>
        <p class="text-body text-muted mb-7">
          Enter the email on your account and we'll send a reset link.
        </p>

        @if (sent()) {
          <app-alert tone="success">
            If an account exists for {{ form.value.email }}, a reset email is on its way.
          </app-alert>
        } @else {
          <form [formGroup]="form" (ngSubmit)="submit()">
            <app-form-field label="Email" required>
              <input appInput type="email" formControlName="email" placeholder="you@example.com" />
            </app-form-field>
            <button
              appButton
              variant="primary"
              type="submit"
              class="w-full"
              [disabled]="form.invalid || submitting()"
            >
              {{ submitting() ? 'Sending…' : 'Send reset link' }}
            </button>
          </form>
        }

        <p class="text-center text-xs text-muted mt-6">
          <a routerLink="/auth/login" class="text-olive underline">Back to sign in</a>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthForgotPassword {
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly sent = signal(false);
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected submit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    setTimeout(() => {
      this.submitting.set(false);
      this.sent.set(true);
    }, 250);
  }
}
