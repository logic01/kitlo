import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ToastService } from '../services/toast.service';
import { GlobalErrorHandler } from './global-error-handler';

describe('GlobalErrorHandler', () => {
  let handler: ErrorHandler;
  let toast: ToastService;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
    });
    handler = TestBed.inject(ErrorHandler);
    toast = TestBed.inject(ToastService);
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('logs the error and surfaces a toast', () => {
    handler.handleError(new Error('boom'));
    expect(consoleSpy).toHaveBeenCalled();
    const t = toast.toasts();
    expect(t.length).toBe(1);
    expect(t[0].tone).toBe('error');
    expect(t[0].message).toBe('boom');
  });

  it('falls back to a generic message for non-Error throwables', () => {
    handler.handleError({ unknown: true });
    const t = toast.toasts();
    expect(t.length).toBe(1);
    expect(t[0].message).toMatch(/unexpected/i);
  });
});
