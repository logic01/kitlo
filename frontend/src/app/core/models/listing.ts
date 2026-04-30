import type { Condition } from '../../shared/components/badge/badge';

export type GearType =
  | 'thermal'
  | 'night-vision'
  | 'rifle'
  | 'bow'
  | 'tree-stand'
  | 'optics'
  | 'pack'
  | 'other';

export interface ListingPhoto {
  id: string;
  url: string;
  alt?: string;
  isHero?: boolean;
}

export interface ListingSpec {
  key: string;
  value: string;
}

export interface ListingSummary {
  id: string;
  title: string;
  gearType: GearType;
  gearTypeLabel: string;
  condition: Condition;
  dailyRateCents: number;
  pickupZip: string;
  heroPhotoUrl: string;
  rating?: { average: number; count: number };
  listerName: string;
  listerVerified: boolean;
  isBundle?: boolean;
}

export interface Listing extends ListingSummary {
  description: string;
  photos: ListingPhoto[];
  specs: ListingSpec[];
  depositCents?: number;
  serviceFeePct: number;
  cancellationPolicy: 'flexible' | 'moderate' | 'strict';
  bundleListingIds?: string[];
}
