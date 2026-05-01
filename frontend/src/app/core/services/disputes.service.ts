import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import type {
  Dispute,
  DisputeEvidence,
  DisputeReason,
  DisputeResolution,
  DisputeStatus,
} from '../models/dispute';
import { MOCK_DISPUTES } from '../mock-data';
import { AuthService } from './auth.service';
import { generateId, mockError, mockResponse, nowIso } from './mock-response';

export interface DisputeListQuery {
  status?: DisputeStatus | DisputeStatus[];
  bookingId?: string;
}

export interface FileDisputeInput {
  bookingId: string;
  reason: DisputeReason;
  reasonLabel: string;
  summary: string;
  amountInDisputeCents: number;
  filedByName: string;
}

export interface AddEvidenceInput {
  kind: DisputeEvidence['kind'];
  url?: string;
  text?: string;
}

export interface ResolveDisputeInput {
  resolution: DisputeResolution;
  resolutionNote: string;
}

@Injectable({ providedIn: 'root' })
export class DisputesService {
  private readonly auth = inject(AuthService);
  private disputes: Dispute[] = MOCK_DISPUTES.map((d) => ({ ...d, evidence: d.evidence.map((e) => ({ ...e })) }));

  list(query: DisputeListQuery = {}): Observable<Dispute[]> {
    const statuses = Array.isArray(query.status) ? query.status : query.status ? [query.status] : null;
    const filtered = this.disputes.filter((d) => {
      if (statuses && !statuses.includes(d.status)) return false;
      if (query.bookingId && d.bookingId !== query.bookingId) return false;
      return true;
    });
    return mockResponse(filtered.map((d) => ({ ...d, evidence: d.evidence.map((e) => ({ ...e })) })));
  }

  getById(id: string): Observable<Dispute> {
    const dispute = this.disputes.find((d) => d.id === id);
    if (!dispute) return mockError(`Dispute ${id} not found`);
    return mockResponse({ ...dispute, evidence: dispute.evidence.map((e) => ({ ...e })) });
  }

  file(input: FileDisputeInput): Observable<Dispute> {
    const me = this.auth.currentUser();
    if (!me) return mockError('Not authenticated');
    const dispute: Dispute = {
      id: generateId('dp'),
      bookingId: input.bookingId,
      filedById: me.id,
      filedByName: input.filedByName,
      filedAt: nowIso(),
      status: 'open',
      reason: input.reason,
      reasonLabel: input.reasonLabel,
      summary: input.summary,
      amountInDisputeCents: input.amountInDisputeCents,
      evidence: [],
    };
    this.disputes = [dispute, ...this.disputes];
    return mockResponse({ ...dispute, evidence: [] });
  }

  addEvidence(disputeId: string, input: AddEvidenceInput): Observable<DisputeEvidence> {
    const me = this.auth.currentUser();
    if (!me) return mockError('Not authenticated');
    const idx = this.disputes.findIndex((d) => d.id === disputeId);
    if (idx < 0) return mockError(`Dispute ${disputeId} not found`);
    const evidence: DisputeEvidence = {
      id: generateId('ev-dp'),
      uploadedById: me.id,
      uploadedAt: nowIso(),
      kind: input.kind,
      url: input.url,
      text: input.text,
    };
    this.disputes[idx] = {
      ...this.disputes[idx],
      evidence: [...this.disputes[idx].evidence, evidence],
      status: this.disputes[idx].status === 'open' ? 'evidence' : this.disputes[idx].status,
    };
    return mockResponse({ ...evidence });
  }

  resolve(disputeId: string, input: ResolveDisputeInput): Observable<Dispute> {
    const idx = this.disputes.findIndex((d) => d.id === disputeId);
    if (idx < 0) return mockError(`Dispute ${disputeId} not found`);
    const next: Dispute = {
      ...this.disputes[idx],
      status: 'resolved',
      resolution: input.resolution,
      resolutionNote: input.resolutionNote,
      resolvedAt: nowIso(),
    };
    this.disputes[idx] = next;
    return mockResponse({ ...next, evidence: next.evidence.map((e) => ({ ...e })) });
  }
}
