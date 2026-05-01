import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { inject } from '@angular/core';
import { Alert, Button, FormField, Input, ProgressBar, Stepper, type StepDef } from '../../../../shared';
import { UsersService } from '../../../../core/services/users.service';

const STEPS: StepDef[] = [
  { label: 'Intro' },
  { label: 'Verify ID' },
  { label: 'Payout' },
  { label: 'Agreement' },
];

@Component({
  selector: 'app-dashboard-setup-onboarding',
  imports: [ReactiveFormsModule, RouterLink, Alert, Button, FormField, Input, ProgressBar, Stepper],
  template: `
    <div class="mx-auto max-w-2xl px-(--kitlo-page-gutter) py-12">
      <div class="border border-line bg-bone p-8">
        <app-stepper [steps]="steps" [currentIndex]="step()" />
        <div class="h-8"></div>

        @switch (step()) {
          @case (0) {
            <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-2">Lister setup</p>
            <h1 class="font-condensed text-h1 font-black uppercase text-slate mb-3 leading-none">
              Three things before you list
            </h1>
            <p class="text-body text-muted leading-relaxed mb-7">
              Renters trust verified hunters. We verify three things before your gear goes live. The whole process takes about 5–10 minutes.
            </p>

            <ol class="space-y-4 mb-7">
              <li class="flex gap-4 p-5 border border-line bg-surface">
                <div class="font-condensed text-h2 font-black text-olive">1</div>
                <div>
                  <h3 class="font-semibold text-slate mb-1">Verify your identity</h3>
                  <p class="text-sm text-muted">Government-issued ID + a quick selfie via Stripe Identity. Done once, never again.</p>
                </div>
              </li>
              <li class="flex gap-4 p-5 border border-line bg-surface">
                <div class="font-condensed text-h2 font-black text-olive">2</div>
                <div>
                  <h3 class="font-semibold text-slate mb-1">Connect a payout account</h3>
                  <p class="text-sm text-muted">A US bank account or debit card via Stripe Connect. Earnings deposit automatically after each rental.</p>
                </div>
              </li>
              <li class="flex gap-4 p-5 border border-line bg-surface">
                <div class="font-condensed text-h2 font-black text-olive">3</div>
                <div>
                  <h3 class="font-semibold text-slate mb-1">Agree to lister terms</h3>
                  <p class="text-sm text-muted">Plain-English agreement covering deposits, damage, disputes, and Kitlo's take rate.</p>
                </div>
              </li>
            </ol>

            <div class="flex gap-2">
              <button appButton variant="ghost" routerLink="/dashboard">I'll do this later</button>
              <button appButton variant="primary" class="flex-1" (click)="next()">Let's get started</button>
            </div>
          }

          @case (1) {
            <h1 class="font-condensed text-h1 font-black uppercase text-slate mb-3 leading-none">
              Verify your identity
            </h1>
            <p class="text-body text-muted leading-relaxed mb-6">
              Stripe Identity will ask for a photo of your driver's license or passport, and a quick selfie. It usually takes 2–3 minutes.
            </p>

            <div class="border border-dashed border-line bg-surface p-10 text-center">
              <div class="font-mono text-xs text-muted mb-2">STRIPE</div>
              <p class="font-condensed text-h3 font-extrabold uppercase text-slate mb-1">
                Stripe Identity verification
              </p>
              <p class="text-xs text-muted mb-5">Powered by Stripe. Your ID stays with Stripe — Kitlo only sees pass / fail.</p>
              <div class="max-w-xs mx-auto">
                <app-progress-bar [value]="35" />
              </div>
              <p class="font-mono text-xs text-muted mt-3">Step 1 of 3 · Take photo of ID front</p>
            </div>

            <app-alert tone="info" class="mt-5 block">
              Verifying every lister is how Kitlo keeps gear safe. Renters can see your verified status before they book.
            </app-alert>

            <div class="flex gap-2 mt-7">
              <button appButton variant="ghost" (click)="back()">Back</button>
              <button appButton variant="primary" class="flex-1" (click)="next()">Continue</button>
            </div>
          }

          @case (2) {
            <h1 class="font-condensed text-h1 font-black uppercase text-slate mb-3 leading-none">
              Where should we send your earnings?
            </h1>
            <p class="text-body text-muted leading-relaxed mb-5">
              Earnings deposit to your bank account 24 hours after each rental ends. You'll connect through Stripe Connect.
            </p>

            <form [formGroup]="payout" class="border border-line bg-surface p-5 space-y-3">
              <app-form-field label="Account type">
                <select appInput formControlName="accountType">
                  <option value="individual">Individual</option>
                  <option value="business">Business</option>
                </select>
              </app-form-field>
              <app-form-field label="Country">
                <select appInput formControlName="country">
                  <option value="US">United States</option>
                </select>
              </app-form-field>
              <button appButton variant="secondary" type="button" class="w-full">
                Continue to Stripe →
              </button>
            </form>

            <p class="text-xs text-muted mt-4 leading-relaxed">
              <strong class="text-slate">Kitlo never sees your bank details.</strong>
              Stripe handles the secure connection. Bank-level encryption end-to-end.
            </p>

            <div class="flex gap-2 mt-7">
              <button appButton variant="ghost" (click)="back()">Back</button>
              <button appButton variant="primary" class="flex-1" (click)="next()">Continue</button>
            </div>
          }

          @case (3) {
            <h1 class="font-condensed text-h1 font-black uppercase text-slate mb-3 leading-none">
              Lister agreement
            </h1>
            <p class="text-body text-muted leading-relaxed mb-5">
              A plain-English read. The full legal version is linked at the bottom.
            </p>

            <div class="border border-line p-5 bg-surface">
              <div class="font-mono text-overline text-muted uppercase tracking-[0.10em] mb-2">Kitlo take rate</div>
              <div class="font-condensed text-h2 font-black text-slate">12% of every rental</div>
              <p class="text-sm text-muted mt-2">Deducted from each rental before payout.</p>
            </div>

            <ul class="text-sm text-muted leading-relaxed list-disc pl-5 mt-5 space-y-2">
              <li>You commit to honest listings — accurate condition, accurate specs, your own photos.</li>
              <li>You'll be available to confirm pickup and return within agreed windows.</li>
              <li>Damage claims must be filed within 24 hours of return with photo evidence.</li>
              <li>You're responsible for any tax reporting required by your jurisdiction.</li>
            </ul>

            <p class="text-xs text-muted mt-5">
              Read the
              <a routerLink="/lister-agreement" class="text-olive underline">full lister agreement</a>.
            </p>

            <div class="flex gap-2 mt-7">
              <button appButton variant="ghost" (click)="back()">Back</button>
              <button
                appButton
                variant="primary"
                class="flex-1"
                [disabled]="submitting()"
                (click)="finish()"
              >
                {{ submitting() ? 'Saving…' : 'I agree — start listing' }}
              </button>
            </div>
          }
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSetupOnboarding {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly users = inject(UsersService);

  protected readonly steps = STEPS;
  protected readonly step = signal(0);
  protected readonly submitting = signal(false);

  protected readonly payout = this.fb.group({
    accountType: 'individual',
    country: 'US',
  });

  protected next(): void {
    this.step.update((n) => Math.min(n + 1, STEPS.length - 1));
  }

  protected back(): void {
    this.step.update((n) => Math.max(0, n - 1));
  }

  protected finish(): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.users.recordListerAgreement().subscribe({
      next: () => this.router.navigateByUrl('/dashboard/listings/new'),
      error: () => this.submitting.set(false),
    });
  }
}
