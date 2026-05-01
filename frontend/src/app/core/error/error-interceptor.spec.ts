import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { errorInterceptor } from './error-interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let toast: ToastService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    toast = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flush(status: number, body: Record<string, unknown> | string | null = null): Promise<unknown> {
    return new Promise((resolve) => {
      http.get('/test').subscribe({
        next: () => resolve('next'),
        error: (e) => resolve(e),
      });
      const req = httpMock.expectOne('/test');
      req.flush(body as never, { status, statusText: 'X' });
    });
  }

  it('shows offline toast for status 0', async () => {
    await flush(0);
    const t = toast.toasts();
    expect(t.length).toBe(1);
    expect(t[0].label).toBe('Offline');
  });

  it('shows session-expired warning for 401', async () => {
    await flush(401);
    const t = toast.toasts();
    expect(t[0].tone).toBe('warning');
    expect(t[0].label).toBe('Signed out');
  });

  it('shows forbidden warning for 403', async () => {
    await flush(403);
    expect(toast.toasts()[0].label).toBe('Forbidden');
  });

  it('navigates to /server-error and shows error toast for 5xx', async () => {
    const navSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await flush(503, { message: 'maintenance' });
    expect(navSpy).toHaveBeenCalledWith(['/server-error']);
    expect(toast.toasts()[0].label).toBe('Server error');
  });

  it('extracts message from JSON body', async () => {
    await flush(404, { message: 'Listing not found' });
    expect(toast.toasts()[0].message).toBe('Listing not found');
  });

  it('rethrows so the caller can react', async () => {
    const result = await flush(401);
    expect(result).not.toBe('next');
  });
});
