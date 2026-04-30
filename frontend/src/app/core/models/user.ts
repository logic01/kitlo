export type UserRole = 'renter' | 'lister' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  verified: boolean;
  city?: string;
  state?: string;
  joinedAt: string;
}

export interface ProfileSummary {
  id: string;
  name: string;
  city?: string;
  state?: string;
  avatarUrl?: string;
  verified: boolean;
  rating?: { average: number; count: number };
  primaryGear?: string;
  primaryRateCents?: number;
}
