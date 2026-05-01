import type { ProfileSummary, User } from '../models/user';

export const MOCK_USERS: User[] = [
  {
    id: 'u-renter-1',
    name: 'Sam Hunter',
    email: 'sam@example.com',
    role: 'renter',
    verified: true,
    city: 'Aurora',
    state: 'CO',
    joinedAt: '2025-09-12',
  },
  {
    id: 'u-renter-2',
    name: 'Robin Cole',
    email: 'robin@example.com',
    role: 'renter',
    verified: true,
    city: 'Boulder',
    state: 'CO',
    joinedAt: '2025-11-03',
  },
  {
    id: 'u-renter-3',
    name: 'Avery Stone',
    email: 'avery@example.com',
    role: 'renter',
    verified: false,
    city: 'Colorado Springs',
    state: 'CO',
    joinedAt: '2026-01-22',
  },
  {
    id: 'u-lister-1',
    name: 'Jess Park',
    email: 'jess@example.com',
    role: 'lister',
    verified: true,
    city: 'Boulder',
    state: 'CO',
    joinedAt: '2025-04-04',
  },
  {
    id: 'u-lister-2',
    name: 'Tyler Reed',
    email: 'tyler@example.com',
    role: 'lister',
    verified: true,
    city: 'Fort Collins',
    state: 'CO',
    joinedAt: '2025-06-18',
  },
  {
    id: 'u-lister-3',
    name: 'Casey Morgan',
    email: 'casey@example.com',
    role: 'lister',
    verified: true,
    city: 'Cheyenne',
    state: 'WY',
    joinedAt: '2025-08-30',
  },
  {
    id: 'u-lister-4',
    name: 'Drew Walker',
    email: 'drew@example.com',
    role: 'lister',
    verified: false,
    city: 'Aurora',
    state: 'CO',
    joinedAt: '2026-02-15',
  },
  {
    id: 'u-admin-1',
    name: 'Lee Brown',
    email: 'lee@kitlo.com',
    role: 'admin',
    verified: true,
    city: 'Denver',
    state: 'CO',
    joinedAt: '2024-11-01',
  },
];

const RATINGS: Record<string, { average: number; count: number }> = {
  'u-lister-1': { average: 4.9, count: 47 },
  'u-lister-2': { average: 4.7, count: 22 },
  'u-lister-3': { average: 4.8, count: 14 },
  'u-lister-4': { average: 0, count: 0 },
  'u-renter-1': { average: 5.0, count: 8 },
  'u-renter-2': { average: 4.9, count: 5 },
  'u-renter-3': { average: 0, count: 0 },
};

export const MOCK_PROFILES: ProfileSummary[] = MOCK_USERS.map((u) => ({
  id: u.id,
  name: u.name,
  city: u.city,
  state: u.state,
  avatarUrl: u.avatarUrl,
  verified: u.verified,
  rating: RATINGS[u.id]?.count ? RATINGS[u.id] : undefined,
  primaryGear:
    u.id === 'u-lister-1' ? 'Thermal optics' :
    u.id === 'u-lister-2' ? 'Night-vision & rifles' :
    u.id === 'u-lister-3' ? 'Bows & treestands' :
    undefined,
  primaryRateCents:
    u.id === 'u-lister-1' ? 14500 :
    u.id === 'u-lister-2' ? 8500 :
    u.id === 'u-lister-3' ? 6500 :
    undefined,
}));

export const userById = (id: string): User | undefined =>
  MOCK_USERS.find((u) => u.id === id);
