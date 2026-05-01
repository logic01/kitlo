import type { Review } from '../models/review';

export interface ReviewByListing {
  listingId: string;
  reviews: Review[];
}

export const MOCK_REVIEWS_BY_LISTING: ReviewByListing[] = [
  {
    listingId: 'lst-001',
    reviews: [
      {
        id: 'rv-001-1',
        reviewerName: 'Avery Stone',
        reviewedAt: '2026-03-25',
        rating: 5,
        accuracy: 'accurate',
        text: 'Glass was every bit as advertised. Spotted hogs at 600 yards in moderate humidity. Jess walked me through mounting and zeroing before I left.',
        tags: ['accurate description', 'great communication', 'gear as photographed'],
      },
      {
        id: 'rv-001-2',
        reviewerName: 'Robin Cole',
        reviewedAt: '2026-02-19',
        rating: 5,
        accuracy: 'accurate',
        text: 'Pickup was easy, fully charged batteries included, returned clean.',
        tags: ['easy pickup', 'fully charged'],
      },
    ],
  },
  {
    listingId: 'lst-002',
    reviews: [
      {
        id: 'rv-002-1',
        reviewerName: 'Sam Hunter',
        reviewedAt: '2026-04-12',
        rating: 4,
        accuracy: 'somewhat',
        text: 'Optics solid. Housing has more wear than the photos showed but Tyler was upfront about it when I picked up.',
        tags: ['minor wear', 'fair price'],
      },
    ],
  },
  {
    listingId: 'lst-003',
    reviews: [
      {
        id: 'rv-003-1',
        reviewerName: 'Sam Hunter',
        reviewedAt: '2026-02-13',
        rating: 5,
        accuracy: 'accurate',
        text: 'Sub-MOA on the first three groups. Came with ammo and a sling. Tyler is a pro.',
        tags: ['shoots true', 'ammo included'],
      },
    ],
  },
  {
    listingId: 'lst-004',
    reviews: [
      {
        id: 'rv-004-1',
        reviewerName: 'Robin Cole',
        reviewedAt: '2026-04-21',
        rating: 5,
        accuracy: 'accurate',
        text: 'Bow was already paper-tuned. I made minor adjustments and was hunting in an hour.',
        tags: ['paper tuned', 'quick setup'],
      },
    ],
  },
  {
    listingId: 'lst-005',
    reviews: [
      {
        id: 'rv-005-1',
        reviewerName: 'Sam Hunter',
        reviewedAt: '2026-03-25',
        rating: 5,
        accuracy: 'accurate',
        text: 'Tripod and case made the whole kit travel-ready. Clean glass, no haze.',
        tags: ['complete kit', 'clean glass'],
      },
    ],
  },
];

export const MOCK_RENTER_REVIEWS: Review[] = [
  {
    id: 'rv-renter-1',
    reviewerName: 'Jess Park',
    reviewedAt: '2026-03-25',
    rating: 5,
    text: 'Sam returned the optic sparkling and on time. Welcome back any time.',
  },
  {
    id: 'rv-renter-2',
    reviewerName: 'Tyler Reed',
    reviewedAt: '2026-02-13',
    rating: 5,
    text: 'Careful with the rifle, brought it back cleaner than I gave it.',
  },
];
