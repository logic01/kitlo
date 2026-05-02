import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  Dispute,
  DisputeEvidence,
  DisputeReason,
  DisputeResolution,
  DisputeStatus,
} from '../models/dispute';

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

interface BackendEvidence {
  id: string;
  uploadedById: string;
  uploadedAt: string;
  kind: number;
  url?: string | null;
  text?: string | null;
}

interface BackendDispute {
  id: string;
  bookingId: string;
  filedById: string;
  filedByName: string;
  filedAt: string;
  status: number;
  reason: number;
  reasonLabel: string;
  summary: string;
  amountInDisputeCents: number;
  resolution?: number | null;
  resolvedAt?: string | null;
  resolutionNote?: string | null;
  evidence: BackendEvidence[];
}

const STATUSES: DisputeStatus[] = ['open', 'evidence', 'mediation', 'resolved', 'closed'];
const REASONS: DisputeReason[] = ['damage', 'late-return', 'no-show', 'misrepresented', 'other'];
const RESOLUTIONS: DisputeResolution[] = [
  'refund-renter-full',
  'refund-renter-partial',
  'release-lister-full',
  'release-lister-partial',
  'split',
];
const EVIDENCE_KINDS: DisputeEvidence['kind'][] = ['photo', 'message', 'note'];

function mapEvidence(b: BackendEvidence): DisputeEvidence {
  return {
    id: b.id,
    uploadedById: b.uploadedById,
    uploadedAt: b.uploadedAt,
    kind: EVIDENCE_KINDS[b.kind] ?? 'note',
    url: b.url ?? undefined,
    text: b.text ?? undefined,
  };
}

function mapDispute(b: BackendDispute): Dispute {
  return {
    id: b.id,
    bookingId: b.bookingId,
    filedById: b.filedById,
    filedByName: b.filedByName,
    filedAt: b.filedAt,
    status: STATUSES[b.status] ?? 'open',
    reason: REASONS[b.reason] ?? 'other',
    reasonLabel: b.reasonLabel,
    summary: b.summary,
    amountInDisputeCents: b.amountInDisputeCents,
    resolution: b.resolution != null ? RESOLUTIONS[b.resolution] : undefined,
    resolvedAt: b.resolvedAt ?? undefined,
    resolutionNote: b.resolutionNote ?? undefined,
    evidence: b.evidence.map(mapEvidence),
  };
}

@Injectable({ providedIn: 'root' })
export class DisputesService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/disputes`;

  list(query: DisputeListQuery = {}): Observable<Dispute[]> {
    let params = new HttpParams();
    if (query.status) {
      const list = Array.isArray(query.status) ? query.status : [query.status];
      // The list endpoint accepts a single status; if multiple are requested
      // we issue the first and let the caller filter further.
      params = params.set('status', String(STATUSES.indexOf(list[0])));
    }
    return this.http
      .get<{ items: BackendDispute[] }>(this.base, { params })
      .pipe(
        map((r) => {
          let items = r.items.map(mapDispute);
          if (query.bookingId) items = items.filter((d) => d.bookingId === query.bookingId);
          return items;
        }),
      );
  }

  getById(id: string): Observable<Dispute> {
    return this.http.get<BackendDispute>(`${this.base}/${id}`).pipe(map(mapDispute));
  }

  file(input: FileDisputeInput): Observable<Dispute> {
    return this.http
      .post<BackendDispute>(this.base, {
        bookingId: input.bookingId,
        reason: REASONS.indexOf(input.reason),
        reasonLabel: input.reasonLabel,
        summary: input.summary,
        amountInDisputeCents: input.amountInDisputeCents,
      })
      .pipe(map(mapDispute));
  }

  addEvidence(disputeId: string, input: AddEvidenceInput): Observable<DisputeEvidence> {
    return this.http
      .post<BackendEvidence>(`${this.base}/${disputeId}/evidence`, {
        kind: EVIDENCE_KINDS.indexOf(input.kind),
        url: input.url,
        text: input.text,
      })
      .pipe(map(mapEvidence));
  }

  resolve(disputeId: string, input: ResolveDisputeInput): Observable<Dispute> {
    return this.http
      .put<BackendDispute>(`${this.base}/${disputeId}/resolution`, {
        resolution: RESOLUTIONS.indexOf(input.resolution),
        note: input.resolutionNote,
      })
      .pipe(map(mapDispute));
  }
}
