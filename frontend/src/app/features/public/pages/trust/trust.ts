import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, StepCard, TrustCard } from '../../../../shared';

@Component({
  selector: 'app-public-trust',
  imports: [RouterLink, Button, StepCard, TrustCard],
  template: `
    <section class="border-b-2 border-slate">
      <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-16 text-center">
        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Trust &amp; safety</p>
        <h1 class="font-condensed text-hero font-black uppercase text-slate leading-none">
          Trust isn't a tagline.<br /><span class="text-olive">It's the product.</span>
        </h1>
        <p class="text-body-lg text-muted mt-6 max-w-2xl mx-auto">
          Overlanding kit is expensive, the community is tight, and reputation travels. Kitlo is built so the
          right things happen by default — verified identities, escrowed payments, documented condition, and
          a dispute process that doesn't disappear when something goes wrong.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-16">
      <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">The four pillars</p>
      <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-8">What every booking guarantees.</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-step-card
          stepNumber="01"
          title="Verified listers"
          body="Listers complete government ID and selfie verification before publishing any gear. The Verified badge means a real person passed identity checks — not just an email confirmation."
        />
        <app-step-card
          stepNumber="02"
          title="Escrow payments"
          body="Renters pay Kitlo, not the lister directly. Funds — including the refundable damage deposit — are held in escrow and only release after both parties confirm the return."
        />
        <app-step-card
          stepNumber="03"
          title="Condition on record"
          body="Every listing carries a Mint / Field-Ready / Battle-Scarred rating. Pickup and return are photo-documented so condition disputes have evidence, not opinions."
        />
        <app-step-card
          stepNumber="04"
          title="Two-way reviews"
          body="Renters review gear and listers. Listers review renters. Reviews are blind for 14 days so neither side can retaliate, then surface together on the public profile."
        />
      </div>
    </section>

    <section class="bg-slate text-on-dark py-16">
      <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter)">
        <p class="font-mono text-overline text-amber tracking-[0.10em] uppercase mb-3">If something goes wrong</p>
        <h2 class="font-condensed text-h2 font-extrabold uppercase mb-10">Dispute resolution, on the record.</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <app-trust-card
            label="01"
            title="File with evidence"
            body="Either party can open a dispute from the booking detail page. Photos, messages, and the booking timeline are pulled in automatically."
          />
          <app-trust-card
            label="02"
            title="Admin mediation"
            body="A Kitlo admin reviews within 72 hours. Both sides see the same evidence pack. Off-platform threats or intimidation void the dispute outright."
          />
          <app-trust-card
            label="03"
            title="Outcome enforced"
            body="Refunds, partial releases, or split resolutions are applied directly to the booking — no chasing the other party for money."
          />
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-16">
      <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Damage coverage</p>
      <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-8">Deposits sized to the gear.</h2>
      <div class="border border-line bg-bone overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-surface">
            <tr class="text-left">
              <th class="px-5 py-3 font-mono uppercase tracking-[0.08em] text-overline text-muted">Gear value</th>
              <th class="px-5 py-3 font-mono uppercase tracking-[0.08em] text-overline text-muted">Refundable deposit</th>
              <th class="px-5 py-3 font-mono uppercase tracking-[0.08em] text-overline text-muted">Renter Protection Plan</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-line">
              <td class="px-5 py-4 text-slate">Under $1,000 MSRP</td>
              <td class="px-5 py-4 font-mono text-slate">25% of MSRP</td>
              <td class="px-5 py-4 text-muted">Optional — $5–15/day</td>
            </tr>
            <tr class="border-t border-line">
              <td class="px-5 py-4 text-slate">$1,000–$5,000 MSRP</td>
              <td class="px-5 py-4 font-mono text-slate">20% of MSRP</td>
              <td class="px-5 py-4 text-muted">Required — $15–25/day</td>
            </tr>
            <tr class="border-t border-line">
              <td class="px-5 py-4 text-slate">Over $5,000 MSRP</td>
              <td class="px-5 py-4 font-mono text-slate">15% of MSRP (card hold)</td>
              <td class="px-5 py-4 text-muted">Required — $25+/day</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-muted mt-3">
        Listings with MSRP at or above $5,000 go through admin review before going live.
      </p>
    </section>

    <section class="bg-surface py-16">
      <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter)">
        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Listing policy</p>
        <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-6">Weapons are not listable on Kitlo.</h2>
        <p class="text-body text-muted leading-relaxed mb-6 max-w-3xl">
          Kitlo does not facilitate the loan or rental of weapons. The platform is for overlanding kit,
          optics, power, fly fishing gear, and other non-weapon equipment.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="border border-line bg-bone p-5">
            <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-2">Prohibited</p>
            <ul class="space-y-2 text-sm text-slate leading-relaxed list-disc list-inside marker:text-muted">
              <li>Firearms — rifles, shotguns, handguns, air rifles</li>
              <li>Ammunition, primers, powder, and firearm components</li>
              <li>Hunting bows — compound, recurve, longbow</li>
              <li>Crossbows, arrows, bolts, and broadheads</li>
              <li>NFA items (suppressors, SBRs) and ITAR-restricted gear</li>
            </ul>
          </div>
          <div class="border border-line bg-bone p-5">
            <p class="font-mono text-overline text-amber tracking-[0.10em] uppercase mb-2">Allowed</p>
            <ul class="space-y-2 text-sm text-slate leading-relaxed list-disc list-inside marker:text-muted">
              <li>Rooftop tents, awnings, 12V fridges, recovery boards, dual-battery systems</li>
              <li>Thermal and night-vision optics — including weapon-mounted</li>
              <li>Rifle scopes and clip-on thermals (the renter brings their own rifle)</li>
              <li>Spotting scopes, binoculars, rangefinders that are part of an optic</li>
              <li>Power stations and solar arrays for camp use</li>
              <li>Waders, wading boots, fly rods and reels, fly packs</li>
            </ul>
          </div>
        </div>
        <p class="text-xs text-muted mt-6">
          Listings flagged as weapons are removed during admin review. Repeated attempts result in account suspension.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-16">
      <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Reporting &amp; support</p>
      <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-6">See something off? Tell us.</h2>
      <p class="text-body text-muted leading-relaxed max-w-3xl mb-8">
        Every listing has a "Report this listing" link. Use it for stolen-photo listings, off-platform payment requests,
        prohibited gear, or anything that looks wrong. Reports are anonymous to the lister and reviewed by admin within
        four hours.
      </p>
      <div class="flex flex-wrap gap-3">
        <a appButton variant="primary" routerLink="/search">Browse gear</a>
        <a appButton variant="secondary" routerLink="/how-it-works">How it works</a>
        <a appButton variant="ghost" routerLink="/contact">Contact support</a>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicTrust {}
