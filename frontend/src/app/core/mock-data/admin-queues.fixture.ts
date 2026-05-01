import type { AdminQueueItem } from '../models/admin';

export const MOCK_LISTING_REVIEW_QUEUE: AdminQueueItem[] = [
  {
    id: 'lst-009',
    name: 'Pulsar Talion XQ35 Thermal Monocular',
    meta: ['Drew Walker', 'Aurora, CO', '$75/day'],
    reason: 'high-value',
    reasonLabel: 'High-value (>$2,500 retail)',
    slaHoursRemaining: 18,
  },
  {
    id: 'lst-015',
    name: 'Tethrd Phantom Saddle Kit',
    meta: ['Drew Walker', 'Aurora, CO', '$22/day'],
    reason: 'flagged',
    reasonLabel: 'Lister unverified',
    slaHoursRemaining: 36,
  },
  {
    id: 'lst-pending-1',
    name: 'AGM Rattler TS35-384 Thermal Scope',
    meta: ['New lister · Drew Walker', '80016', '$110/day'],
    reason: 'high-value',
    reasonLabel: 'High-value + new lister',
    slaHoursRemaining: 6,
  },
  {
    id: 'lst-pending-2',
    name: 'NightForce ATACR 5-25x56',
    meta: ['Casey Morgan', '82001', '$60/day'],
    reason: 'high-value',
    reasonLabel: 'High-value (>$2,500 retail)',
    slaHoursRemaining: 22,
  },
];

export const MOCK_DISPUTE_QUEUE: AdminQueueItem[] = [
  {
    id: 'dp-001',
    name: 'Sig Sauer Tango4 — booking bk-006',
    meta: ['Filed by Robin Cole', 'Casey Morgan', 'Mediation'],
    reason: 'flagged',
    reasonLabel: 'Item not as described',
    slaHoursRemaining: 4,
  },
  {
    id: 'dp-003',
    name: 'Hoyt RX-7 Ultra — booking bk-003',
    meta: ['Filed by Casey Morgan', 'Sam Hunter', 'Open'],
    reason: 'flagged',
    reasonLabel: 'Damage on return',
    slaHoursRemaining: 28,
  },
];

export const MOCK_VERIFICATION_QUEUE: AdminQueueItem[] = [
  {
    id: 'u-lister-4',
    name: 'Drew Walker',
    meta: ['Aurora, CO', 'Joined Feb 15', 'ID + selfie submitted'],
    reason: 'flagged',
    reasonLabel: 'Awaiting identity check',
    slaHoursRemaining: 12,
  },
];
