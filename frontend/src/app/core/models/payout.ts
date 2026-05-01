export type PayoutStatus = 'scheduled' | 'in-transit' | 'paid' | 'failed';

export interface Payout {
  id: string;
  bookingId: string;
  listingTitle: string;
  rentalDays: number;
  grossCents: number;
  platformFeeCents: number;
  netCents: number;
  status: PayoutStatus;
  scheduledFor: string;
  paidAt?: string;
  bankLast4?: string;
}

export interface EarningsSummary {
  lifetimeCents: number;
  pendingCents: number;
  thisMonthCents: number;
  bookingsCount: number;
  averageDailyRateCents: number;
}
