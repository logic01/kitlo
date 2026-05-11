import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import {
  Alert,
  Button,
  FormField,
  Input,
  PageHeader,
} from '../../../../shared';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { AuthService } from '../../../../core/services/auth.service';
import { ListingsService } from '../../../../core/services/listings.service';
import type { ListingSummary, Vertical } from '../../../../core/models/listing';
import { verticalShortLabel } from '../../../../core/catalogue/vertical-rules';

@Component({
  selector: 'app-dashboard-bundle-create',
  imports: [RouterLink, ReactiveFormsModule, MoneyPipe, Alert, Button, FormField, Input, PageHeader],
  template: `
    <div class="px-8 py-8 max-w-3xl">
      <app-page-header title="Create bundle" subtitle="Bundle two or more of your listings into one rentable kit." />

      <app-alert tone="info" class="block mt-6 mb-6">
        Bundles unlock the &ldquo;Weekend overland&rdquo; pattern: rooftop tent + 12V fridge + power station in
        a single bookable kit. Lower per-unit pricing, higher utilization. Bundles inherit the strictest
        cancellation policy of any included listing.
      </app-alert>

      <form [formGroup]="form" class="space-y-5">
        <app-form-field label="Bundle title" required>
          <input appInput formControlName="title" placeholder="Weekend Overland Kit — RTT + Fridge + Power" />
        </app-form-field>
        <app-form-field label="Description">
          <textarea appInput rows="4" formControlName="description"></textarea>
        </app-form-field>

        <div>
          <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-3">Eligible listings</p>
          <div class="space-y-2">
            @for (listing of myListings(); track listing.id) {
              <label class="flex items-center gap-3 p-3 border border-line bg-bone cursor-pointer">
                <input
                  type="checkbox"
                  class="accent-olive w-4 h-4"
                  [checked]="includedIds().includes(listing.id)"
                  (change)="toggle(listing.id)"
                />
                <div class="flex-1">
                  <div class="font-semibold text-slate">{{ listing.title }}</div>
                  <div class="text-xs text-muted flex items-center gap-2 flex-wrap">
                    <span class="inline-block font-mono text-overline uppercase tracking-[0.08em] px-1.5 py-0.5 border border-line bg-surface text-slate">
                      {{ verticalLabel(listing.vertical) }}
                    </span>
                    <span>{{ listing.gearTypeLabel }} · {{ listing.dailyRateCents | money }}/day</span>
                  </div>
                </div>
              </label>
            }
          </div>
        </div>

        @if (includedIds().length >= 2) {
          <p class="text-xs text-muted">
            Bundle vertical: <strong class="text-slate">{{ bundleVerticalLabel() }}</strong>
          </p>
        }

        <app-form-field
          label="Bundle daily rate"
          hint="Sum of included rates: {{ sumIncludedCents() | money }}"
          required
        >
          <input appInput type="number" formControlName="dailyRateCents" />
        </app-form-field>

        <div class="flex gap-2">
          <a appButton variant="ghost" routerLink="/dashboard/listings">Cancel</a>
          <button
            appButton
            variant="primary"
            type="button"
            class="flex-1"
            (click)="publish()"
            [disabled]="form.invalid || includedIds().length < 2 || submitting()"
          >
            {{ submitting() ? 'Publishing…' : 'Publish bundle' }}
          </button>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBundleCreate {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly listings = inject(ListingsService);
  private readonly auth = inject(AuthService);

  protected readonly myListings = toSignal(
    this.listings.getMine().pipe(map((items) => items.filter((l) => !l.isBundle))),
    { initialValue: [] as ListingSummary[] },
  );
  protected readonly includedIds = signal<string[]>([]);
  protected readonly submitting = signal(false);
  protected readonly sumIncludedCents = computed(() =>
    this.myListings()
      .filter((l) => this.includedIds().includes(l.id))
      .reduce((sum, l) => sum + l.dailyRateCents, 0),
  );

  /** Bundle vertical is "Mixed" when children span more than one vertical, otherwise the
   * single shared vertical. Derived client-side; backend has no bundle-vertical column yet. */
  protected readonly bundleVertical = computed<Vertical | 'mixed' | null>(() => {
    const verticals = new Set(
      this.myListings()
        .filter((l) => this.includedIds().includes(l.id))
        .map((l) => l.vertical),
    );
    if (verticals.size === 0) return null;
    if (verticals.size > 1) return 'mixed';
    return [...verticals][0];
  });

  protected readonly bundleVerticalLabel = computed(() => {
    const v = this.bundleVertical();
    if (!v) return '—';
    if (v === 'mixed') return 'Mixed';
    return verticalShortLabel(v);
  });

  protected verticalLabel(v: Vertical): string {
    return verticalShortLabel(v);
  }

  protected readonly form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    dailyRateCents: [0, [Validators.required, Validators.min(1)]],
  });

  protected toggle(id: string): void {
    this.includedIds.update((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  }

  protected publish(): void {
    if (this.form.invalid || this.includedIds().length < 2 || this.submitting()) return;
    const me = this.auth.currentUser();
    if (!me) return;

    // Inherit pickup ZIP from the first child listing — bundles meet at the
    // strictest constraint of any included item, and ZIP must be a real
    // 5-digit value to pass backend validation.
    const firstChild = this.myListings().find((l) => l.id === this.includedIds()[0]);
    const pickupZip = firstChild?.pickupZip ?? '00000';

    this.submitting.set(true);
    // Bundles inherit their vertical from the first child — derived in the UI from
    // child listings — but we still need a default for the parent record. Overlanding
    // is the anchor vertical so it's the safest no-mixed-vertical fallback.
    const firstChildVertical = firstChild?.vertical ?? 'overlanding';
    this.listings
      .create({
        title: this.form.value.title!,
        description: this.form.value.description ?? '',
        vertical: firstChildVertical,
        gearType: 'other',
        gearTypeLabel: 'Bundle',
        condition: 'fieldReady',
        pickupZip,
        dailyRateCents: this.form.value.dailyRateCents ?? 0,
        isBundle: true,
        listerId: me.id,
        listerName: me.name,
        listerVerified: me.verified,
      })
      .subscribe({
        next: (draft) => {
          this.listings
            .update(draft.id, {
              isBundle: true,
              bundleListingIds: this.includedIds(),
            })
            .subscribe({
              next: () => this.router.navigateByUrl('/dashboard/listings'),
              error: () => this.submitting.set(false),
            });
        },
        error: () => this.submitting.set(false),
      });
  }
}
