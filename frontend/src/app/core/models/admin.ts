export type QueueReason = 'high-value' | 'flagged';

export interface AdminQueueItem {
  id: string;
  name: string;
  meta: string[];
  reason: QueueReason;
  reasonLabel: string;
  slaHoursRemaining: number;
}
