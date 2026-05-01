import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, map } from 'rxjs';
import { PageHeader, ReviewCard, ReviewSummary, Tabs, type TabDef } from '../../../../shared';
import { AuthService } from '../../../../core/services/auth.service';
import { ReviewsService } from '../../../../core/services/reviews.service';
import { MOCK_REVIEWS_BY_LISTING } from '../../../../core/mock-data';

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
  private readonly reviewsApi = inject(ReviewsService);

  protected readonly activeTab = signal('received');

  private readonly received = toSignal(
    forkJoin(
      MOCK_REVIEWS_BY_LISTING.map((g) =>
        this.reviewsApi.getByListing(g.listingId).pipe(map((page) => page.items)),
      ),
    ).pipe(map((groups) => groups.flat())),
    { initialValue: [] },
  );

  private readonly given = toSignal(
    this.reviewsApi.getByUser(this.auth.currentUser()?.id ?? 'u-renter-1'),
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
