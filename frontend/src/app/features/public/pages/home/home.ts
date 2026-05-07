import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  Hero,
  ListingCard,
  ListingCardSkeleton,
  OliveBand,
  ConditionGrid,
  StepCard,
  DarkBand,
  Button,
  ProfileCard,
  type OliveBandPillar,
  type TrustCardData,
} from '../../../../shared';
import { ListingsService } from '../../../../core/services';
import { loadable } from '../../../../core/loading/loadable';
import type { ListingSummary } from '../../../../core/models/listing';
import type { ProfileSummary } from '../../../../core/models/user';

@Component({
  selector: 'app-public-home',
  imports: [
    RouterLink,
    Hero,
    ListingCard,
    ListingCardSkeleton,
    OliveBand,
    ConditionGrid,
    StepCard,
    DarkBand,
    Button,
    ProfileCard,
  ],
  template: `
    <app-hero
      kicker="Thermal · NV · optics · stands · packs"
      headline="Your gear should"
      accent="earn its keep."
      sub="Verified renters. Big payouts. List kit. Get paid."
    >
      <div slot="right" class="flex flex-col gap-3">
        @for (profile of featuredProfiles(); track profile.id) {
          <app-profile-card [profile]="profile" />
        }
      </div>
    </app-hero>

    <app-olive-band
      label="Why Kitlo"
      headline="Trust built into every rental"
      sub="Three things make peer-to-peer rental work for hunters."
      [pillars]="pillars"
    />

    <section class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-16">
      <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">The condition system</p>
      <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-8">Know exactly what you're getting</h2>
      <app-condition-grid />
    </section>

    <section class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) pb-16">
      <div class="flex justify-between items-end mb-6">
        <div>
          <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-2">Featured gear near you</p>
          <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate">Popular listings</h2>
        </div>
        <a appButton variant="secondary" routerLink="/search">Browse all gear</a>
      </div>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        [attr.aria-busy]="featuredLoading()"
      >
        @if (featuredLoading()) {
          @for (_ of skeletonSlots; track $index) {
            <app-listing-card-skeleton />
          }
        } @else {
          @for (listing of featuredListings(); track listing.id) {
            <app-listing-card [listing]="listing" />
          }
        }
      </div>
    </section>

    <section class="bg-surface py-16">
      <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter)">
        <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-2">How it works</p>
        <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-8">Rent in three steps</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <app-step-card stepNumber="01" title="Find the gear" body="Search by location, gear type, and dates. Filter by condition, price, and verified listers." />
          <app-step-card stepNumber="02" title="Book and pay securely" body="Funds held in escrow. Confirm at pickup. Payment released to lister only after return." />
          <app-step-card stepNumber="03" title="Pick up, hunt, return" body="Meet at the agreed location. Both parties confirm condition at handoff and return." />
        </div>
      </div>
    </section>

    <section class="bg-olive">
      <div
        class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8"
      >
        <div>
          <p class="font-mono text-overline text-on-dark/70 tracking-[0.10em] uppercase mb-3">Got gear?</p>
          <h2 class="font-condensed text-h1 font-black uppercase text-on-dark leading-none">
            List kit. <span class="text-amber">Get paid.</span>
          </h2>
          <p class="text-body-lg text-on-dark/85 mt-5 max-w-xl">
            Most hunting kit sits unused 47 weeks a year. Put yours to work — we handle payments, verification, and disputes.
          </p>
        </div>
        <div class="shrink-0">
          <a appButton variant="primary" routerLink="/list">Start listing</a>
        </div>
      </div>
    </section>

    <app-dark-band
      heading="Big payouts."
      accent="Verified renters."
      sub="Your gear earns while it waits. Kitlo handles the money, the IDs, and the paperwork."
      [cards]="trustCards"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHome {
  private readonly listings = inject(ListingsService);

  private readonly featured = loadable(
    this.listings.search({ pageSize: 6 }).pipe(map((r) => r.items)),
  );
  protected readonly featuredLoading = this.featured.loading;
  protected readonly featuredListings = computed(() => this.featured.data() ?? []);
  protected readonly skeletonSlots = Array(6).fill(0);

  // Featured profile cards in the hero are derived from the top-rated listings:
  // dedupe by lister, take three. This keeps the home page driven entirely by live API
  // data without a dedicated "featured listers" endpoint.
  private readonly profilesQuery = loadable(
    this.listings.search({ sort: 'rating', pageSize: 12 }).pipe(map((r) => r.items)),
  );
  protected readonly featuredProfiles = computed<ProfileSummary[]>(() => {
    const items = this.profilesQuery.data() ?? [];
    const seen = new Set<string>();
    const profiles: ProfileSummary[] = [];
    for (const l of items) {
      if (seen.has(l.listerId)) continue;
      seen.add(l.listerId);
      profiles.push(toProfile(l));
      if (profiles.length === 3) break;
    }
    return profiles;
  });

  protected readonly pillars: OliveBandPillar[] = [
    { title: 'Verified hunters only', body: 'Government ID + selfie verify before listing' },
    { title: 'Funds held in escrow', body: 'Payment released only after confirmed return' },
    { title: 'Gear inspected at handoff', body: 'Photo-documented condition at pickup and drop-off' },
  ];

  protected readonly trustCards: TrustCardData[] = [
    { label: '$', title: 'Keep 95%', body: 'Flat 5% lister fee. No subscriptions, no listing fees, no surprises.' },
    { label: 'ID', title: 'Verified renters only', body: 'Government ID and selfie match required before anyone can book your gear.' },
    { label: '→', title: 'Fast payouts', body: 'Stripe Connect direct deposit. Released within days of a confirmed return.' },
    { label: '★', title: 'You set the rules', body: 'Your daily rate, your availability, your pickup terms. Kitlo just runs the rails.' },
  ];
}

function toProfile(l: ListingSummary): ProfileSummary {
  return {
    id: l.listerId,
    name: l.listerName,
    verified: l.listerVerified,
    rating: l.rating,
    primaryGear: l.gearTypeLabel,
    primaryRateCents: l.dailyRateCents,
  };
}
