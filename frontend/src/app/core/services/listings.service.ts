import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Condition } from '../../shared/components/badge/badge';
import type {
  GearType,
  Listing,
  ListingPhoto,
  ListingStatus,
  ListingSummary,
  Vertical,
} from '../models/listing';

export type { ListingStatus };

export interface ListingSearchQuery {
  location?: string;
  vertical?: Vertical;
  gearType?: GearType;
  startDate?: string;
  endDate?: string;
  condition?: Condition[];
  minPriceCents?: number;
  maxPriceCents?: number;
  radius?: number;
  verifiedOnly?: boolean;
  minRating?: number;
  featured?: boolean;
  listerId?: string;
  sort?: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  page?: number;
  pageSize?: number;
}

export interface ListingSearchResult {
  items: ListingSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export type AvailabilityRangeStatus = 'booked' | 'blocked';

export interface AvailabilityRange {
  start: string;
  end: string;
  status: AvailabilityRangeStatus;
}

export interface MarketRate {
  gearType: GearType;
  averageDailyCents: number;
  p25Cents: number;
  p75Cents: number;
  sampleSize: number;
}

export type ListingDraftInput = Pick<
  Listing,
  'title' | 'vertical' | 'gearType' | 'gearTypeLabel' | 'condition' | 'pickupZip'
> & {
  listerId: string;
  listerName: string;
  listerVerified: boolean;
  description?: string;
  dailyRateCents?: number;
  depositCents?: number;
  cancellationPolicy?: 'flexible' | 'moderate' | 'strict';
  isBundle?: boolean;
};

interface BackendListingSummary {
  id: string;
  title: string;
  vertical: Vertical;
  gearType: GearType;
  gearTypeLabel: string;
  condition: Condition;
  dailyRateCents: number;
  pickupZip: string;
  heroPhotoUrl: string;
  listerId: string;
  listerName: string;
  listerVerified: boolean;
  isBundle: boolean;
  ratingAverage: number;
  ratingCount: number;
  status: ListingStatus;
}

interface BackendListing extends Omit<BackendListingSummary, 'heroPhotoUrl'> {
  description: string;
  depositCents: number | null;
  serviceFeeBp: number;
  cancellationPolicy: 'flexible' | 'moderate' | 'strict';
  photos: { id: string; url: string; alt: string | null; isHero: boolean }[];
  specs: { key: string; value: string }[];
  bundleListingIds: string[] | null;
}

function mapSummary(b: BackendListingSummary): ListingSummary {
  return {
    id: b.id,
    title: b.title,
    vertical: b.vertical,
    gearType: b.gearType,
    gearTypeLabel: b.gearTypeLabel,
    condition: b.condition,
    dailyRateCents: b.dailyRateCents,
    pickupZip: b.pickupZip,
    heroPhotoUrl: b.heroPhotoUrl,
    listerId: b.listerId,
    listerName: b.listerName,
    listerVerified: b.listerVerified,
    isBundle: b.isBundle,
    rating: b.ratingCount > 0 ? { average: b.ratingAverage, count: b.ratingCount } : undefined,
    status: b.status,
  };
}

function mapListing(b: BackendListing): Listing {
  const heroPhoto = b.photos.find((p) => p.isHero) ?? b.photos[0];
  return {
    id: b.id,
    title: b.title,
    vertical: b.vertical,
    gearType: b.gearType,
    gearTypeLabel: b.gearTypeLabel,
    condition: b.condition,
    dailyRateCents: b.dailyRateCents,
    depositCents: b.depositCents ?? undefined,
    serviceFeePct: b.serviceFeeBp / 100,
    cancellationPolicy: b.cancellationPolicy,
    pickupZip: b.pickupZip,
    description: b.description,
    heroPhotoUrl: heroPhoto?.url ?? '',
    listerId: b.listerId,
    listerName: b.listerName,
    listerVerified: b.listerVerified,
    isBundle: b.isBundle,
    rating: b.ratingCount > 0 ? { average: b.ratingAverage, count: b.ratingCount } : undefined,
    photos: b.photos.map((p) => ({ id: p.id, url: p.url, alt: p.alt ?? undefined, isHero: p.isHero })),
    specs: b.specs.map((s) => ({ key: s.key, value: s.value })),
    bundleListingIds: b.bundleListingIds ?? undefined,
    status: b.status,
  };
}

@Injectable({ providedIn: 'root' })
export class ListingsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/listings`;

  search(query: ListingSearchQuery = {}): Observable<ListingSearchResult> {
    let params = new HttpParams();
    if (query.vertical) params = params.set('vertical', query.vertical);
    if (query.gearType) params = params.set('gearType', query.gearType);
    if (query.condition?.length) params = params.set('conditions', query.condition.join(','));
    if (query.minPriceCents != null) params = params.set('minPriceCents', String(query.minPriceCents));
    if (query.maxPriceCents != null) params = params.set('maxPriceCents', String(query.maxPriceCents));
    if (query.verifiedOnly) params = params.set('verifiedOnly', 'true');
    if (query.location) params = params.set('location', query.location);
    if (query.sort) params = params.set('sort', query.sort);
    if (query.listerId) params = params.set('listerId', query.listerId);
    if (query.page) params = params.set('page', String(query.page));
    if (query.pageSize) params = params.set('pageSize', String(query.pageSize));

    return this.http
      .get<{ items: BackendListingSummary[]; total: number; page: number; pageSize: number }>(this.base, { params })
      .pipe(
        map((r) => ({
          items: r.items.map(mapSummary),
          total: r.total,
          page: r.page,
          pageSize: r.pageSize,
        })),
      );
  }

  count(query: ListingSearchQuery = {}): Observable<number> {
    return this.search({ ...query, pageSize: 1 }).pipe(map((r) => r.total));
  }

  getById(id: string): Observable<Listing> {
    return this.http.get<BackendListing>(`${this.base}/${id}`).pipe(map(mapListing));
  }

  getAvailability(id: string): Observable<AvailabilityRange[]> {
    return this.http.get<{ startDate: string; endDate: string; status: string }[]>(`${this.base}/${id}/availability`).pipe(
      map((rows) =>
        rows.map((r) => ({
          start: r.startDate,
          end: r.endDate,
          status: (r.status === 'booked' ? 'booked' : 'blocked') as AvailabilityRangeStatus,
        })),
      ),
    );
  }

  /**
   * "My listings" — calls the dedicated `/api/listings/mine` endpoint that returns
   * summaries for all of the caller's listings (drafts/paused included).
   */
  getMine(): Observable<ListingSummary[]> {
    const params = new HttpParams().set('pageSize', '100');
    return this.http
      .get<{ items: BackendListingSummary[]; total: number; page: number; pageSize: number }>(
        `${this.base}/mine`,
        { params },
      )
      .pipe(map((r) => r.items.map(mapSummary)));
  }

  create(input: ListingDraftInput): Observable<Listing> {
    return this.http
      .post<BackendListing>(this.base, {
        title: input.title,
        vertical: input.vertical,
        gearType: input.gearType,
        gearTypeLabel: input.gearTypeLabel,
        condition: input.condition,
        pickupZip: input.pickupZip,
        description: input.description ?? '',
        dailyRateCents: input.dailyRateCents ?? 0,
        depositCents: input.depositCents,
        cancellationPolicy: input.cancellationPolicy ?? 'moderate',
        isBundle: input.isBundle ?? false,
      })
      .pipe(map(mapListing));
  }

  update(id: string, patch: Partial<Listing>): Observable<Listing> {
    const body: Record<string, unknown> = {};
    if (patch.title !== undefined) body['title'] = patch.title;
    if (patch.description !== undefined) body['description'] = patch.description;
    if (patch.dailyRateCents !== undefined) body['dailyRateCents'] = patch.dailyRateCents;
    if (patch.depositCents !== undefined) body['depositCents'] = patch.depositCents;
    if (patch.cancellationPolicy !== undefined) body['cancellationPolicy'] = patch.cancellationPolicy;
    if (patch.condition !== undefined) body['condition'] = patch.condition;
    if (patch.pickupZip !== undefined) body['pickupZip'] = patch.pickupZip;
    if (patch.vertical !== undefined) body['vertical'] = patch.vertical;
    if (patch.gearType !== undefined) body['gearType'] = patch.gearType;
    if (patch.gearTypeLabel !== undefined) body['gearTypeLabel'] = patch.gearTypeLabel;
    if (patch.isBundle !== undefined) body['isBundle'] = patch.isBundle;
    if (patch.bundleListingIds !== undefined) body['bundleListingIds'] = patch.bundleListingIds;
    return this.http.put<BackendListing>(`${this.base}/${id}`, body).pipe(map(mapListing));
  }

  archive(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  addPhotos(id: string, photos: Omit<ListingPhoto, 'id'>[]): Observable<ListingPhoto[]> {
    // Backend exposes single-photo upload; add them sequentially.
    const calls = photos.map((p) =>
      this.http.post<{ id: string; url: string; alt: string | null; isHero: boolean }>(
        `${this.base}/${id}/photos`,
        { url: p.url, alt: p.alt ?? null, isHero: p.isHero ?? false },
      ),
    );
    return new Observable<ListingPhoto[]>((subscriber) => {
      Promise.all(calls.map((o) => new Promise<ListingPhoto>((res, rej) => o.subscribe({ next: (r) => res({ id: r.id, url: r.url, alt: r.alt ?? undefined, isHero: r.isHero }), error: rej }))))
        .then((all) => {
          subscriber.next(all);
          subscriber.complete();
        })
        .catch((err) => subscriber.error(err));
    });
  }

  publish(id: string): Observable<Listing> {
    return this.http.post<BackendListing>(`${this.base}/${id}/publish`, {}).pipe(map(mapListing));
  }

  /**
   * Market-rate stats are not in the backend yet. Returns a coarse client-side
   * placeholder so the listing-create form's hint stays populated; replace
   * once a `/api/listings/market-rates` endpoint lands.
   */
  getMarketRates(category: GearType): Observable<MarketRate> {
    return this.search({ gearType: category, pageSize: 50 }).pipe(
      map((r) => {
        if (!r.items.length) return { gearType: category, averageDailyCents: 0, p25Cents: 0, p75Cents: 0, sampleSize: 0 };
        const rates = r.items.map((l) => l.dailyRateCents).sort((a, b) => a - b);
        const avg = Math.round(rates.reduce((s, v) => s + v, 0) / rates.length);
        return {
          gearType: category,
          averageDailyCents: avg,
          p25Cents: rates[Math.floor(rates.length * 0.25)] ?? rates[0],
          p75Cents: rates[Math.floor(rates.length * 0.75)] ?? rates[rates.length - 1],
          sampleSize: rates.length,
        };
      }),
    );
  }
}
