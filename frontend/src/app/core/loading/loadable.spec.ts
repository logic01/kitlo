import { TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { loadable } from './loadable';

describe('loadable', () => {
  it('starts in loading state', () => {
    TestBed.runInInjectionContext(() => {
      const subject = new Subject<number>();
      const l = loadable(subject.asObservable());
      expect(l.loading()).toBe(true);
      expect(l.data()).toBeNull();
      expect(l.error()).toBeNull();
      expect(l.hasData()).toBe(false);
    });
  });

  it('moves to ready after the source emits', () => {
    TestBed.runInInjectionContext(() => {
      const l = loadable(of(42));
      expect(l.loading()).toBe(false);
      expect(l.data()).toBe(42);
      expect(l.error()).toBeNull();
      expect(l.hasData()).toBe(true);
    });
  });

  it('captures the error and stays not-loading', () => {
    TestBed.runInInjectionContext(() => {
      const boom = new Error('boom');
      const l = loadable(throwError(() => boom));
      expect(l.loading()).toBe(false);
      expect(l.data()).toBeNull();
      expect(l.error()).toBe(boom);
      expect(l.hasData()).toBe(false);
    });
  });
});
