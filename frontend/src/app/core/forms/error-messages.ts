import type { ValidationErrors } from '@angular/forms';

export type ErrorMessageOverrides = Partial<Record<string, string | ((value: unknown) => string)>>;

/**
 * Default user-facing copy for both Angular built-in validators and Kitlo
 * custom validators. Override per-field by passing a partial map to
 * `<app-form-field [errorMessages]="...">`.
 */
export const DEFAULT_ERROR_MESSAGES: Record<string, string | ((value: unknown) => string)> = {
  required: 'Required.',
  email: 'Enter a valid email address.',
  minlength: (v) =>
    `Must be at least ${(v as { requiredLength: number })?.requiredLength ?? 0} characters.`,
  maxlength: (v) =>
    `Keep this under ${(v as { requiredLength: number })?.requiredLength ?? 0} characters.`,
  min: (v) => `Must be at least ${(v as { min: number })?.min ?? 0}.`,
  max: (v) => `Must be ${(v as { max: number })?.max ?? 0} or less.`,
  pattern: 'Format looks off.',

  // Kitlo-specific
  zip: 'Enter a 5-digit ZIP code.',
  dailyRate: (v) => {
    const detail = v as { reason?: string; minDollars?: number; maxDollars?: number };
    if (detail?.reason === 'min') return `Daily rate must be at least $${detail.minDollars}.`;
    if (detail?.reason === 'max') return `Daily rate can't exceed $${detail.maxDollars}.`;
    return 'Enter a valid daily rate.';
  },
  photoCount: (v) => {
    const detail = v as { min: number; actual: number };
    return `Add at least ${detail.min} photo${detail.min === 1 ? '' : 's'} (you have ${detail.actual}).`;
  },
  dateRange: (v) => {
    const detail = v as { reason?: string; minDays?: number; maxDays?: number };
    if (detail?.reason === 'order') return 'End date must come after the start date.';
    if (detail?.reason === 'min') return `Rental must be at least ${detail.minDays} day(s).`;
    if (detail?.reason === 'max') return `Rental can't exceed ${detail.maxDays} day(s).`;
    return 'Pick a valid date range.';
  },
};

/**
 * Resolve a `ValidationErrors` object to the first user-facing message.
 * Returns `null` if there are no errors. Pass `overrides` to customize copy
 * per field (e.g. `{ required: 'ZIP is required.' }`).
 */
export function firstErrorMessage(
  errors: ValidationErrors | null | undefined,
  overrides: ErrorMessageOverrides = {},
): string | null {
  if (!errors) return null;
  for (const key of Object.keys(errors)) {
    const value = errors[key];
    const override = overrides[key];
    const fallback = DEFAULT_ERROR_MESSAGES[key];
    const candidate = override ?? fallback;
    if (!candidate) continue;
    return typeof candidate === 'function' ? candidate(value) : candidate;
  }
  return null;
}
