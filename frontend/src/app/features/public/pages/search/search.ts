import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {
  Button,
  FilterSidebar,
  ListingCard,
  ListingCardSkeleton,
  SearchBar,
  type SearchFilters,
  type SearchQuery,
} from '../../../../shared';
import { ListingsService, type ListingSearchQuery } from '../../../../core/services';
import { loadable } from '../../../../core/loading/loadable';
import type { GearType } from '../../../../core/models';
import type { Condition } from '../../../../shared';

const DEFAULT_FILTERS: SearchFilters = {
  conditions: ['mint', 'field-ready'],
  gearTypes: [],
  verifiedOnly: false,
  instantBook: false,
  radiusMiles: 25,
};

type SortKey = 'recommended' | 'price-asc' | 'rating' | 'distance';

const SORT_MAP: Record<SortKey, ListingSearchQuery['sort']> = {
  recommended: 'relevance',
  'price-asc': 'price-asc',
  rating: 'rating',
  distance: 'relevance',
};

const KNOWN_GEAR_TYPES: GearType[] = [
  'thermal',
  'night-vision',
  'rifle',
  'bow',
  'tree-stand',
  'optics',
  'pack',
  'other',
];

@Component({
  selector: 'app-public-search',
  imports: [FormsModule, Button, FilterSidebar, ListingCard, ListingCardSkeleton, SearchBar],
  template: `
    <div class="border-b border-line bg-bone py-4">
      <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) flex items-center gap-4 flex-wrap">
        <div class="flex-1 min-w-[280px]">
          <app-search-bar
            variant="sticky"
            [defaultLocation]="query().location"
            [defaultType]="query().gearType"
            (submitted)="onSearch($event)"
          />
        </div>
        <span class="font-mono text-xs text-muted">{{ totalCount() }} results</span>
        <button appButton variant="ghost" type="button">Map view</button>
      </div>
    </div>

    <div class="mx-auto max-w-(--kitlo-max-width) px-(--kitlo-page-gutter) grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 py-8">
      <aside>
        <app-filter-sidebar [(filters)]="filters" />
        <button appButton variant="ghost" class="w-full mt-4" (click)="resetFilters()">
          Clear all filters
        </button>
      </aside>

      <section>
        <div class="flex items-center justify-between mb-5">
          <span class="text-sm text-muted">
            {{ totalCount() }} results · {{ query().location || 'Bozeman, MT' }} within {{ filters().radiusMiles }} mi
          </span>
          <select
            class="border border-line bg-bone text-sm py-1.5 px-3 font-mono"
            aria-label="Sort results"
            [ngModel]="sort()"
            (ngModelChange)="sort.set($event)"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="rating">Rating</option>
            <option value="distance">Distance</option>
          </select>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          [attr.aria-busy]="loading()"
        >
          @if (loading()) {
            @for (_ of skeletonSlots; track $index) {
              <app-listing-card-skeleton />
            }
          } @else {
            @for (listing of results(); track listing.id) {
              <app-listing-card [listing]="listing" />
            }
          }
        </div>
        @if (!loading() && results().length === 0) {
          <p class="text-center text-muted py-16">No listings match your filters.</p>
        } @else if (!loading()) {
          <div class="text-center mt-10">
            <button appButton variant="secondary" type="button">Load more</button>
          </div>
        }
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicSearch {
  private readonly listings = inject(ListingsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly query = signal<SearchQuery>({ location: '', gearType: '' });
  protected readonly filters = signal<SearchFilters>({ ...DEFAULT_FILTERS });
  protected readonly sort = signal<SortKey>('recommended');

  private hydratedFromUrl = false;

  constructor() {
    // Hydrate state from current URL once. Subsequent param changes are
    // self-driven (router.navigate from the writer effect), so we only
    // honour the very first emission to avoid feedback loops.
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      if (this.hydratedFromUrl) return;
      this.hydratedFromUrl = true;
      this.applyParams(params);
    });

    // Whenever query / filters / sort change, write the URL.
    effect(() => {
      const url = this.toQueryParams();
      // Touch signals so the effect re-runs when they change. (computed below
      // already reads them, but be explicit so the effect's dependency
      // tracking is unambiguous.)
      this.query();
      this.filters();
      this.sort();
      if (!this.hydratedFromUrl) return; // wait until we've hydrated
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: url,
        replaceUrl: true,
      });
    });
  }

  private readonly searchQuery = computed<ListingSearchQuery>(() => {
    const q = this.query();
    const f = this.filters();
    const typed = this.normalizeGearType(q.gearType, f.gearTypes);
    return {
      location: q.location || undefined,
      gearType: typed,
      condition: f.conditions.length ? f.conditions : undefined,
      minPriceCents: f.minPriceCents,
      maxPriceCents: f.maxPriceCents,
      verifiedOnly: f.verifiedOnly || undefined,
      radius: f.radiusMiles,
      sort: SORT_MAP[this.sort()],
      pageSize: 60,
    };
  });

  private readonly searchResult = loadable(
    toObservable(this.searchQuery).pipe(switchMap((q) => this.listings.search(q))),
  );

  protected readonly loading = this.searchResult.loading;
  protected readonly results = computed(() => this.searchResult.data()?.items ?? []);
  protected readonly totalCount = computed(() => this.searchResult.data()?.total ?? 0);
  protected readonly skeletonSlots = Array(6).fill(0);

  protected onSearch(q: SearchQuery): void {
    this.query.set(q);
  }

  protected resetFilters(): void {
    this.filters.set({ ...DEFAULT_FILTERS });
  }

  private normalizeGearType(input: string, sidebarTypes: string[]): GearType | undefined {
    const candidate = (input || sidebarTypes[0] || '').trim().toLowerCase();
    if (!candidate) return undefined;
    const matched = KNOWN_GEAR_TYPES.find((t) => t === candidate || t.replace('-', ' ') === candidate);
    return matched;
  }

  private applyParams(params: { get(key: string): string | null }): void {
    const next: SearchFilters = { ...DEFAULT_FILTERS };
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');
    const conditions = params.get('conditions');
    const gearTypes = params.get('gearTypes');
    const verifiedOnly = params.get('verifiedOnly');
    const radius = params.get('radius');

    if (minPrice && !Number.isNaN(Number(minPrice))) next.minPriceCents = Number(minPrice) * 100;
    if (maxPrice && !Number.isNaN(Number(maxPrice))) next.maxPriceCents = Number(maxPrice) * 100;
    if (conditions) next.conditions = conditions.split(',').filter(Boolean) as Condition[];
    if (gearTypes) next.gearTypes = gearTypes.split(',').filter(Boolean);
    if (verifiedOnly === 'true') next.verifiedOnly = true;
    if (radius && !Number.isNaN(Number(radius))) next.radiusMiles = Number(radius);

    const sortParam = params.get('sort') as SortKey | null;
    if (sortParam && sortParam in SORT_MAP) this.sort.set(sortParam);

    this.query.set({
      location: params.get('location') ?? '',
      gearType: params.get('q') ?? '',
    });
    this.filters.set(next);
  }

  private toQueryParams(): Record<string, string | null> {
    const q = this.query();
    const f = this.filters();
    const params: Record<string, string | null> = {
      // null clears the param so the URL stays clean for default values
      q: q.gearType?.trim() || null,
      location: q.location?.trim() || null,
      conditions: this.diffArr(f.conditions, DEFAULT_FILTERS.conditions),
      gearTypes: f.gearTypes.length ? f.gearTypes.join(',') : null,
      minPrice: f.minPriceCents != null ? String(Math.round(f.minPriceCents / 100)) : null,
      maxPrice: f.maxPriceCents != null ? String(Math.round(f.maxPriceCents / 100)) : null,
      verifiedOnly: f.verifiedOnly ? 'true' : null,
      radius: f.radiusMiles !== DEFAULT_FILTERS.radiusMiles ? String(f.radiusMiles) : null,
      sort: this.sort() !== 'recommended' ? this.sort() : null,
    };
    return params;
  }

  private diffArr(current: string[], defaults: string[]): string | null {
    const a = [...current].sort().join(',');
    const b = [...defaults].sort().join(',');
    if (a === b) return null;
    return current.length ? current.join(',') : '';
  }
}
