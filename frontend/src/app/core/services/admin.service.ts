import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { AdminQueueItem } from '../models/admin';
import type { Dispute, DisputeResolution } from '../models/dispute';
import type { User } from '../models/user';
import {
  MOCK_DISPUTES,
  MOCK_DISPUTE_QUEUE,
  MOCK_LISTING_REVIEW_QUEUE,
  MOCK_USERS,
  MOCK_VERIFICATION_QUEUE,
} from '../mock-data';
import { mockError, mockResponse, nowIso } from './mock-response';

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

@Injectable({ providedIn: 'root' })
export class AdminService {
  private listingQueue: AdminQueueItem[] = MOCK_LISTING_REVIEW_QUEUE.map((q) => ({ ...q }));
  private disputeQueue: AdminQueueItem[] = MOCK_DISPUTE_QUEUE.map((q) => ({ ...q }));
  private verificationQueue: AdminQueueItem[] = MOCK_VERIFICATION_QUEUE.map((q) => ({ ...q }));
  private disputes: Dispute[] = MOCK_DISPUTES.map((d) => ({ ...d, evidence: d.evidence.map((e) => ({ ...e })) }));
  private userStatuses: Record<string, UserStatus> = {};

  getStats(): Observable<AdminStats> {
    const slaBreachCount = [
      ...this.listingQueue,
      ...this.disputeQueue,
      ...this.verificationQueue,
    ].filter((q) => q.slaHoursRemaining < 6).length;
    return mockResponse({
      listingsQueueCount: this.listingQueue.length,
      disputeQueueCount: this.disputeQueue.length,
      verificationQueueCount: this.verificationQueue.length,
      slaBreachCount,
    });
  }

  getListingQueue(query: ListingQueueQuery = {}): Observable<AdminQueueItem[]> {
    const filtered = query.reason
      ? this.listingQueue.filter((q) => q.reason === query.reason)
      : this.listingQueue;
    return mockResponse(filtered.map((q) => ({ ...q })));
  }

  approveListing(id: string): Observable<void> {
    this.listingQueue = this.listingQueue.filter((q) => q.id !== id);
    return mockResponse(undefined);
  }

  rejectListing(id: string, _reason: string): Observable<void> {
    this.listingQueue = this.listingQueue.filter((q) => q.id !== id);
    return mockResponse(undefined);
  }

  requestListingChanges(id: string, _reasons: string[]): Observable<void> {
    if (!this.listingQueue.some((q) => q.id === id)) return mockError(`Listing ${id} not in queue`);
    return mockResponse(undefined);
  }

  escalateListing(id: string): Observable<void> {
    if (!this.listingQueue.some((q) => q.id === id)) return mockError(`Listing ${id} not in queue`);
    return mockResponse(undefined);
  }

  getDisputeQueue(): Observable<AdminQueueItem[]> {
    return mockResponse(this.disputeQueue.map((q) => ({ ...q })));
  }

  ruleDispute(id: string, resolution: DisputeResolution, note: string): Observable<Dispute> {
    const idx = this.disputes.findIndex((d) => d.id === id);
    if (idx < 0) return mockError(`Dispute ${id} not found`);
    const next: Dispute = {
      ...this.disputes[idx],
      status: 'resolved',
      resolution,
      resolutionNote: note,
      resolvedAt: nowIso(),
    };
    this.disputes[idx] = next;
    this.disputeQueue = this.disputeQueue.filter((q) => q.id !== id);
    return mockResponse({ ...next, evidence: next.evidence.map((e) => ({ ...e })) });
  }

  messageDisputeParty(disputeId: string, _partyId: string, _body: string): Observable<void> {
    if (!this.disputes.some((d) => d.id === disputeId)) return mockError(`Dispute ${disputeId} not found`);
    return mockResponse(undefined);
  }

  reopenDispute(id: string): Observable<Dispute> {
    const idx = this.disputes.findIndex((d) => d.id === id);
    if (idx < 0) return mockError(`Dispute ${id} not found`);
    const next: Dispute = { ...this.disputes[idx], status: 'mediation', resolvedAt: undefined };
    this.disputes[idx] = next;
    return mockResponse({ ...next, evidence: next.evidence.map((e) => ({ ...e })) });
  }

  getVerificationQueue(): Observable<AdminQueueItem[]> {
    return mockResponse(this.verificationQueue.map((q) => ({ ...q })));
  }

  searchUsers(query: UserSearchQuery = {}): Observable<UserAdminRecord[]> {
    const term = query.search?.trim().toLowerCase() ?? '';
    const records = MOCK_USERS.filter((u) => {
      if (!term) return true;
      return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
    }).map<UserAdminRecord>((user) => ({
      user: { ...user },
      status: this.userStatuses[user.id] ?? 'active',
      flags: [],
      warnings: 0,
    }));
    const filtered = query.status ? records.filter((r) => r.status === query.status) : records;
    return mockResponse(filtered);
  }

  getUserRecord(id: string): Observable<UserAdminRecord> {
    const user = MOCK_USERS.find((u) => u.id === id);
    if (!user) return mockError(`User ${id} not found`);
    return mockResponse({
      user: { ...user },
      status: this.userStatuses[id] ?? 'active',
      flags: [],
      warnings: 0,
    });
  }

  warnUser(id: string, _action: UserAdminAction): Observable<void> {
    if (!MOCK_USERS.some((u) => u.id === id)) return mockError(`User ${id} not found`);
    this.userStatuses[id] = 'warned';
    return mockResponse(undefined);
  }

  restrictUser(id: string, _action: UserAdminAction): Observable<void> {
    if (!MOCK_USERS.some((u) => u.id === id)) return mockError(`User ${id} not found`);
    this.userStatuses[id] = 'restricted';
    return mockResponse(undefined);
  }

  suspendUser(id: string, _action: UserAdminAction): Observable<void> {
    if (!MOCK_USERS.some((u) => u.id === id)) return mockError(`User ${id} not found`);
    this.userStatuses[id] = 'suspended';
    return mockResponse(undefined);
  }

  banUser(id: string, _action: UserAdminAction): Observable<void> {
    if (!MOCK_USERS.some((u) => u.id === id)) return mockError(`User ${id} not found`);
    this.userStatuses[id] = 'banned';
    return mockResponse(undefined);
  }

  reinstateUser(id: string): Observable<void> {
    if (!MOCK_USERS.some((u) => u.id === id)) return mockError(`User ${id} not found`);
    this.userStatuses[id] = 'active';
    return mockResponse(undefined);
  }
}
