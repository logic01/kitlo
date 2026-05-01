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
import { MOCK_PROFILES } from '../../../../core/mock-data';

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
      kicker="Peer-to-peer hunting equipment"
      headline="Rent the gear."
      accent="Own the hunt."
      sub="Thermal, night vision, and high-value hunting equipment — from verified hunters, for hunters."
    >
      <div slot="right" class="flex flex-col gap-3">
        @for (profile of featuredProfiles; track profile.id) {
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

    <app-dark-band
      heading="Built for the"
      accent="hunting community"
      sub="Every transaction is vetted, mediated, and reviewed."
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
  protected readonly featuredProfiles = MOCK_PROFILES.filter((p) => p.rating).slice(0, 3);

  protected readonly pillars: OliveBandPillar[] = [
    { title: 'Verified hunters only', body: 'Government ID + selfie verify before listing' },
    { title: 'Funds held in escrow', body: 'Payment released only after confirmed return' },
    { title: 'Gear inspected at handoff', body: 'Photo-documented condition at pickup and drop-off' },
  ];

  protected readonly trustCards: TrustCardData[] = [
    { label: 'ID', title: 'Identity verified', body: 'Government ID and selfie match required before any lister can post gear.' },
    { label: '$', title: 'Escrow payment', body: 'Funds are held securely until both parties confirm the rental is complete.' },
    { label: '★', title: 'Two-way reviews', body: 'Renters rate gear. Listers rate renters. Every transaction builds public reputation.' },
    { label: '⚖', title: 'Dispute resolution', body: 'Admin-mediated with photo evidence. Damage deposit held until resolved.' },
  ];
}
