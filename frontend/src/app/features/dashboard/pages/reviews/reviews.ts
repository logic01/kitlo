import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, forkJoin, map, of, switchMap } from 'rxjs';
import { PageHeader, ReviewCard, ReviewSummary, Tabs, type TabDef } from '../../../../shared';
import { AuthService } from '../../../../core/services/auth.service';
import { ListingsService } from '../../../../core/services/listings.service';
import { ReviewsService } from '../../../../core/services/reviews.service';

@Component({
  selector: 'app-dashboard-reviews',
  imports: [PageHeader, ReviewCard, ReviewSummary, Tabs],
  template: `
    <div class="px-8 py-8">
      <app-page-header title="Reviews" subtitle="What renters and listers say about you." />

      <app-tabs [tabs]="tabs()" [(activeId)]="activeTab" />

      <div class="mt-6 max-w-3xl">
        <app-review-summary [averageRating]="averageRating()" [count]="reviews().length" />
        <div class="space-y-4 mt-5">
          @for (review of reviews(); track review.id) {
            <app-review-card [review]="review" />
          } @empty {
            <p class="text-muted text-sm py-8 text-center">No reviews yet on this side.</p>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardReviews {
  private readonly auth = inject(AuthService);
  private readonly listingsApi = inject(ListingsService);
  private readonly reviewsApi = inject(ReviewsService);

  protected readonly activeTab = signal('received');

  // "Received" reviews are aggregated across the user's own listings (renter→lister direction).
  private readonly received = toSignal(
    this.listingsApi.getMine().pipe(
      switchMap((listings) =>
        listings.length
          ? forkJoin(
              listings.map((l) =>
                this.reviewsApi.getByListing(l.id).pipe(map((page) => page.items)),
              ),
            ).pipe(map((groups) => groups.flat()))
          : of([]),
      ),
    ),
    { initialValue: [] },
  );

  // "Given" reviews are reviews the current user wrote (about counterparties).
  private readonly given = toSignal(
    combineLatest([of(this.auth.currentUser())]).pipe(
      switchMap(([me]) => (me ? this.reviewsApi.getByUser(me.id) : of([]))),
    ),
    { initialValue: [] },
  );

  protected readonly reviews = computed(() =>
    this.activeTab() === 'received' ? this.received() : this.given(),
  );

  protected readonly tabs = computed<TabDef[]>(() => [
    { id: 'received', label: 'Received', count: this.received().length },
    { id: 'given', label: 'Given', count: this.given().length },
  ]);

  protected readonly averageRating = computed(() => {
    const r = this.reviews();
    if (!r.length) return 0;
    return r.reduce((s, x) => s + x.rating, 0) / r.length;
  });
}
