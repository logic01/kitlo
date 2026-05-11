import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-public-about',
  template: `
    <div class="mx-auto max-w-3xl px-(--kitlo-page-gutter) py-16">
      <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Our story</p>
      <h1 class="font-condensed text-h1 font-black uppercase text-slate mb-6 leading-none">
        Built by overlanders, for overlanders.
      </h1>
      <p class="text-body-lg text-muted leading-relaxed mb-6">
        Kitlo started in a Bozeman garage in 2025. The founders wanted to use a rooftop tent and a 12V fridge for one
        long weekend without buying either, and borrowed both from friends instead. That trade — access without ownership —
        felt obviously right for overlanding kit, where most rigs sit parked 47 weeks a year.
      </p>
      <p class="text-body text-muted leading-relaxed mb-6">
        Camping and overlanding gear is the anchor. The same renters take optics on hunts, waders to the river,
        and a power station to the desert — so Kitlo carries those too. We're building the trust infrastructure
        peer-to-peer rental needs to work for high-value gear: identity verification, condition rating, escrow
        payments, and a dispute process designed for the realities of field use.
      </p>
      <p class="text-body text-muted leading-relaxed">
        We are not VC-backed. We are not in 50 states. We are slowly expanding from the Mountain West to anywhere the
        overlanding community asks us to be.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicAbout {}
