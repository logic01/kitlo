import type { Message, MessageThread } from '../models/message';

export const MOCK_MESSAGE_THREADS: MessageThread[] = [
  {
    id: 'th-001',
    participantIds: ['u-renter-1', 'u-lister-1'],
    participantName: 'Jess Park',
    bookingId: 'bk-001',
    listingId: 'lst-001',
    lastMessagePreview: 'Sounds good — see you Tuesday at 7:30.',
    lastMessageAt: '2026-04-29T14:22:00Z',
    unreadCount: 0,
  },
  {
    id: 'th-002',
    participantIds: ['u-renter-1', 'u-lister-2'],
    participantName: 'Tyler Reed',
    bookingId: 'bk-002',
    listingId: 'lst-002',
    lastMessagePreview: 'Battery topped off — should last the whole sit.',
    lastMessageAt: '2026-04-28T07:30:00Z',
    unreadCount: 2,
  },
  {
    id: 'th-003',
    participantIds: ['u-renter-2', 'u-lister-3'],
    participantName: 'Casey Morgan',
    bookingId: 'bk-006',
    listingId: 'lst-010',
    lastMessagePreview: 'I have photos and timestamps from the return.',
    lastMessageAt: '2026-04-06T09:11:00Z',
    unreadCount: 1,
  },
  {
    id: 'th-004',
    participantIds: ['u-renter-3', 'u-lister-1'],
    participantName: 'Avery Stone',
    listingId: 'lst-005',
    lastMessagePreview: 'Is the spotter available the weekend of the 16th?',
    lastMessageAt: '2026-04-30T08:50:00Z',
    unreadCount: 1,
  },
];

export const MOCK_MESSAGES_BY_THREAD: Record<string, Message[]> = {
  'th-001': [
    {
      id: 'm-001-1',
      threadId: 'th-001',
      senderId: 'u-renter-1',
      body: 'Hey Jess, just booked the XQ50 for the 12th–15th. What time works for pickup?',
      sentAt: '2026-04-22T18:20:00Z',
      read: true,
    },
    {
      id: 'm-001-2',
      threadId: 'th-001',
      senderId: 'u-lister-1',
      body: 'Hi Sam — congrats on the trip. I can meet at Boulder REI 7:30 AM Tuesday.',
      sentAt: '2026-04-22T19:01:00Z',
      read: true,
    },
    {
      id: 'm-001-3',
      threadId: 'th-001',
      senderId: 'u-renter-1',
      body: 'Sounds good — see you Tuesday at 7:30.',
      sentAt: '2026-04-29T14:22:00Z',
      read: true,
    },
  ],
  'th-002': [
    {
      id: 'm-002-1',
      threadId: 'th-002',
      senderId: 'u-lister-2',
      body: 'Heads up — battery topped off, should last the whole sit.',
      sentAt: '2026-04-28T07:30:00Z',
      read: false,
    },
    {
      id: 'm-002-2',
      threadId: 'th-002',
      senderId: 'u-lister-2',
      body: 'Backup pack of CR123s in the case if you need them.',
      sentAt: '2026-04-28T07:31:00Z',
      read: false,
    },
  ],
  'th-003': [
    {
      id: 'm-003-1',
      threadId: 'th-003',
      senderId: 'u-renter-2',
      body: 'Scope had glass clarity issues out of the box, definitely not how it was when I picked it up.',
      sentAt: '2026-04-05T18:14:00Z',
      read: true,
    },
    {
      id: 'm-003-2',
      threadId: 'th-003',
      senderId: 'u-lister-3',
      body: 'I have photos and timestamps from the return.',
      sentAt: '2026-04-06T09:11:00Z',
      read: false,
    },
  ],
  'th-004': [
    {
      id: 'm-004-1',
      threadId: 'th-004',
      senderId: 'u-renter-3',
      body: 'Is the spotter available the weekend of the 16th?',
      sentAt: '2026-04-30T08:50:00Z',
      read: false,
    },
  ],
};
