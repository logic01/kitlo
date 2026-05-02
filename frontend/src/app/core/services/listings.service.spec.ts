import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListingsService } from './listings.service';

describe('ListingsService (HTTP)', () => {
  let service: ListingsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ListingsService],
    });
    service = TestBed.inject(ListingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('serializes search filters into query params', async () => {
    const promise = firstValueFrom(
      service.search({
        gearType: 'thermal',
        condition: ['mint', 'field-ready'],
        minPriceCents: 5000,
        verifiedOnly: true,
        sort: 'price-asc',
        pageSize: 12,
      }),
    );

    const req = httpMock.expectOne((r) => r.url === `${environment.apiUrl}/listings`);
    expect(req.request.params.get('gearType')).toBe('0');
    expect(req.request.params.get('conditions')).toBe('mint,field-ready');
    expect(req.request.params.get('minPriceCents')).toBe('5000');
    expect(req.request.params.get('verifiedOnly')).toBe('true');
    expect(req.request.params.get('sort')).toBe('price-asc');
    expect(req.request.params.get('pageSize')).toBe('12');

    req.flush({
      items: [
        {
          id: 'l1',
          title: 'Pulsar',
          gearType: 0,
          gearTypeLabel: 'Thermal',
          condition: 1,
          dailyRateCents: 8500,
          pickupZip: '80301',
          heroPhotoUrl: 'http://img/1',
          listerName: 'Jess',
          listerVerified: true,
          isBundle: false,
          ratingAverage: 4.8,
          ratingCount: 12,
        },
      ],
      total: 1,
      page: 1,
      pageSize: 12,
    });

    const result = await promise;
    expect(result.items[0].gearType).toBe('thermal');
    expect(result.items[0].condition).toBe('field-ready');
    expect(result.items[0].rating).toEqual({ average: 4.8, count: 12 });
  });

  it('maps backend listing detail to the frontend model', async () => {
    const promise = firstValueFrom(service.getById('l1'));
    const req = httpMock.expectOne(`${environment.apiUrl}/listings/l1`);
    req.flush({
      id: 'l1',
      title: 'Pulsar',
      gearType: 0,
      gearTypeLabel: 'Thermal',
      condition: 1,
      dailyRateCents: 8500,
      depositCents: 50000,
      serviceFeeBp: 500,
      cancellationPolicy: 1,
      status: 2,
      pickupZip: '80301',
      description: 'Mint',
      isBundle: false,
      listerId: 'u1',
      listerName: 'Jess',
      listerVerified: true,
      ratingAverage: 4.8,
      ratingCount: 12,
      photos: [{ id: 'p1', url: 'http://img/1', alt: null, isHero: true }],
      specs: [{ key: 'Resolution', value: '640x480' }],
      bundleListingIds: null,
    });
    const listing = await promise;
    expect(listing.cancellationPolicy).toBe('moderate');
    expect(listing.serviceFeePct).toBe(5);
    expect(listing.heroPhotoUrl).toBe('http://img/1');
    expect(listing.photos[0].isHero).toBe(true);
  });
});
