import type { BookingStatus } from '../../shared/components/status-badge/status-badge';

export interface BookingSummary {
  id: string;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  gearTitle: string;
  gearPhotoUrl: string;
  counterpartyName: string;
  counterpartyAvatarUrl?: string;
  totalCents: number;
}

export interface BookingTimelineEvent {
  id: string;
  label: string;
  detail?: string;
  occurredAt: string;
  state: 'done' | 'now' | 'alert';
}
