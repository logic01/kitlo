import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { BookingsService } from './bookings.service';
import { ListingsService } from './listings.service';
import { MessagesService } from './messages.service';
import { NotificationsService } from './notifications.service';
import { PayoutsService } from './payouts.service';

describe('Core mock services', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
  });

  it('ListingsService.search returns paginated summaries', async () => {
    const service = TestBed.inject(ListingsService);
    const result = await firstValueFrom(service.search({ pageSize: 5 }));
    expect(result.items.length).toBe(5);
    expect(result.total).toBeGreaterThanOrEqual(15);
    expect(result.page).toBe(1);
  });

  it('ListingsService.search filters by gearType + minRating', async () => {
    const service = TestBed.inject(ListingsService);
    const result = await firstValueFrom(service.search({ gearType: 'thermal', minRating: 4.5 }));
    expect(result.items.every((l) => l.gearType === 'thermal')).toBe(true);
    expect(result.items.every((l) => (l.rating?.average ?? 0) >= 4.5)).toBe(true);
  });

  it('ListingsService.getById throws for unknown id', async () => {
    const service = TestBed.inject(ListingsService);
    await expect(firstValueFrom(service.getById('nope'))).rejects.toThrow(/not found/);
  });

  it('BookingsService.cancel transitions status and appends timeline event', async () => {
    const service = TestBed.inject(BookingsService);
    const result = await firstValueFrom(service.cancel('bk-001', 'Test cancel'));
    expect(result.status).toBe('cancelled');
    const timeline = await firstValueFrom(service.getTimeline('bk-001'));
    expect(timeline.at(-1)?.label).toBe('Cancelled');
  });

  it('BookingsService.cancelPreview computes refund based on policy window', async () => {
    const service = TestBed.inject(BookingsService);
    const preview = await firstValueFrom(service.cancelPreview('bk-008'));
    expect(['flexible', 'moderate', 'strict']).toContain(preview.policy);
    expect(preview.refundCents + preview.feeRetainedCents).toBeGreaterThan(0);
  });

  it('MessagesService.sendMessage updates thread preview', async () => {
    const auth = TestBed.inject(AuthService);
    auth.switchTo('renter');
    const service = TestBed.inject(MessagesService);
    const message = await firstValueFrom(service.sendMessage('th-001', { body: 'Confirming pickup' }));
    expect(message.body).toBe('Confirming pickup');
    const threads = await firstValueFrom(service.listThreads());
    expect(threads.find((t) => t.id === 'th-001')?.lastMessagePreview).toBe('Confirming pickup');
  });

  it('NotificationsService.markAllRead clears unread count', async () => {
    const service = TestBed.inject(NotificationsService);
    await firstValueFrom(service.markAllRead());
    const count = await firstValueFrom(service.unreadCount());
    expect(count).toBe(0);
  });

  it('PayoutsService.exportCsv emits a CSV with header + rows', async () => {
    const service = TestBed.inject(PayoutsService);
    const csv = await firstValueFrom(service.exportCsv());
    const lines = csv.split('\n');
    expect(lines[0]).toMatch(/^id,bookingId,/);
    expect(lines.length).toBeGreaterThan(1);
  });
});
