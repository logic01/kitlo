import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a toast with the requested tone and message', () => {
    service.success('Saved.');
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].tone).toBe('success');
    expect(toasts[0].message).toBe('Saved.');
  });

  it('dedupes identical tone+message into a single toast', () => {
    const a = service.error('Network down');
    const b = service.error('Network down');
    expect(a).toBe(b);
    expect(service.toasts().length).toBe(1);
  });

  it('keeps separate toasts when tone or message differs', () => {
    service.error('Network down');
    service.warning('Network down');
    service.error('Other problem');
    expect(service.toasts().length).toBe(3);
  });

  it('auto-dismisses after the per-tone duration', () => {
    service.success('Done');
    expect(service.toasts().length).toBe(1);
    vi.advanceTimersByTime(4000);
    expect(service.toasts().length).toBe(0);
  });

  it('respects a custom duration override', () => {
    service.info('Hello', { durationMs: 100 });
    vi.advanceTimersByTime(99);
    expect(service.toasts().length).toBe(1);
    vi.advanceTimersByTime(2);
    expect(service.toasts().length).toBe(0);
  });

  it('durationMs of 0 keeps the toast until dismissed manually', () => {
    const id = service.info('Sticky', { durationMs: 0 });
    vi.advanceTimersByTime(100_000);
    expect(service.toasts().length).toBe(1);
    service.dismiss(id);
    expect(service.toasts().length).toBe(0);
  });

  it('clear() removes everything and cancels timers', () => {
    service.success('A');
    service.error('B');
    service.clear();
    expect(service.toasts().length).toBe(0);
  });

  it('ignores empty messages', () => {
    service.success('   ');
    expect(service.toasts().length).toBe(0);
  });
});
