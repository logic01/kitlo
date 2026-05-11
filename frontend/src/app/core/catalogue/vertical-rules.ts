import type { GearType, Vertical } from '../models/listing';

/**
 * Mirror of backend `Kitlo.Core/Catalogue/VerticalRules.cs`. The backend is the
 * authority for which (vertical, gear-type) combos are valid; this map drives
 * UI filtering (category step, search sidebar). Keep in lock-step.
 */
export const VERTICAL_CATEGORY_MAP: Record<Vertical, GearType[]> = {
  overlanding: [
    'rooftopTent',
    'awning',
    'fridge12V',
    'dualBattery',
    'recoveryBoard',
    'airCompressor',
    'navigation',
    'campKitchen',
    'overlandKit',
    'other',
  ],
  huntingOptics: [
    'thermal',
    'nightVision',
    'optics',
    'thermalMonocular',
    'thermalScope',
    'clipOnThermal',
    'nvScope',
    'clipOnNv',
    'treeStand',
    'pack',
    'other',
  ],
  powerStation: [
    'powerStation',
    'solarPanel',
    'dualBattery',
    'other',
  ],
  flyFishing: [
    'wader',
    'wadingBoot',
    'flyRodReel',
    'flyPack',
    'specialtyWeight',
    'floatTube',
    'other',
  ],
};

const VERTICAL_LABELS: Record<Vertical, string> = {
  overlanding: 'Camping & Overlanding',
  huntingOptics: 'Hunting Optics',
  powerStation: 'Portable Power',
  flyFishing: 'Fly Fishing',
};

const VERTICAL_SHORT_LABELS: Record<Vertical, string> = {
  overlanding: 'Overlanding',
  huntingOptics: 'Optics',
  powerStation: 'Power',
  flyFishing: 'Fly Fishing',
};

const GEAR_TYPE_LABELS: Record<GearType, string> = {
  // Optics
  thermal: 'Thermal',
  nightVision: 'Night vision',
  treeStand: 'Tree stand',
  optics: 'Optics',
  pack: 'Pack',
  other: 'Other',
  // Overlanding
  rooftopTent: 'Rooftop tent',
  awning: 'Awning',
  fridge12V: '12V fridge',
  dualBattery: 'Dual battery',
  recoveryBoard: 'Recovery boards',
  airCompressor: 'Air compressor',
  navigation: 'Navigation',
  campKitchen: 'Camp kitchen',
  overlandKit: 'Full overland kit',
  // Optics expansions
  thermalMonocular: 'Thermal monocular',
  thermalScope: 'Thermal scope',
  clipOnThermal: 'Clip-on thermal',
  nvScope: 'NV scope',
  clipOnNv: 'Clip-on NV',
  // Power
  powerStation: 'Power station',
  solarPanel: 'Solar panel',
  // Fly fishing
  wader: 'Wader',
  wadingBoot: 'Wading boot',
  flyRodReel: 'Fly rod & reel',
  flyPack: 'Fly pack / vest',
  specialtyWeight: 'Specialty weight (Spey/Switch)',
  floatTube: 'Float tube',
};

export function verticalLabel(v: Vertical): string {
  return VERTICAL_LABELS[v];
}

export function verticalShortLabel(v: Vertical): string {
  return VERTICAL_SHORT_LABELS[v];
}

export function gearTypeLabel(g: GearType): string {
  return GEAR_TYPE_LABELS[g] ?? g;
}

export function gearTypeToVertical(g: GearType): Vertical | null {
  for (const [v, types] of Object.entries(VERTICAL_CATEGORY_MAP) as [Vertical, GearType[]][]) {
    if (types.includes(g)) return v;
  }
  return null;
}

export const ALL_VERTICALS: Vertical[] = ['overlanding', 'huntingOptics', 'powerStation', 'flyFishing'];

/**
 * Suggested per-category spec keys the wizard pre-populates so listers know the
 * minimum facts a renter expects. Free-form values flow into ListingSpec rows.
 */
export const SUGGESTED_SPEC_KEYS: Partial<Record<GearType, string[]>> = {
  // Overlanding
  rooftopTent: ['Mount type', 'Load rating (lbs)', 'Sleeping capacity', 'Setup time (min)'],
  awning: ['Coverage (ft)', 'Mount type', 'Setup time (min)'],
  fridge12V: ['Capacity (L)', 'Power draw (W)', 'Voltage'],
  dualBattery: ['Capacity (Ah)', 'Chemistry', 'Charger included'],
  recoveryBoard: ['Material', 'Length (in)', 'Pair count'],
  airCompressor: ['Max PSI', 'Duty cycle', 'Power source'],
  navigation: ['Maps included', 'GPS chipset', 'Mounting'],
  campKitchen: ['Stove BTU', 'Fuel type', 'Includes cookware'],
  overlandKit: ['Vehicle fit', 'Includes', 'Total weight (lbs)'],
  // Hunting optics
  thermal: ['Resolution', 'Detection range', 'Magnification'],
  nightVision: ['Generation', 'Battery life (hrs)', 'Mounting'],
  thermalMonocular: ['Resolution', 'Detection range', 'Battery life (hrs)'],
  thermalScope: ['Resolution', 'Magnification', 'Mount type'],
  clipOnThermal: ['Resolution', 'Compatible scopes', 'Mount type'],
  nvScope: ['Generation', 'Magnification', 'Mount type'],
  clipOnNv: ['Generation', 'Mount type'],
  // Power
  powerStation: ['Capacity (Wh)', 'AC output (W)', 'UL 9540/2743 cert #'],
  solarPanel: ['Wattage (W)', 'Folded dimensions', 'Connector'],
  // Fly fishing
  wader: ['Size', 'Material', 'Stockingfoot or boot-foot'],
  wadingBoot: ['Size', 'Sole material (felt/rubber)'],
  flyRodReel: ['Rod weight', 'Length', 'Reel size'],
  flyPack: ['Volume (L)', 'Hydration compatible'],
  specialtyWeight: ['Weight class', 'Length', 'Action'],
  floatTube: ['Capacity (lbs)', 'Material', 'Includes fins'],
};
