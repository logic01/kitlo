import { firstErrorMessage } from './error-messages';

describe('firstErrorMessage', () => {
  it('returns null when no errors', () => {
    expect(firstErrorMessage(null)).toBeNull();
    expect(firstErrorMessage({})).toBeNull();
  });

  it('maps required to a default message', () => {
    expect(firstErrorMessage({ required: true })).toBe('Required.');
  });

  it('uses the override when provided', () => {
    expect(firstErrorMessage({ required: true }, { required: 'Email is required.' })).toBe(
      'Email is required.',
    );
  });

  it('renders minlength with the dynamic length', () => {
    expect(firstErrorMessage({ minlength: { requiredLength: 8, actualLength: 3 } })).toBe(
      'Must be at least 8 characters.',
    );
  });

  it('renders the kitlo zip message', () => {
    expect(firstErrorMessage({ zip: true })).toBe('Enter a 5-digit ZIP code.');
  });

  it('renders the dailyRate min reason with dollar amount', () => {
    expect(firstErrorMessage({ dailyRate: { reason: 'min', minDollars: 5 } })).toBe(
      'Daily rate must be at least $5.',
    );
  });

  it('renders the dateRange order reason', () => {
    expect(firstErrorMessage({ dateRange: { reason: 'order' } })).toBe(
      'End date must come after the start date.',
    );
  });

  it('returns the first matching message when multiple errors are present', () => {
    const message = firstErrorMessage({ required: true, email: true });
    // Object key order is insertion-order in modern JS engines.
    expect(message).toBe('Required.');
  });
});
