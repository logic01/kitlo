import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { EarningsSummary, Payout, PayoutStatus } from '../models/payout';

export interface PayoutPage {
  items: Payout[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ListingEarnings {
  listingTitle: string;
  bookingsCount: number;
  netCents: number;
}

interface BackendPayout {
  id: string;
  bookingId: string;
  listingTitle: string;
  rentalDays: number;
  grossCents: number;
  platformFeeCents: number;
  netCents: number;
  status: number;
  scheduledFor: string;
  paidAt?: string | null;
  bankLast4?: string | null;
}

interface BackendSummary {
  lifetimeCents: number;
  pendingCents: number;
  thisMonthCents: number;
  bookingsCount: number;
  averageDailyRateCents: number;
}

const STATUSES: PayoutStatus[] = ['scheduled', 'in-transit', 'paid', 'failed'];

function mapPayout(b: BackendPayout): Payout {
  return {
    id: b.id,
    bookingId: b.bookingId,
    listingTitle: b.listingTitle,
    rentalDays: b.rentalDays,
    grossCents: b.grossCents,
    platformFeeCents: b.platformFeeCents,
    netCents: b.netCents,
    status: STATUSES[b.status] ?? 'scheduled',
    scheduledFor: b.scheduledFor,
    paidAt: b.paidAt ?? undefined,
    bankLast4: b.bankLast4 ?? undefined,
  };
}

@Injectable({ providedIn: 'root' })
export class PayoutsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/payouts`;

  getSummary(): Observable<EarningsSummary> {
    return this.http.get<BackendSummary>(`${this.base}/summary`).pipe(
      map((s) => ({
        lifetimeCents: s.lifetimeCents,
        pendingCents: s.pendingCents,
        thisMonthCents: s.thisMonthCents,
        bookingsCount: s.bookingsCount,
        averageDailyRateCents: s.averageDailyRateCents,
      })),
    );
  }

  getHistory(page = 1, pageSize = 20): Observable<PayoutPage> {
    const params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
    return this.http
      .get<{ items: BackendPayout[]; total: number; page: number; pageSize: number }>(this.base, { params })
      .pipe(
        map((r) => ({
          items: r.items.map(mapPayout),
          total: r.total,
          page: r.page,
          pageSize: r.pageSize,
        })),
      );
  }

  /**
   * Per-listing earnings rollup is owed on the backend; for now derive it from
   * the paged history endpoint.
   */
  getByListing(): Observable<ListingEarnings[]> {
    return this.getHistory(1, 100).pipe(
      map((p) => {
        const grouped = new Map<string, ListingEarnings>();
        for (const item of p.items) {
          const existing = grouped.get(item.listingTitle);
          if (existing) {
            existing.bookingsCount += 1;
            existing.netCents += item.netCents;
          } else {
            grouped.set(item.listingTitle, {
              listingTitle: item.listingTitle,
              bookingsCount: 1,
              netCents: item.netCents,
            });
          }
        }
        return [...grouped.values()].sort((a, b) => b.netCents - a.netCents);
      }),
    );
  }

  exportCsv(): Observable<string> {
    return this.http.get(`${this.base}/export`, { responseType: 'text' });
  }
}
