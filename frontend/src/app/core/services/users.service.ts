import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ProfileSummary, User } from '../models/user';
import { MOCK_PROFILES, MOCK_USERS } from '../mock-data';
import { AuthService } from './auth.service';
import { generateId, mockError, mockResponse, nowIso } from './mock-response';

export interface NotificationPreferences {
  emailBookingUpdates: boolean;
  emailMessages: boolean;
  emailMarketing: boolean;
  pushBookingUpdates: boolean;
  pushMessages: boolean;
  smsBookingReminders: boolean;
}

export interface OnboardingStatus {
  profileComplete: boolean;
  identityVerified: boolean;
  bankConnected: boolean;
  listerAgreementSigned: boolean;
  firstListingPublished: boolean;
}

export interface PublicProfile {
  user: User;
  profile: ProfileSummary;
  listerSince?: string;
  totalRentals: number;
  responseHours: number;
}

const DEFAULT_PREFS: NotificationPreferences = {
  emailBookingUpdates: true,
  emailMessages: true,
  emailMarketing: false,
  pushBookingUpdates: true,
  pushMessages: true,
  smsBookingReminders: false,
};

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly auth = inject(AuthService);
  private users: User[] = MOCK_USERS.map((u) => ({ ...u }));
  private profiles: ProfileSummary[] = MOCK_PROFILES.map((p) => ({ ...p }));
  private prefs: Record<string, NotificationPreferences> = {};
  private onboarding: Record<string, OnboardingStatus> = {};
  private agreementsSignedAt: Record<string, string> = {};

  getMe(): Observable<User> {
    const me = this.auth.currentUser();
    if (!me) return mockError('Not authenticated');
    const stored = this.users.find((u) => u.id === me.id);
    return mockResponse({ ...(stored ?? me) });
  }

  getProfile(id: string): Observable<ProfileSummary> {
    const profile = this.profiles.find((p) => p.id === id);
    if (!profile) return mockError(`Profile ${id} not found`);
    return mockResponse({ ...profile });
  }

  getPublicProfile(id: string): Observable<PublicProfile> {
    const user = this.users.find((u) => u.id === id);
    const profile = this.profiles.find((p) => p.id === id);
    if (!user || !profile) return mockError(`User ${id} not found`);
    return mockResponse({
      user: { ...user },
      profile: { ...profile },
      listerSince: user.role === 'lister' ? user.joinedAt : undefined,
      totalRentals: profile.rating?.count ?? 0,
      responseHours: 4,
    });
  }

  updateProfile(patch: Partial<User>): Observable<User> {
    const me = this.auth.currentUser();
    if (!me) return mockError('Not authenticated');
    const idx = this.users.findIndex((u) => u.id === me.id);
    if (idx < 0) {
      const created = { ...me, ...patch };
      this.users.push(created);
      return mockResponse({ ...created });
    }
    const next = { ...this.users[idx], ...patch, id: me.id };
    this.users[idx] = next;
    return mockResponse({ ...next });
  }

  saveIntent(intent: 'renter' | 'lister' | 'both'): Observable<void> {
    const me = this.auth.currentUser();
    if (!me) return mockError('Not authenticated');
    const role = intent === 'lister' ? 'lister' : 'renter';
    const idx = this.users.findIndex((u) => u.id === me.id);
    if (idx >= 0) this.users[idx] = { ...this.users[idx], role };
    return mockResponse(undefined);
  }

  uploadProfilePhoto(_file: File | Blob): Observable<string> {
    const url = `https://images.unsplash.com/photo-${generateId('av')}?auto=format&fit=crop&w=240&q=80`;
    const me = this.auth.currentUser();
    if (me) {
      const idx = this.users.findIndex((u) => u.id === me.id);
      if (idx >= 0) this.users[idx] = { ...this.users[idx], avatarUrl: url };
    }
    return mockResponse(url, 400);
  }

  getNotificationPreferences(): Observable<NotificationPreferences> {
    const me = this.auth.currentUser();
    if (!me) return mockError('Not authenticated');
    return mockResponse({ ...(this.prefs[me.id] ?? DEFAULT_PREFS) });
  }

  updateNotificationPreferences(prefs: Partial<NotificationPreferences>): Observable<NotificationPreferences> {
    const me = this.auth.currentUser();
    if (!me) return mockError('Not authenticated');
    const next = { ...(this.prefs[me.id] ?? DEFAULT_PREFS), ...prefs };
    this.prefs[me.id] = next;
    return mockResponse({ ...next });
  }

  getOnboardingStatus(): Observable<OnboardingStatus> {
    const me = this.auth.currentUser();
    if (!me) return mockError('Not authenticated');
    const status = this.onboarding[me.id] ?? {
      profileComplete: !!me.city && !!me.state,
      identityVerified: me.verified,
      bankConnected: false,
      listerAgreementSigned: !!this.agreementsSignedAt[me.id],
      firstListingPublished: false,
    };
    return mockResponse({ ...status });
  }

  recordListerAgreement(): Observable<{ signedAt: string }> {
    const me = this.auth.currentUser();
    if (!me) return mockError('Not authenticated');
    const signedAt = nowIso();
    this.agreementsSignedAt[me.id] = signedAt;
    return mockResponse({ signedAt });
  }
}
