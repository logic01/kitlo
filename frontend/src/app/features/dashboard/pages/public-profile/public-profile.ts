import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
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
import { UsersService } from '../../../../core/services/users.service';
import { ListingsService } from '../../../../core/services/listings.service';
import { ReviewsService } from '../../../../core/services/reviews.service';

@Component({
  selector: 'app-dashboard-public-profile',
  imports: [SlicePipe, Avatar, Badge, Button, ListingCard, PageHeader, ReviewCard, ReviewSummary, StatCard],
  template: `
    @if (profile(); as pp) {
      <div class="px-8 py-8">
        <app-page-header [title]="pp.user.name" subtitle="Public profile" />

        <div class="flex items-center gap-5 p-6 border border-line bg-bone mt-6 mb-8">
          <app-avatar size="lg" [name]="pp.user.name" [imageUrl]="pp.user.avatarUrl" />
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-condensed text-h2 font-extrabold uppercase text-slate">{{ pp.user.name }}</span>
              @if (pp.user.verified) {
                <app-badge kind="verified" label="Verified Hunter" />
              }
            </div>
            <div class="text-sm text-muted">
              {{ pp.user.city }}<span class="px-1">,</span>{{ pp.user.state }}
              · Member since {{ pp.user.joinedAt | slice: 0:4 }}
            </div>
          </div>
          <button appButton variant="primary" type="button">Message {{ pp.user.name.split(' ')[0] }}</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <app-stat-card overline="Rating" [value]="ratingDisplay()" [sublabel]="ratingSublabel()" tone="primary" />
          <app-stat-card overline="Rentals" [value]="rentalsDisplay()" sublabel="Lifetime" />
          <app-stat-card overline="Response time" [value]="responseDisplay()" sublabel="Average" />
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
        <app-review-summary [averageRating]="pp.profile.rating?.average ?? 0" [count]="reviews().length" />
        <div class="space-y-4 mt-5">
          @for (review of reviews(); track review.id) {
            <app-review-card [review]="review" />
          } @empty {
            <p class="text-sm text-muted py-6">No reviews yet.</p>
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
  private readonly users = inject(UsersService);
  private readonly listingsApi = inject(ListingsService);
  private readonly reviewsApi = inject(ReviewsService);

  private readonly userId$ = this.route.params.pipe(
    map((p) => p['id'] as string | undefined),
  );

  protected readonly profile = toSignal(
    this.userId$.pipe(switchMap((id) => (id ? this.users.getPublicProfile(id) : of(null)))),
    { initialValue: null },
  );

  protected readonly listings = toSignal(
    this.userId$.pipe(
      switchMap((id) =>
        id
          ? this.listingsApi.search({ listerId: id, pageSize: 6 }).pipe(map((r) => r.items))
          : of([]),
      ),
    ),
    { initialValue: [] },
  );

  protected readonly reviews = toSignal(
    this.userId$.pipe(switchMap((id) => (id ? this.reviewsApi.getByUser(id) : of([])))),
    { initialValue: [] },
  );

  protected readonly ratingDisplay = computed(() => {
    const r = this.profile()?.profile.rating;
    return r ? `★ ${r.average.toFixed(1)}` : '—';
  });
  protected readonly ratingSublabel = computed(() => {
    const r = this.profile()?.profile.rating;
    return r ? `${r.count} reviews` : 'No reviews yet';
  });
  protected readonly rentalsDisplay = computed(() =>
    String(this.profile()?.totalRentals ?? 0),
  );
  protected readonly responseDisplay = computed(() => {
    const h = this.profile()?.responseHours ?? 0;
    return h ? `< ${h} hr` : '—';
  });
}
