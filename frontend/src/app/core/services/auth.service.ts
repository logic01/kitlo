import { Injectable, computed, signal } from '@angular/core';
import type { User, UserRole } from '../models/user';

const STORAGE_KEY = 'kitlo_current_user';

const SEED_USERS: Record<string, User> = {
  renter: {
    id: 'u-renter-1',
    name: 'Sam Hunter',
    email: 'sam@example.com',
    role: 'renter',
    verified: true,
    city: 'Aurora',
    state: 'CO',
    joinedAt: '2025-09-12',
  },
  lister: {
    id: 'u-lister-1',
    name: 'Jess Park',
    email: 'jess@example.com',
    role: 'lister',
    verified: true,
    city: 'Boulder',
    state: 'CO',
    joinedAt: '2025-04-04',
  },
  admin: {
    id: 'u-admin-1',
    name: 'Lee Brown',
    email: 'lee@kitlo.com',
    role: 'admin',
    verified: true,
    city: 'Denver',
    state: 'CO',
    joinedAt: '2024-11-01',
  },
};

export interface SignupInput {
  name: string;
  email: string;
  intent: 'renter' | 'lister' | 'both';
}

/**
 * Mock auth — no JWT, no backend. Persists current user in localStorage so route
 * guards survive reload. Real Stripe-backed JWT lands in 5.3.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<User | null>(this.readStorage());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly role = computed<UserRole | null>(() => this._currentUser()?.role ?? null);

  login(email: string, _password: string): User {
    const user = this.findByEmail(email) ?? SEED_USERS['renter'];
    this.setUser(user);
    return user;
  }

  signup(input: SignupInput): User {
    const role: UserRole = input.intent === 'lister' ? 'lister' : 'renter';
    const user: User = {
      id: `u-${Math.random().toString(36).slice(2, 9)}`,
      name: input.name,
      email: input.email,
      role,
      verified: false,
      joinedAt: new Date().toISOString(),
    };
    this.setUser(user);
    return user;
  }

  logout(): void {
    this.setUser(null);
  }

  /** Dev-only: swap to one of the seed users without going through login. */
  switchTo(role: UserRole | 'guest'): void {
    if (role === 'guest') {
      this.setUser(null);
      return;
    }
    this.setUser(SEED_USERS[role]);
  }

  private setUser(user: User | null): void {
    this._currentUser.set(user);
    if (typeof localStorage === 'undefined') return;
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }

  private readStorage(): User | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private findByEmail(email: string): User | null {
    const e = email.trim().toLowerCase();
    return Object.values(SEED_USERS).find((u) => u.email === e) ?? null;
  }
}
