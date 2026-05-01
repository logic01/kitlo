export type NotificationKind =
  | 'booking-request'
  | 'booking-confirmed'
  | 'booking-reminder'
  | 'message'
  | 'review-received'
  | 'payout-released'
  | 'dispute'
  | 'admin-action'
  | 'system';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  link?: string;
}
