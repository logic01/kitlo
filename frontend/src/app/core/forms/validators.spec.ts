import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { kitloValidators } from './validators';

describe('kitloValidators.zip', () => {
  it('passes empty values (combine with required when needed)', () => {
    expect(kitloValidators.zip(new FormControl(''))).toBeNull();
    expect(kitloValidators.zip(new FormControl(null))).toBeNull();
  });

  it('accepts 5-digit zips', () => {
    expect(kitloValidators.zip(new FormControl('80301'))).toBeNull();
  });

  it('rejects non-5-digit values', () => {
    expect(kitloValidators.zip(new FormControl('1234'))).toEqual({ zip: true });
    expect(kitloValidators.zip(new FormControl('123456'))).toEqual({ zip: true });
    expect(kitloValidators.zip(new FormControl('abcde'))).toEqual({ zip: true });
  });
});

describe('kitloValidators.dailyRate', () => {
  it('passes empty values', () => {
    const v = kitloValidators.dailyRate();
    expect(v(new FormControl(''))).toBeNull();
    expect(v(new FormControl(null))).toBeNull();
  });

  it('rejects below the minimum', () => {
    const v = kitloValidators.dailyRate({ minCents: 500 }); // $5
    const result = v(new FormControl(2));
    expect(result?.['dailyRate']).toMatchObject({ reason: 'min', minDollars: 5 });
  });

  it('rejects above the maximum', () => {
    const v = kitloValidators.dailyRate({ maxCents: 10_000 }); // $100
    const result = v(new FormControl(150));
    expect(result?.['dailyRate']).toMatchObject({ reason: 'max', maxDollars: 100 });
  });

  it('flags non-numeric input', () => {
    const v = kitloValidators.dailyRate();
    expect(v(new FormControl('not a number'))?.['dailyRate']).toMatchObject({ reason: 'invalid' });
  });

  it('passes a valid in-range rate', () => {
    const v = kitloValidators.dailyRate({ minCents: 100, maxCents: 50_000 });
    expect(v(new FormControl(85))).toBeNull();
  });
});

describe('kitloValidators.photoCount', () => {
  it('passes when array length meets minimum', () => {
    const v = kitloValidators.photoCount(3);
    expect(v(new FormControl(['a.jpg', 'b.jpg', 'c.jpg']))).toBeNull();
  });

  it('fails when below minimum, with structured payload', () => {
    const v = kitloValidators.photoCount(3);
    const result = v(new FormControl(['a.jpg']));
    expect(result?.['photoCount']).toEqual({ min: 3, actual: 1 });
  });

  it('counts FormArray length when the control is a FormArray', () => {
    const v = kitloValidators.photoCount(2);
    const array = new FormArray([new FormControl('x')]);
    expect(v(array)?.['photoCount']).toEqual({ min: 2, actual: 1 });
    array.push(new FormControl('y'));
    expect(v(array)).toBeNull();
  });
});

describe('kitloValidators.dateRange', () => {
  const validator = kitloValidators.dateRange({
    startKey: 'start',
    endKey: 'end',
    minDays: 1,
    maxDays: 30,
  });

  function group(start: string, end: string): FormGroup {
    return new FormGroup({
      start: new FormControl(start),
      end: new FormControl(end),
    });
  }

  it('passes empty values (let required handle missing dates)', () => {
    expect(validator(group('', ''))).toBeNull();
  });

  it('rejects when end is on or before start', () => {
    expect(validator(group('2026-05-10', '2026-05-08'))?.['dateRange']).toMatchObject({
      reason: 'order',
    });
    expect(validator(group('2026-05-10', '2026-05-10'))?.['dateRange']).toMatchObject({
      reason: 'order',
    });
  });

  it('enforces the minimum-day span', () => {
    const v = kitloValidators.dateRange({ startKey: 'start', endKey: 'end', minDays: 3 });
    const result = v(group('2026-05-01', '2026-05-02'));
    expect(result?.['dateRange']).toMatchObject({ reason: 'min', minDays: 3 });
  });

  it('enforces the maximum-day span', () => {
    const result = validator(group('2026-05-01', '2026-06-15'));
    expect(result?.['dateRange']).toMatchObject({ reason: 'max', maxDays: 30 });
  });

  it('passes a valid span', () => {
    expect(validator(group('2026-05-01', '2026-05-08'))).toBeNull();
  });
});
