import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, StepCard, StatCard } from '../../../../shared';

@Component({
  selector: 'app-public-list-your-gear',
  imports: [RouterLink, Button, StepCard, StatCard],
  template: `
    <section class="border-b-2 border-slate">
      <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-20 text-center">
        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">For listers</p>
        <h1 class="font-condensed text-hero font-black uppercase text-slate leading-none">
          Earn from the gear<br /><span class="text-olive">already in your safe.</span>
        </h1>
        <p class="text-body-lg text-muted mt-6 max-w-2xl mx-auto">
          Most hunting gear is used 3–5 weeks a year. List on Kitlo, set your daily rate, and let your thermal, night vision, or
          spotting optics work for you the other 47.
        </p>
        <div class="mt-8">
          <a appButton variant="primary" routerLink="/auth/signup">Start listing</a>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <app-stat-card overline="Avg lister earns" value="$2,840" sublabel="per season" tone="primary" />
        <app-stat-card overline="You keep" value="95%" sublabel="of every booking" />
        <app-stat-card overline="Avg payout time" value="3 days" sublabel="after return confirmation" />
      </div>

      <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">How it works</p>
      <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-8">List in three steps.</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <app-step-card stepNumber="01" title="Verify ID + bank" body="ID + selfie + Stripe Connect setup. Required once. About 4 minutes." />
        <app-step-card stepNumber="02" title="Photograph and price" body="Specs, condition, pickup ZIP, daily rate. Market data shown for similar gear." />
        <app-step-card stepNumber="03" title="Approve & meet" body="Review requests, confirm at pickup, get paid after return. We handle the money." />
      </div>
      <div class="text-center">
        <a appButton variant="primary" routerLink="/auth/signup">Create your lister account</a>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicListYourGear {}
