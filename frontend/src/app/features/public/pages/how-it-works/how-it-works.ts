import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  StepCard,
  ConditionGrid,
  TrustCard,
  Button,
} from '../../../../shared';

@Component({
  selector: 'app-public-how-it-works',
  imports: [RouterLink, StepCard, ConditionGrid, TrustCard, Button],
  template: `
    <section class="border-b-2 border-slate">
      <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-16 text-center">
        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">How Kitlo works</p>
        <h1 class="font-condensed text-hero font-black uppercase text-slate leading-none">
          Rent like a hunter,<br /><span class="text-olive">not a tourist.</span>
        </h1>
        <p class="text-body-lg text-muted mt-6 max-w-2xl mx-auto">
          A peer-to-peer marketplace built around the trust signals hunters actually rely on:
          condition, communication, and follow-through.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-16">
      <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">For renters</p>
      <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-8">Find. Book. Hunt.</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <app-step-card stepNumber="01" title="Search by location & gear" body="Filter by category, condition, dates, and proximity. See exactly what each lister has." />
        <app-step-card stepNumber="02" title="Request and pay" body="Stripe holds the funds. Lister approves the request. Pickup details unlock." />
        <app-step-card stepNumber="03" title="Inspect at handoff" body="Both parties sign off on condition with photos. Gear is yours for the rental window." />
      </div>
      <div class="text-center">
        <a appButton variant="primary" routerLink="/search">Browse gear</a>
      </div>
    </section>

    <section class="bg-surface py-16">
      <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter)">
        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">For listers</p>
        <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-8">Earn from gear that's sitting idle.</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <app-step-card stepNumber="01" title="Verify your identity" body="ID + selfie + agreement. Required once, takes about 4 minutes." />
          <app-step-card stepNumber="02" title="Photograph and price" body="Specs, condition, pickup ZIP, and a daily rate. Market data shown." />
          <app-step-card stepNumber="03" title="Get paid after return" body="Both parties confirm. Stripe Connect deposits net earnings to your bank." />
        </div>
        <div class="text-center">
          <a appButton variant="primary" routerLink="/list-your-gear">List your gear</a>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-16">
      <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">The condition system</p>
      <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-8">Honest about wear.</h2>
      <app-condition-grid />
    </section>

    <section class="bg-slate text-on-dark py-16">
      <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter)">
        <h2 class="font-condensed text-h2 font-extrabold uppercase mb-10">If something goes wrong.</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <app-trust-card label="01" title="Damage deposit held"
            body="Refundable deposit is escrowed at booking and released after a clean return." />
          <app-trust-card label="02" title="Dispute mediation"
            body="Either party can file a dispute with photo evidence. Admin resolves within 72 hours." />
          <app-trust-card label="03" title="Two-way reviews"
            body="Both sides rate the rental. Reputation lives on the profile and informs future bookings." />
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHowItWorks {}
