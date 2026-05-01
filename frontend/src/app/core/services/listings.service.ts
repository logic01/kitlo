import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Condition } from '../../shared/components/badge/badge';
import type { GearType, Listing, ListingPhoto, ListingSummary } from '../models/listing';
import { MOCK_LISTINGS, MOCK_LISTING_SUMMARIES } from '../mock-data';
import { generateId, mockError, mockResponse } from './mock-response';

export interface ListingSearchQuery {
  location?: string;
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
  'title' | 'gearType' | 'gearTypeLabel' | 'condition' | 'pickupZip'
> & { listerId: string; listerName: string; listerVerified: boolean };

const DEFAULT_PAGE_SIZE = 12;

@Injectable({ providedIn: 'root' })
export class ListingsService {
  private listings: Listing[] = MOCK_LISTINGS.map((l) => ({ ...l }));
  private summaries: ListingSummary[] = MOCK_LISTING_SUMMARIES.map((l) => ({ ...l }));

  search(query: ListingSearchQuery = {}): Observable<ListingSearchResult> {
    const filtered = this.applyFilters(this.summaries, query);
    const sorted = this.applySort(filtered, query.sort);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
    const start = (page - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);
    return mockResponse({ items, total: sorted.length, page, pageSize });
  }

  count(query: ListingSearchQuery = {}): Observable<number> {
    return mockResponse(this.applyFilters(this.summaries, query).length);
  }

  getById(id: string): Observable<Listing> {
    const listing = this.listings.find((l) => l.id === id);
    if (!listing) return mockError(`Listing ${id} not found`);
    return mockResponse({ ...listing });
  }

  getAvailability(id: string): Observable<AvailabilityRange[]> {
    if (!this.listings.some((l) => l.id === id)) {
      return mockError(`Listing ${id} not found`);
    }
    return mockResponse(this.syntheticAvailability(id));
  }

  getMine(listerId: string): Observable<Listing[]> {
    const mine = this.listings.filter((l) => l.listerName === listerId || this.listerIdGuess(l) === listerId);
    return mockResponse(mine.map((l) => ({ ...l })));
  }

  create(input: ListingDraftInput): Observable<Listing> {
    const draft: Listing = {
      id: generateId('lst'),
      title: input.title,
      gearType: input.gearType,
      gearTypeLabel: input.gearTypeLabel,
      condition: input.condition,
      dailyRateCents: 0,
      pickupZip: input.pickupZip,
      heroPhotoUrl: '',
      listerName: input.listerName,
      listerVerified: input.listerVerified,
      description: '',
      photos: [],
      specs: [],
      serviceFeePct: 12,
      cancellationPolicy: 'moderate',
    };
    this.listings = [draft, ...this.listings];
    this.summaries = [this.toSummary(draft), ...this.summaries];
    return mockResponse({ ...draft });
  }

  update(id: string, patch: Partial<Listing>): Observable<Listing> {
    const idx = this.listings.findIndex((l) => l.id === id);
    if (idx < 0) return mockError(`Listing ${id} not found`);
    const next: Listing = { ...this.listings[idx], ...patch, id };
    this.listings[idx] = next;
    const summaryIdx = this.summaries.findIndex((s) => s.id === id);
    if (summaryIdx >= 0) this.summaries[summaryIdx] = this.toSummary(next);
    return mockResponse({ ...next });
  }

  archive(id: string): Observable<void> {
    this.listings = this.listings.filter((l) => l.id !== id);
    this.summaries = this.summaries.filter((s) => s.id !== id);
    return mockResponse(undefined);
  }

  addPhotos(id: string, photos: Omit<ListingPhoto, 'id'>[]): Observable<ListingPhoto[]> {
    const idx = this.listings.findIndex((l) => l.id === id);
    if (idx < 0) return mockError(`Listing ${id} not found`);
    const created: ListingPhoto[] = photos.map((p) => ({ ...p, id: generateId('p') }));
    const next: Listing = { ...this.listings[idx], photos: [...this.listings[idx].photos, ...created] };
    this.listings[idx] = next;
    return mockResponse(created);
  }

  publish(id: string): Observable<Listing> {
    return this.update(id, {});
  }

  getMarketRates(category: GearType): Observable<MarketRate> {
    const sample = this.summaries.filter((l) => l.gearType === category);
    if (!sample.length) {
      return mockResponse({ gearType: category, averageDailyCents: 0, p25Cents: 0, p75Cents: 0, sampleSize: 0 });
    }
    const rates = sample.map((l) => l.dailyRateCents).sort((a, b) => a - b);
    const avg = Math.round(rates.reduce((sum, r) => sum + r, 0) / rates.length);
    const p25 = rates[Math.floor(rates.length * 0.25)] ?? rates[0];
    const p75 = rates[Math.floor(rates.length * 0.75)] ?? rates[rates.length - 1];
    return mockResponse({ gearType: category, averageDailyCents: avg, p25Cents: p25, p75Cents: p75, sampleSize: rates.length });
  }

  private applyFilters(items: ListingSummary[], q: ListingSearchQuery): ListingSummary[] {
    return items.filter((l) => {
      if (q.gearType && l.gearType !== q.gearType) return false;
      if (q.condition?.length && !q.condition.includes(l.condition)) return false;
      if (q.minPriceCents != null && l.dailyRateCents < q.minPriceCents) return false;
      if (q.maxPriceCents != null && l.dailyRateCents > q.maxPriceCents) return false;
      if (q.verifiedOnly && !l.listerVerified) return false;
      if (q.minRating != null && (l.rating?.average ?? 0) < q.minRating) return false;
      if (q.location) {
        const loc = q.location.trim().toLowerCase();
        if (!l.pickupZip.toLowerCase().includes(loc) && !l.listerName.toLowerCase().includes(loc)) {
          return false;
        }
      }
      return true;
    });
  }

  private applySort(items: ListingSummary[], sort: ListingSearchQuery['sort']): ListingSummary[] {
    const copy = [...items];
    switch (sort) {
      case 'price-asc':
        return copy.sort((a, b) => a.dailyRateCents - b.dailyRateCents);
      case 'price-desc':
        return copy.sort((a, b) => b.dailyRateCents - a.dailyRateCents);
      case 'rating':
        return copy.sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0));
      case 'newest':
        return copy.reverse();
      default:
        return copy;
    }
  }

  private toSummary(l: Listing): ListingSummary {
    return {
      id: l.id,
      title: l.title,
      gearType: l.gearType,
      gearTypeLabel: l.gearTypeLabel,
      condition: l.condition,
      dailyRateCents: l.dailyRateCents,
      pickupZip: l.pickupZip,
      heroPhotoUrl: l.heroPhotoUrl,
      rating: l.rating,
      listerName: l.listerName,
      listerVerified: l.listerVerified,
      isBundle: l.isBundle,
    };
  }

  private listerIdGuess(l: Listing): string {
    return `u-lister-${l.listerName.toLowerCase().replace(/\s+/g, '-')}`;
  }

  private syntheticAvailability(listingId: string): AvailabilityRange[] {
    const seed = listingId.charCodeAt(listingId.length - 1) % 5;
    const today = new Date();
    const ranges: AvailabilityRange[] = [];
    for (let i = 0; i < 2; i++) {
      const start = new Date(today);
      start.setDate(today.getDate() + 7 + i * 14 + seed);
      const end = new Date(start);
      end.setDate(start.getDate() + 2 + (i % 2));
      ranges.push({
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
        status: i === 0 ? 'booked' : 'blocked',
      });
    }
    return ranges;
  }
}
