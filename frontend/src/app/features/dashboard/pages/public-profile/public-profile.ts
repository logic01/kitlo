import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import {
  Avatar,
  Badge,
  Button,
  ListingCard,
  PageHeader,
  ReviewCard,
  ReviewSummary,
  StatCard,
} from '../../../../shared';
import {
  MOCK_LISTING_SUMMARIES,
  MOCK_RENTER_REVIEWS,
  MOCK_USERS,
  userById,
} from '../../../../core/mock-data';

@Component({
  selector: 'app-dashboard-public-profile',
  imports: [SlicePipe, Avatar, Badge, Button, ListingCard, PageHeader, ReviewCard, ReviewSummary, StatCard],
  template: `
    @if (user(); as u) {
      <div class="px-8 py-8">
        <app-page-header [title]="u.name" subtitle="Public profile" />

        <div class="flex items-center gap-5 p-6 border border-line bg-bone mt-6 mb-8">
          <app-avatar size="lg" [name]="u.name" [imageUrl]="u.avatarUrl" />
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-condensed text-h2 font-extrabold uppercase text-slate">{{ u.name }}</span>
              @if (u.verified) {
                <app-badge kind="verified" label="Verified Hunter" />
              }
            </div>
            <div class="text-sm text-muted">{{ u.city }}, {{ u.state }} · Member since {{ u.joinedAt | slice: 0:4 }}</div>
          </div>
          <button appButton variant="primary" type="button">Message {{ u.name.split(' ')[0] }}</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <app-stat-card overline="Rating" value="★ 4.9" sublabel="47 reviews" tone="primary" />
          <app-stat-card overline="Rentals" value="34" sublabel="Lifetime" />
          <app-stat-card overline="Response time" value="< 4 hr" sublabel="Average" />
        </div>

        @if (listings().length) {
          <h2 class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] mb-4">
            Active listings
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            @for (listing of listings(); track listing.id) {
              <app-listing-card [listing]="listing" />
            }
          </div>
        }

        <h2 class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] mb-4">
          Reviews from renters
        </h2>
        <app-review-summary [averageRating]="4.9" [count]="reviews.length" />
        <div class="space-y-4 mt-5">
          @for (review of reviews; track review.id) {
            <app-review-card [review]="review" />
          }
        </div>
      </div>
    } @else {
      <div class="px-8 py-16 text-center text-muted">User not found.</div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPublicProfile {
  private readonly route = inject(ActivatedRoute);
  private readonly userId = toSignal(
    this.route.params.pipe(map((p) => p['id'] as string)),
    { initialValue: MOCK_USERS[0].id },
  );

  protected readonly user = computed(() => userById(this.userId()) ?? null);
  protected readonly listings = computed(() => {
    const u = this.user();
    return u ? MOCK_LISTING_SUMMARIES.filter((l) => l.listerName === u.name).slice(0, 6) : [];
  });
  protected readonly reviews = MOCK_RENTER_REVIEWS;
}
