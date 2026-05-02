import type { BookingSummary, BookingTimelineEvent } from '../models/booking';

export const MOCK_BOOKINGS: BookingSummary[] = [
  {
    id: 'bk-001',
    status: 'confirmed',
    startDate: '2026-05-12',
    endDate: '2026-05-15',
    gearTitle: 'Pulsar Thermion 2 XQ50 Pro',
    gearPhotoUrl:
      'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=600&q=80',
    counterpartyName: 'Jess Park',
    totalCents: 49620,
  },
  {
    id: 'bk-002',
    status: 'active',
    startDate: '2026-04-28',
    endDate: '2026-05-02',
    gearTitle: 'ATN X-Sight 4K Pro',
    gearPhotoUrl:
      'https://images.unsplash.com/photo-1535381273077-21e815afe1ce?auto=format&fit=crop&w=600&q=80',
    counterpartyName: 'Tyler Reed',
    totalCents: 39200,
  },
  {
    id: 'bk-003',
    status: 'returned',
    startDate: '2026-04-15',
    endDate: '2026-04-19',
    gearTitle: 'Pulsar Axion 2 LRF XQ35 Pro Monocular',
    gearPhotoUrl:
      'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=600&q=80',
    counterpartyName: 'Casey Morgan',
    totalCents: 30100,
  },
  {
    id: 'bk-004',
    status: 'completed',
    startDate: '2026-03-20',
    endDate: '2026-03-23',
    gearTitle: 'Vortex Razor HD 27-60x85 Spotter',
    gearPhotoUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=600&q=80',
    counterpartyName: 'Jess Park',
    totalCents: 13680,
  },
  {
    id: 'bk-005',
    status: 'completed',
    startDate: '2026-02-08',
    endDate: '2026-02-11',
    gearTitle: 'AGM Rattler TS35-384 Thermal Scope',
    gearPhotoUrl:
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=600&q=80',
    counterpartyName: 'Tyler Reed',
    totalCents: 32490,
  },
  {
    id: 'bk-006',
    status: 'disputed',
    startDate: '2026-04-02',
    endDate: '2026-04-05',
    gearTitle: 'Sig Sauer Tango4 4-16x44',
    gearPhotoUrl:
      'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?auto=format&fit=crop&w=600&q=80',
    counterpartyName: 'Casey Morgan',
    totalCents: 11970,
  },
  {
    id: 'bk-007',
    status: 'cancelled',
    startDate: '2026-04-22',
    endDate: '2026-04-25',
    gearTitle: 'Nocpix ACE H50R LRF Thermal Monocular',
    gearPhotoUrl:
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=600&q=80',
    counterpartyName: 'Tyler Reed',
    totalCents: 27360,
  },
  {
    id: 'bk-008',
    status: 'confirmed',
    startDate: '2026-05-20',
    endDate: '2026-05-26',
    gearTitle: 'Bundle: Pulsar Thermal + ATN NV Combo',
    gearPhotoUrl:
      'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=600&q=80',
    counterpartyName: 'Tyler Reed',
    totalCents: 134400,
  },
];

export const MOCK_BOOKING_TIMELINES: Record<string, BookingTimelineEvent[]> = {
  'bk-001': [
    { id: 'ev-001-1', label: 'Request submitted', occurredAt: '2026-04-22T15:04:00Z', state: 'done' },
    { id: 'ev-001-2', label: 'Lister approved', occurredAt: '2026-04-22T18:11:00Z', state: 'done' },
    { id: 'ev-001-3', label: 'Payment authorized', detail: 'Hold of $546.20 placed', occurredAt: '2026-04-22T18:13:00Z', state: 'done' },
    { id: 'ev-001-4', label: 'Pickup scheduled', detail: 'May 12, 7:30 AM at Boulder REI', occurredAt: '2026-04-25T12:00:00Z', state: 'now' },
  ],
  'bk-002': [
    { id: 'ev-002-1', label: 'Booked', occurredAt: '2026-04-18T10:22:00Z', state: 'done' },
    { id: 'ev-002-2', label: 'Pickup confirmed', detail: 'Both parties signed off on condition', occurredAt: '2026-04-28T07:45:00Z', state: 'done' },
    { id: 'ev-002-3', label: 'Active rental', detail: 'Returns May 2', occurredAt: '2026-04-28T07:45:00Z', state: 'now' },
  ],
  'bk-003': [
    { id: 'ev-003-1', label: 'Booked', occurredAt: '2026-04-08T09:00:00Z', state: 'done' },
    { id: 'ev-003-2', label: 'Pickup confirmed', occurredAt: '2026-04-15T08:00:00Z', state: 'done' },
    { id: 'ev-003-3', label: 'Returned', detail: 'Lister to confirm condition', occurredAt: '2026-04-19T17:30:00Z', state: 'done' },
    { id: 'ev-003-4', label: 'Awaiting return confirmation', detail: 'Funds release after both sides confirm', occurredAt: '2026-04-19T17:30:00Z', state: 'alert' },
  ],
  'bk-004': [
    { id: 'ev-004-1', label: 'Booked', occurredAt: '2026-03-12T14:00:00Z', state: 'done' },
    { id: 'ev-004-2', label: 'Pickup', occurredAt: '2026-03-20T07:30:00Z', state: 'done' },
    { id: 'ev-004-3', label: 'Returned', occurredAt: '2026-03-23T18:00:00Z', state: 'done' },
    { id: 'ev-004-4', label: 'Funds released', detail: '$120.38 paid to lister', occurredAt: '2026-03-24T03:00:00Z', state: 'done' },
    { id: 'ev-004-5', label: 'Reviews complete', occurredAt: '2026-03-25T19:42:00Z', state: 'done' },
  ],
  'bk-006': [
    { id: 'ev-006-1', label: 'Booked', occurredAt: '2026-03-26T11:11:00Z', state: 'done' },
    { id: 'ev-006-2', label: 'Pickup', occurredAt: '2026-04-02T08:00:00Z', state: 'done' },
    { id: 'ev-006-3', label: 'Returned with damage', detail: 'Renter reports lister-side malfunction; lister claims renter damage', occurredAt: '2026-04-05T17:00:00Z', state: 'alert' },
    { id: 'ev-006-4', label: 'Dispute opened', detail: 'Admin review in progress', occurredAt: '2026-04-06T09:30:00Z', state: 'now' },
  ],
};
