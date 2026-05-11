import type { Condition } from '../../shared/components/badge/badge';

// Top-level taxonomy. Mirrors backend Kitlo.Core/Enums/Vertical.
export type Vertical = 'overlanding' | 'huntingOptics' | 'powerStation' | 'flyFishing';

// Gear-type sub-categories. Names match backend enum members verbatim (camelCase
// over the wire via JsonStringEnumConverter), so no positional/int mapping needed.
export type GearType =
  // Optics — original 6 (positions preserved on backend for the existing migration)
  | 'thermal'
  | 'nightVision'
  | 'treeStand'
  | 'optics'
  | 'pack'
  | 'other'
  // Overlanding
  | 'rooftopTent'
  | 'awning'
  | 'fridge12V'
  | 'dualBattery'
  | 'recoveryBoard'
  | 'airCompressor'
  | 'navigation'
  | 'campKitchen'
  | 'overlandKit'
  // Optics expansions
  | 'thermalMonocular'
  | 'thermalScope'
  | 'clipOnThermal'
  | 'nvScope'
  | 'clipOnNv'
  // Power
  | 'powerStation'
  | 'solarPanel'
  // Fly fishing
  | 'wader'
  | 'wadingBoot'
  | 'flyRodReel'
  | 'flyPack'
  | 'specialtyWeight'
  | 'floatTube';

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

export type ListingStatus = 'draft' | 'pendingReview' | 'published' | 'paused' | 'rejected' | 'archived';

export interface ListingSummary {
  id: string;
  title: string;
  vertical: Vertical;
  gearType: GearType;
  gearTypeLabel: string;
  condition: Condition;
  dailyRateCents: number;
  pickupZip: string;
  heroPhotoUrl: string;
  rating?: { average: number; count: number };
  listerId: string;
  listerName: string;
  listerVerified: boolean;
  isBundle?: boolean;
  status?: ListingStatus;
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
