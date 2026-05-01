import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

/**
 * Kitlo-specific reactive-form validators. Each returns standard
 * `ValidationErrors` keyed by a Kitlo-specific name so error-messages.ts
 * can resolve a user-facing string.
 */
export const kitloValidators = {
  /**
   * 5-digit US ZIP. Empty values pass (combine with `Validators.required`
   * when ZIP is mandatory).
   */
  zip: (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return /^\d{5}$/.test(String(value).trim()) ? null : { zip: true };
  },

  /**
   * Daily rate in dollars (the form usually stores dollars and we convert
   * to cents server-side). Pass `{ minCents, maxCents }` to clamp.
   */
  dailyRate(opts: { minCents?: number; maxCents?: number } = {}): ValidatorFn {
    const minDollars = opts.minCents !== undefined ? opts.minCents / 100 : 1;
    const maxDollars = opts.maxCents !== undefined ? opts.maxCents / 100 : null;
    return (control) => {
      const raw = control.value;
      if (raw === null || raw === undefined || raw === '') return null;
      const num = Number(raw);
      if (!Number.isFinite(num)) return { dailyRate: { reason: 'invalid' } };
      if (num < minDollars) return { dailyRate: { reason: 'min', minDollars } };
      if (maxDollars !== null && num > maxDollars) {
        return { dailyRate: { reason: 'max', maxDollars } };
      }
      return null;
    };
  },

  /**
   * Minimum number of items in a `FormArray`, or for a control whose value
   * is an array (e.g. uploaded photo URLs). The default min of 3 matches
   * the listing-photos rule from CLAUDE.md.
   */
  photoCount(min = 3): ValidatorFn {
    return (control) => {
      const length =
        control instanceof FormArray
          ? control.length
          : Array.isArray(control.value)
            ? (control.value as unknown[]).length
            : 0;
      return length >= min ? null : { photoCount: { min, actual: length } };
    };
  },

  /**
   * Group-level validator for a date range (start before end, optional
   * min/max span in days).
   *
   * Apply to a `FormGroup`:
   *   fb.group({ start: '', end: '' },
   *     { validators: kitloValidators.dateRange({ startKey: 'start', endKey: 'end', minDays: 1 }) })
   */
  dateRange(opts: {
    startKey: string;
    endKey: string;
    minDays?: number;
    maxDays?: number;
  }): ValidatorFn {
    return (group) => {
      const startRaw = group.get(opts.startKey)?.value;
      const endRaw = group.get(opts.endKey)?.value;
      if (!startRaw || !endRaw) return null;

      const start = new Date(startRaw);
      const end = new Date(endRaw);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return { dateRange: { reason: 'invalid' } };
      }
      if (end <= start) {
        return { dateRange: { reason: 'order' } };
      }

      const days = Math.round((end.getTime() - start.getTime()) / 86_400_000);
      if (opts.minDays !== undefined && days < opts.minDays) {
        return { dateRange: { reason: 'min', minDays: opts.minDays, actual: days } };
      }
      if (opts.maxDays !== undefined && days > opts.maxDays) {
        return { dateRange: { reason: 'max', maxDays: opts.maxDays, actual: days } };
      }
      return null;
    };
  },
};
