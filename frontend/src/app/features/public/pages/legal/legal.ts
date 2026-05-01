import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

interface Section {
  id: string;
  heading: string;
  body: string[];
}

interface LegalDoc {
  slug: 'terms' | 'privacy' | 'lister-agreement';
  title: string;
  lede: string;
  effective: string;
  toc: { label: string; anchor: string }[];
  sections: Section[];
}

const DOCS: Record<string, LegalDoc> = {
  terms: {
    slug: 'terms',
    title: 'Terms of Service',
    effective: 'Effective May 1, 2026',
    lede: 'These Terms govern your use of Kitlo and the rental relationships formed through the platform.',
    toc: [
      { label: '1. Account & eligibility', anchor: 'eligibility' },
      { label: '2. Renter obligations', anchor: 'renter' },
      { label: '3. Lister obligations', anchor: 'lister' },
      { label: '4. Payments & escrow', anchor: 'payments' },
      { label: '5. Cancellations & refunds', anchor: 'cancellation' },
      { label: '6. Disputes', anchor: 'disputes' },
      { label: '7. Liability', anchor: 'liability' },
      { label: '8. Termination', anchor: 'termination' },
    ],
    sections: [
      {
        id: 'eligibility',
        heading: '1. Account & eligibility',
        body: [
          'You must be 18+ and legally able to enter into rental contracts in your state to use Kitlo.',
          'Listers must complete identity verification before any listing is published.',
        ],
      },
      {
        id: 'renter',
        heading: '2. Renter obligations',
        body: [
          'You are responsible for the gear during the rental window. Return condition must match pickup condition, normal use accounted for.',
          'Damage caused by negligence or misuse may be charged against the deposit and escalated to dispute if contested.',
        ],
      },
      {
        id: 'lister',
        heading: '3. Lister obligations',
        body: [
          'Listings must accurately describe condition, specs, and any operational quirks.',
          'You must be available to confirm pickup and return, or designate a verified delegate.',
        ],
      },
      {
        id: 'payments',
        heading: '4. Payments & escrow',
        body: [
          'Payments are processed by Stripe. Funds are held in escrow until both parties confirm return.',
          'Kitlo retains a platform fee disclosed on each booking. Net payout is sent to the lister bank account on file.',
        ],
      },
      {
        id: 'cancellation',
        heading: '5. Cancellations & refunds',
        body: [
          'Refunds are tiered by cancellation policy (flexible / moderate / strict) chosen by the lister.',
          'Mutual cancellation is always available and refunds 100%.',
        ],
      },
      {
        id: 'disputes',
        heading: '6. Disputes',
        body: [
          'Either party may file a dispute with photo evidence. Admin mediates within 72 hours.',
          'Decisions account for evidence, history, and platform policy. Outcomes are recorded on both profiles.',
        ],
      },
      { id: 'liability', heading: '7. Liability', body: ['Kitlo is not the insurer of record. See your state-specific addendum for details.'] },
      { id: 'termination', heading: '8. Termination', body: ['Either party may terminate the account. Outstanding bookings honor existing terms.'] },
    ],
  },
  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    effective: 'Effective May 1, 2026',
    lede: 'How Kitlo collects, uses, and protects your data.',
    toc: [
      { label: '1. What we collect', anchor: 'collect' },
      { label: '2. How we use it', anchor: 'use' },
      { label: '3. Sharing', anchor: 'sharing' },
      { label: '4. Your controls', anchor: 'controls' },
    ],
    sections: [
      {
        id: 'collect',
        heading: '1. What we collect',
        body: [
          'Account information (name, email, ZIP), identity verification artifacts processed by Stripe Identity, listing photos hosted on Cloudinary, transactional records, and platform-side messaging.',
        ],
      },
      {
        id: 'use',
        heading: '2. How we use it',
        body: [
          'To match renters and listers, prevent fraud, mediate disputes, and improve the service. We do not sell personal data.',
        ],
      },
      {
        id: 'sharing',
        heading: '3. Sharing',
        body: ['Limited to processors required to operate the service: Stripe (payments + identity), Cloudinary (images), and our infrastructure providers.'],
      },
      {
        id: 'controls',
        heading: '4. Your controls',
        body: ['Access, export, or delete your data at any time from Profile & settings. Verification artifacts are retained for compliance.'],
      },
    ],
  },
  'lister-agreement': {
    slug: 'lister-agreement',
    title: 'Lister Agreement',
    effective: 'Effective May 1, 2026',
    lede: 'The contract between Kitlo and any user listing equipment for rent.',
    toc: [
      { label: '1. Listing standards', anchor: 'standards' },
      { label: '2. Pickup & return', anchor: 'pickup' },
      { label: '3. Damage & deposits', anchor: 'damage' },
      { label: '4. Tax responsibilities', anchor: 'tax' },
    ],
    sections: [
      {
        id: 'standards',
        heading: '1. Listing standards',
        body: ['Photos must be your own, current, and represent the actual gear. Specs must be accurate. Condition must reflect honest wear.'],
      },
      {
        id: 'pickup',
        heading: '2. Pickup & return',
        body: ['You must be reachable and available within agreed windows. Both pickup and return require condition confirmation.'],
      },
      {
        id: 'damage',
        heading: '3. Damage & deposits',
        body: ['Damage claims must be filed within 24 hours of return with photo evidence. Deposit funds are held until claim is resolved.'],
      },
      {
        id: 'tax',
        heading: '4. Tax responsibilities',
        body: ['Listers are responsible for reporting earnings as required by their jurisdiction. Kitlo provides annual 1099 reporting per IRS requirements.'],
      },
    ],
  },
};

@Component({
  selector: 'app-public-legal',
  imports: [RouterLink],
  template: `
    @if (doc(); as d) {
      <article class="mx-auto max-w-3xl px-(--kitlo-page-gutter) py-14">
        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">{{ d.effective }}</p>
        <h1 class="font-condensed text-h1 font-black uppercase text-slate leading-none mb-5">
          {{ d.title }}
        </h1>
        <p class="border-l-3 border-olive pl-5 text-body-lg text-muted leading-relaxed mb-9">
          {{ d.lede }}
        </p>

        <div class="border border-line bg-surface p-6 mb-10">
          <p class="font-condensed text-overline font-extrabold uppercase tracking-[0.06em] mb-3">
            On this page
          </p>
          <ol class="font-mono text-xs text-muted space-y-1.5 list-decimal pl-5 columns-2 gap-6">
            @for (item of d.toc; track item.anchor) {
              <li>
                <a class="text-olive no-underline hover:underline" [href]="'#' + item.anchor">
                  {{ item.label }}
                </a>
              </li>
            }
          </ol>
        </div>

        @for (section of d.sections; track section.id) {
          <section [id]="section.id" class="mb-7">
            <h2 class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] text-slate mb-3">
              {{ section.heading }}
            </h2>
            @for (p of section.body; track $index) {
              <p class="text-body leading-relaxed mb-3">{{ p }}</p>
            }
          </section>
        }

        <p class="text-xs text-muted border-t border-line pt-5 mt-10">
          Questions? <a routerLink="/contact" class="underline">Contact us</a>.
        </p>
      </article>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLegal {
  private readonly route = inject(ActivatedRoute);
  private readonly slug = toSignal(
    this.route.data.pipe(map((d) => d['slug'] as 'terms' | 'privacy' | 'lister-agreement')),
    { initialValue: 'terms' as const },
  );
  protected readonly doc = computed(() => DOCS[this.slug()]);
}
