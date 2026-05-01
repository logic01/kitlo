import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../../../shared';

@Component({
  selector: 'app-auth-verify-email',
  imports: [RouterLink, Button],
  template: `
    <div class="mx-auto max-w-md px-(--kitlo-page-gutter) py-16 text-center">
      <div class="border border-line bg-bone p-10">
        <div class="font-condensed text-display text-olive font-black mb-3">✓</div>
        <h1 class="font-condensed text-h1 font-black uppercase text-slate leading-none mb-3">
          Check your email
        </h1>
        <p class="text-body text-muted mb-6 leading-relaxed">
          We sent a verification link. Click it to confirm your email — then come back here to sign in.
        </p>
        <a appButton variant="primary" routerLink="/auth/login">Back to sign in</a>
        <p class="text-xs text-muted mt-5">
          Didn't get it? <a routerLink="/auth/verify-email" class="text-olive underline">Resend link</a>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthVerifyEmail {}
