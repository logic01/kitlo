import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  PageHeader,
  PhotoGallery,
  SpecTable,
  Spinner,
  type Crumb,
  type SpecRow,
} from '../../../../shared';
import { AdminService } from '../../../../core/services/admin.service';
import { ListingsService } from '../../../../core/services/listings.service';
import type { Listing } from '../../../../core/models/listing';

@Component({
  selector: 'app-admin-listing-detail',
  imports: [
    Alert,
    Avatar,
    Badge,
    Button,
    PageHeader,
    PhotoGallery,
    SpecTable,
    Spinner,
  ],
  template: `
    @if (loading()) {
      <div class="px-8 py-16 text-center"><app-spinner /></div>
    } @else if (listing(); as l) {
      <div class="px-8 py-8">
        <app-page-header [title]="l.title" [breadcrumbs]="crumbs()">
          <div slot="actions" class="flex gap-2">
            <button
              appButton
              variant="ghost"
              type="button"
              [disabled]="acting()"
              (click)="requestChanges()"
            >
              Request changes
            </button>
            <button
              appButton
              variant="ghost"
              type="button"
              class="text-battle"
              [disabled]="acting()"
              (click)="reject()"
            >
              Reject
            </button>
            <button
              appButton
              variant="primary"
              type="button"
              [disabled]="acting()"
              (click)="approve()"
            >
              {{ acting() ? 'Saving…' : 'Approve' }}
            </button>
          </div>
        </app-page-header>

        <app-alert tone="warning" class="block mt-5 mb-6">
          High-value listing — admin approval required before going live. SLA: 24 hours from submission.
        </app-alert>

        <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div>
            <app-photo-gallery [photos]="photoUrls()" [alt]="l.title" />
            <div class="mt-6 flex gap-2">
              <app-badge kind="condition" [condition]="l.condition" />
              <app-badge kind="gear-type" [label]="l.gearTypeLabel" />
            </div>
            <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mt-3">{{ l.title }}</h2>
            <p class="text-body text-muted leading-relaxed mt-3">{{ l.description }}</p>
            <h3 class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] mt-7 mb-3">
              Specifications
            </h3>
            <app-spec-table [rows]="specs()" />
          </div>

          <aside class="space-y-5">
            <section class="border border-line bg-bone p-5">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Lister</p>
              <div class="flex items-center gap-3 mb-3">
                <app-avatar size="md" [name]="l.listerName" />
                <div class="flex-1">
                  <div class="font-semibold">{{ l.listerName }}</div>
                  <div class="text-xs text-muted">
                    @if (l.listerVerified) { Verified } @else { Unverified }
                    · 14 prior listings
                  </div>
                </div>
              </div>
            </section>

            <section class="border border-line bg-bone p-5">
              <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Listing details</p>
              <dl class="text-sm space-y-2">
                <div class="flex justify-between"><dt class="text-muted">Daily rate</dt><dd>$ {{ l.dailyRateCents / 100 }}</dd></div>
                <div class="flex justify-between"><dt class="text-muted">Deposit</dt><dd>$ {{ (l.depositCents ?? 0) / 100 }}</dd></div>
                <div class="flex justify-between"><dt class="text-muted">Pickup ZIP</dt><dd>{{ l.pickupZip }}</dd></div>
                <div class="flex justify-between"><dt class="text-muted">Cancellation</dt><dd>{{ l.cancellationPolicy }}</dd></div>
              </dl>
            </section>
          </aside>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminListingDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly listings = inject(ListingsService);
  private readonly admin = inject(AdminService);

  private readonly listingId = toSignal(
    this.route.params.pipe(map((p) => p['id'] as string)),
    { initialValue: '' },
  );

  private readonly listingResult = toSignal(
    toObservable(this.listingId).pipe(
      switchMap((id) => (id ? this.listings.getById(id).pipe(catchError(() => of(null))) : of(null))),
      startWith(undefined as Listing | null | undefined),
    ),
    { initialValue: undefined as Listing | null | undefined },
  );

  protected readonly loading = computed(() => this.listingResult() === undefined);
  protected readonly listing = computed(() => this.listingResult() ?? null);
  protected readonly acting = signal(false);

  protected readonly photoUrls = computed(() => this.listing()?.photos.map((p) => p.url) ?? []);
  protected readonly specs = computed<SpecRow[]>(
    () => this.listing()?.specs.map((s) => ({ key: s.key, value: s.value })) ?? [],
  );
  protected readonly crumbs = computed<Crumb[]>(() => [
    { label: 'Listing queue', route: '/admin/listings' },
    { label: this.listing()?.title ?? 'Detail' },
  ]);

  protected approve(): void {
    const id = this.listingId();
    if (!id || this.acting()) return;
    this.acting.set(true);
    this.admin.approveListing(id).subscribe({
      next: () => this.router.navigateByUrl('/admin/listings'),
      error: () => this.acting.set(false),
    });
  }

  protected reject(): void {
    const id = this.listingId();
    if (!id || this.acting()) return;
    this.acting.set(true);
    this.admin.rejectListing(id, 'Does not meet listing standards').subscribe({
      next: () => this.router.navigateByUrl('/admin/listings'),
      error: () => this.acting.set(false),
    });
  }

  protected requestChanges(): void {
    const id = this.listingId();
    if (!id || this.acting()) return;
    this.acting.set(true);
    this.admin.requestListingChanges(id, ['photos', 'description']).subscribe({
      next: () => this.acting.set(false),
      error: () => this.acting.set(false),
    });
  }
}
