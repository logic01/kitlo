import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-public-about',
  template: `
    <div class="mx-auto max-w-3xl px-(--kitlo-page-gutter) py-16">
      <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Our story</p>
      <h1 class="font-condensed text-h1 font-black uppercase text-slate mb-6 leading-none">
        Built by hunters, for hunters.
      </h1>
      <p class="text-body-lg text-muted leading-relaxed mb-6">
        Kitlo started in a Bozeman garage in 2025. The founders wanted to use a $4,000 thermal scope without buying one,
        and rented one from a friend instead. That trade — access without ownership — felt obviously right for hunting gear,
        which sits idle 11 months out of the year.
      </p>
      <p class="text-body text-muted leading-relaxed mb-6">
        We're building the trust infrastructure peer-to-peer rental needs to work for high-value gear: identity verification,
        condition rating, escrow payments, and a dispute process designed for the realities of field use.
      </p>
      <p class="text-body text-muted leading-relaxed">
        We are not VC-backed. We are not in 50 states. We are slowly expanding from the Mountain West to anywhere the gear
        community asks us to be.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicAbout {}
