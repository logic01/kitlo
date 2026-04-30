export type ReviewAccuracy = 'accurate' | 'somewhat' | 'inaccurate';

export interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatarUrl?: string;
  reviewedAt: string;
  rating: 1 | 2 | 3 | 4 | 5;
  accuracy?: ReviewAccuracy;
  text: string;
  tags?: string[];
}
