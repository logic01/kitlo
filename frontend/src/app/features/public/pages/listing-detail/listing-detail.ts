import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  AvailabilityCalendar,
  Avatar,
  Badge,
  BookingSidebar,
  Button,
  PageHeader,
  PhotoGallery,
  ReviewCard,
  ReviewSummary,
  Skeleton,
  SpecTable,
  type Crumb,
  type DateRangeValue,
  type SpecRow,
} from '../../../../shared';
import { AuthService, ListingsService, ReviewsService } from '../../../../core/services';
import type { Listing, Review } from '../../../../core/models';

interface ListingDetailState {
  status: 'loading' | 'ready' | 'not-found';
  listing: Listing | null;
  reviews: Review[];
}

@Component({
  selector: 'app-public-listing-detail',
  imports: [
    RouterLink,
    AvailabilityCalendar,
    Avatar,
    Badge,
    BookingSidebar,
    Button,
    PageHeader,
    PhotoGallery,
    ReviewCard,
    ReviewSummary,
    Skeleton,
    SpecTable,
  ],
  template: `
    @if (state().status === 'loading') {
      <div
        class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-8"
        aria-busy="true"
      >
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <div>
            <div class="aspect-[4/3] bg-surface kitlo-pulse" aria-hidden="true"></div>
            <div class="mt-7 space-y-3">
              <app-skeleton variant="line" [count]="1" />
              <span class="block h-8 w-2/3 bg-surface kitlo-pulse" aria-hidden="true"></span>
              <app-skeleton variant="line" [count]="2" />
            </div>
            <div class="mt-8 space-y-2">
              <app-skeleton variant="line" [count]="6" />
            </div>
          </div>
          <aside>
            <div class="border border-line bg-bone p-5 space-y-3" aria-hidden="true">
              <span class="block h-6 w-1/2 bg-surface kitlo-pulse"></span>
              <span class="block h-10 w-full bg-surface kitlo-pulse"></span>
              <span class="block h-10 w-full bg-surface kitlo-pulse"></span>
              <span class="block h-12 w-full bg-surface kitlo-pulse mt-4"></span>
            </div>
          </aside>
        </div>
      </div>
    } @else if (state().status === 'not-found') {
      <div class="px-10 py-16 text-center text-muted">Listing not found.</div>
    } @else if (state().listing; as l) {
      <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) py-8">
        <app-page-header [title]="l.title" [breadcrumbs]="crumbs()" />

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 mt-6">
          <div>
            <app-photo-gallery [photos]="photoUrls()" [alt]="l.title" />

            <div class="mt-7">
              <div class="flex gap-2 flex-wrap mb-3">
                <app-badge kind="condition" [condition]="l.condition" />
                <app-badge kind="gear-type" [label]="l.gearTypeLabel" />
                @if (l.listerVerified) {
                  <app-badge kind="verified" label="Verified Hunter" />
                }
              </div>
              <h1 class="font-condensed text-h1 font-black uppercase text-slate leading-none">
                {{ l.title }}
              </h1>
              <div class="flex gap-5 text-sm text-muted mt-3">
                @if (l.rating) {
                  <span>★ {{ l.rating.average }} · {{ l.rating.count }} reviews</span>
                }
                <span>ZIP {{ l.pickupZip }}</span>
              </div>
            </div>

            <div class="mt-6 flex items-center gap-4 p-4 border border-line bg-surface">
              <app-avatar size="md" [name]="l.listerName" />
              <div class="flex-1">
                <div class="text-xs text-muted">Listed by</div>
                <div class="font-semibold flex items-center gap-2">
                  {{ l.listerName }}
                  @if (l.listerVerified) {
                    <app-badge kind="verified" label="Verified" />
                  }
                </div>
                <div class="text-xs text-muted mt-0.5">
                  Member since 2024 · {{ l.rating?.count ?? 0 }} rentals · ★ {{ l.rating?.average ?? '—' }}
                </div>
              </div>
              <a appButton variant="ghost" routerLink="/users/{{ l.listerName }}">View profile</a>
            </div>

            <p class="mt-6 text-body leading-relaxed text-muted">{{ l.description }}</p>

            <section class="mt-8">
              <h3 class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] mb-4">
                Specifications
              </h3>
              <app-spec-table [rows]="specs()" />
            </section>

            <section class="mt-8">
              <h3 class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] mb-4">
                Availability
              </h3>
              <app-availability-calendar mode="select-range" />
            </section>

            <section class="mt-10">
              <h3 class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] mb-4">
                Reviews ({{ l.rating?.count ?? 0 }})
              </h3>
              @if (l.rating) {
                <app-review-summary [averageRating]="l.rating.average" [count]="l.rating.count" />
              }
              <div class="space-y-4 mt-5">
                @for (review of state().reviews; track review.id) {
                  <app-review-card [review]="review" />
                }
              </div>
            </section>

            <div class="border-t border-line mt-10 pt-5 text-xs text-muted">
              <a class="underline" href="#">Report this listing</a>
            </div>
          </div>

          <aside>
            <div class="sticky top-20">
              <app-booking-sidebar
                [listing]="l"
                [(range)]="dateRange"
                (book)="requestBooking(l.id)"
              />
            </div>
          </aside>
        </div>
      </div>
    }
  `,
  styles: `
    .kitlo-pulse { animation: kitlo-skeleton 1.4s ease-in-out infinite; }
    @keyframes kitlo-skeleton {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.55; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicListingDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly listings = inject(ListingsService);
  private readonly reviews = inject(ReviewsService);
  private readonly auth = inject(AuthService);

  protected readonly dateRange = signal<DateRangeValue>({ start: null, end: null });

  protected requestBooking(listingId: string): void {
    const r = this.dateRange();
    if (!r.start || !r.end) return;
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { redirect: `/listing/${listingId}` },
      });
      return;
    }
    this.router.navigate(['/booking', listingId, 'request'], {
      queryParams: {
        start: this.toIsoDate(r.start),
        end: this.toIsoDate(r.end),
      },
    });
  }

  private toIsoDate(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  protected readonly state = toSignal(
    this.route.params.pipe(
      map((p) => p['id'] as string),
      switchMap((id) =>
        this.listings.getById(id).pipe(
          switchMap((listing) =>
            this.reviews.getByListing(id).pipe(
              map(
                (page): ListingDetailState => ({
                  status: 'ready',
                  listing,
                  reviews: page.items,
                }),
              ),
            ),
          ),
          catchError(() => of<ListingDetailState>({ status: 'not-found', listing: null, reviews: [] })),
        ),
      ),
    ),
    { initialValue: { status: 'loading', listing: null, reviews: [] } as ListingDetailState },
  );

  protected readonly photoUrls = computed(() => this.state().listing?.photos.map((p) => p.url) ?? []);
  protected readonly specs = computed<SpecRow[]>(() =>
    (this.state().listing?.specs ?? []).map((s) => ({ key: s.key, value: s.value })),
  );
  protected readonly crumbs = computed<Crumb[]>(() => {
    const l = this.state().listing;
    return l ? [{ label: l.gearTypeLabel, route: '/search' }, { label: l.title }] : [];
  });
}
