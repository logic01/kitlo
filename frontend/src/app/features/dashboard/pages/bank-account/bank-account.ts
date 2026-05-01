import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert, Button, PageHeader } from '../../../../shared';

@Component({
  selector: 'app-dashboard-bank-account',
  imports: [Alert, Button, PageHeader],
  template: `
    <div class="px-8 py-8 max-w-2xl">
      <app-page-header title="Bank account" subtitle="Connected through Stripe Connect." />

      <div class="border border-line bg-bone p-6 mt-6 mb-5">
        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-2">Payout account</p>
        <p class="font-condensed text-h3 font-extrabold uppercase text-slate mb-1">
          Chase ending in 4421
        </p>
        <p class="text-xs text-muted">Verified · Default for all listings</p>
        <div class="mt-4 flex gap-2">
          <button appButton variant="ghost" type="button">Update via Stripe</button>
          <button appButton variant="ghost" type="button" class="text-battle">Disconnect</button>
        </div>
      </div>

      <app-alert tone="info" class="block">
        Kitlo never sees your bank details. Stripe handles the secure connection. Bank-level encryption end-to-end.
      </app-alert>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBankAccount {}
