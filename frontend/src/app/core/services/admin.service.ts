import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { AdminQueueItem } from '../models/admin';
import type { Dispute, DisputeResolution, DisputeStatus } from '../models/dispute';
import type { User, UserRole } from '../models/user';

export interface AdminStats {
  listingsQueueCount: number;
  disputeQueueCount: number;
  verificationQueueCount: number;
  slaBreachCount: number;
}

export interface ListingQueueQuery {
  reason?: 'high-value' | 'flagged';
  page?: number;
}

export interface UserSearchQuery {
  search?: string;
  status?: UserStatus;
}

export type UserStatus = 'active' | 'warned' | 'restricted' | 'suspended' | 'banned';

export interface UserAdminRecord {
  user: User;
  status: UserStatus;
  flags: string[];
  warnings: number;
}

export interface UserAdminAction {
  reason: string;
  durationDays?: number;
}

interface BackendUser {
  id: string;
  email: string;
  name: string;
  role: string;
  verified: boolean;
  city?: string | null;
  state?: string | null;
  avatarUrl?: string | null;
  joinedAt: string;
  status?: string;
}

interface BackendQueueItem {
  id: string;
  name: string;
  meta: string[];
  reason: string;
  reasonLabel: string;
  slaHoursRemaining: number;
}

const STATUSES: DisputeStatus[] = ['open', 'evidence', 'mediation', 'resolved', 'closed'];
const RESOLUTIONS: DisputeResolution[] = [
  'refund-renter-full',
  'refund-renter-partial',
  'release-lister-full',
  'release-lister-partial',
  'split',
];

function mapUser(b: BackendUser): User {
  return {
    id: b.id,
    name: b.name,
    email: b.email,
    role: (b.role as UserRole) ?? 'renter',
    verified: b.verified,
    city: b.city ?? undefined,
    state: b.state ?? undefined,
    avatarUrl: b.avatarUrl ?? undefined,
    joinedAt: b.joinedAt,
  };
}

function mapQueueItem(b: BackendQueueItem): AdminQueueItem {
  return {
    id: b.id,
    name: b.name,
    meta: b.meta,
    reason: (b.reason === 'high-value' ? 'high-value' : 'flagged') as AdminQueueItem['reason'],
    reasonLabel: b.reasonLabel,
    slaHoursRemaining: b.slaHoursRemaining,
  };
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin`;
  private readonly disputeBase = `${environment.apiUrl}/disputes`;

  getStats(): Observable<AdminStats> {
    return this.http
      .get<{ listingsPending: number; disputesOpen: number; verificationsPending: number }>(`${this.base}/stats`)
      .pipe(
        map((s) => ({
          listingsQueueCount: s.listingsPending,
          disputeQueueCount: s.disputesOpen,
          verificationQueueCount: s.verificationsPending,
          slaBreachCount: 0,
        })),
      );
  }

  getListingQueue(query: ListingQueueQuery = {}): Observable<AdminQueueItem[]> {
    return this.http.get<BackendQueueItem[]>(`${this.base}/listings`).pipe(
      map((items) => {
        const mapped = items.map(mapQueueItem);
        return query.reason ? mapped.filter((q) => q.reason === query.reason) : mapped;
      }),
    );
  }

  approveListing(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/listings/${id}/approve`, {});
  }

  rejectListing(id: string, reason: string): Observable<void> {
    return this.http.post<void>(`${this.base}/listings/${id}/reject`, { note: reason });
  }

  /** Backend doesn't yet distinguish "request changes" from reject — collapsed for now. */
  requestListingChanges(id: string, reasons: string[]): Observable<void> {
    return this.rejectListing(id, reasons.join('; '));
  }

  escalateListing(_id: string): Observable<void> {
    // No backend endpoint yet; surface the action as a no-op so the UI doesn't break.
    return of(undefined);
  }

  getDisputeQueue(): Observable<AdminQueueItem[]> {
    return this.http
      .get<{ items: { id: string; reasonLabel: string; filedByName: string; amountInDisputeCents: number; status: number; filedAt: string }[] }>(this.disputeBase, {
        params: new HttpParams().set('status', '0'),
      })
      .pipe(
        map((r) =>
          r.items.map((d) => {
            const hoursElapsed = Math.max(0, (Date.now() - new Date(d.filedAt).getTime()) / 3_600_000);
            const sla = Math.max(0, Math.ceil(48 - hoursElapsed));
            return {
              id: d.id,
              name: d.reasonLabel,
              meta: [d.filedByName, `$${(d.amountInDisputeCents / 100).toFixed(0)}`],
              reason: 'flagged' as const,
              reasonLabel: STATUSES[d.status] ?? 'open',
              slaHoursRemaining: sla,
            };
          }),
        ),
      );
  }

  ruleDispute(id: string, resolution: DisputeResolution, note: string): Observable<Dispute> {
    return this.http
      .put<{ id: string }>(`${this.disputeBase}/${id}/resolution`, {
        resolution: RESOLUTIONS.indexOf(resolution),
        note,
      })
      .pipe(map(() => ({} as Dispute))); // caller refetches to display
  }

  messageDisputeParty(_disputeId: string, _partyId: string, _body: string): Observable<void> {
    return of(undefined);
  }

  reopenDispute(_id: string): Observable<Dispute> {
    return of({} as Dispute);
  }

  /** Verification queue endpoint is owed; surface empty list for now. */
  getVerificationQueue(): Observable<AdminQueueItem[]> {
    return of([]);
  }

  searchUsers(query: UserSearchQuery = {}): Observable<UserAdminRecord[]> {
    let params = new HttpParams();
    if (query.search) params = params.set('q', query.search);
    return this.http
      .get<{ items: BackendUser[] }>(`${this.base}/users`, { params })
      .pipe(
        map((r) =>
          r.items.map((u) => ({
            user: mapUser(u),
            status: (u.status as UserStatus | undefined) ?? 'active',
            flags: [],
            warnings: 0,
          })),
        ),
      );
  }

  getUserRecord(id: string): Observable<UserAdminRecord> {
    return this.http.get<BackendUser>(`${this.base}/users/${id}`).pipe(
      map((u) => ({
        user: mapUser(u),
        status: (u.status as UserStatus | undefined) ?? 'active',
        flags: [],
        warnings: 0,
      })),
    );
  }

  warnUser(id: string, action: UserAdminAction): Observable<void> {
    return this.applyUserStatus(id, 'warn', action.reason);
  }
  restrictUser(id: string, action: UserAdminAction): Observable<void> {
    return this.applyUserStatus(id, 'restrict', action.reason);
  }
  suspendUser(id: string, action: UserAdminAction): Observable<void> {
    return this.applyUserStatus(id, 'suspend', action.reason);
  }
  banUser(id: string, action: UserAdminAction): Observable<void> {
    return this.applyUserStatus(id, 'ban', action.reason);
  }
  reinstateUser(id: string): Observable<void> {
    return this.applyUserStatus(id, 'reinstate');
  }

  private applyUserStatus(id: string, action: string, note?: string): Observable<void> {
    return this.http
      .put<unknown>(`${this.base}/users/${id}/status`, { action, note })
      .pipe(map(() => undefined));
  }
}
