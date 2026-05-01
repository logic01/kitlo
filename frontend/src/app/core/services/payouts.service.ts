import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { EarningsSummary, Payout } from '../models/payout';
import { MOCK_EARNINGS_SUMMARY, MOCK_PAYOUTS } from '../mock-data';
import { mockResponse } from './mock-response';

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

const DEFAULT_PAGE_SIZE = 20;

@Injectable({ providedIn: 'root' })
export class PayoutsService {
  private payouts: Payout[] = MOCK_PAYOUTS.map((p) => ({ ...p }));
  private summary: EarningsSummary = { ...MOCK_EARNINGS_SUMMARY };

  getSummary(): Observable<EarningsSummary> {
    return mockResponse({ ...this.summary });
  }

  getHistory(page = 1, pageSize = DEFAULT_PAGE_SIZE): Observable<PayoutPage> {
    const sorted = [...this.payouts].sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));
    const start = (page - 1) * pageSize;
    return mockResponse({
      items: sorted.slice(start, start + pageSize).map((p) => ({ ...p })),
      total: sorted.length,
      page,
      pageSize,
    });
  }

  getByListing(): Observable<ListingEarnings[]> {
    const grouped = new Map<string, ListingEarnings>();
    for (const p of this.payouts) {
      const existing = grouped.get(p.listingTitle);
      if (existing) {
        existing.bookingsCount += 1;
        existing.netCents += p.netCents;
      } else {
        grouped.set(p.listingTitle, { listingTitle: p.listingTitle, bookingsCount: 1, netCents: p.netCents });
      }
    }
    return mockResponse([...grouped.values()].sort((a, b) => b.netCents - a.netCents));
  }

  exportCsv(): Observable<string> {
    const header = 'id,bookingId,listingTitle,rentalDays,grossCents,platformFeeCents,netCents,status,scheduledFor,paidAt';
    const rows = this.payouts.map((p) =>
      [p.id, p.bookingId, `"${p.listingTitle.replace(/"/g, '""')}"`, p.rentalDays, p.grossCents, p.platformFeeCents, p.netCents, p.status, p.scheduledFor, p.paidAt ?? ''].join(','),
    );
    return mockResponse([header, ...rows].join('\n'), 250);
  }
}
