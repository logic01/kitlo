export type DisputeStatus = 'open' | 'evidence' | 'mediation' | 'resolved' | 'closed';

export type DisputeReason =
  | 'damage'
  | 'late-return'
  | 'no-show'
  | 'misrepresented'
  | 'other';

export type DisputeResolution =
  | 'refund-renter-full'
  | 'refund-renter-partial'
  | 'release-lister-full'
  | 'release-lister-partial'
  | 'split';

export interface DisputeEvidence {
  id: string;
  uploadedById: string;
  uploadedAt: string;
  kind: 'photo' | 'message' | 'note';
  url?: string;
  text?: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  filedById: string;
  filedByName: string;
  filedAt: string;
  status: DisputeStatus;
  reason: DisputeReason;
  reasonLabel: string;
  summary: string;
  evidence: DisputeEvidence[];
  amountInDisputeCents: number;
  resolution?: DisputeResolution;
  resolvedAt?: string;
  resolutionNote?: string;
}
