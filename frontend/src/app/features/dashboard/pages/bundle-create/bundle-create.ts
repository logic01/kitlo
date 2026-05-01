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
import type { ListingSummary } from '../../../../core/models/listing';

@Component({
  selector: 'app-dashboard-bundle-create',
  imports: [RouterLink, ReactiveFormsModule, MoneyPipe, Alert, Button, FormField, Input, PageHeader],
  template: `
    <div class="px-8 py-8 max-w-3xl">
      <app-page-header title="Create bundle" subtitle="Bundle two or more of your listings into one rentable kit." />

      <app-alert tone="info" class="block mt-6 mb-6">
        Bundles unlock the &ldquo;Elk season&rdquo; pattern: thermal + NV + tripod in a single bookable kit. Lower per-unit pricing,
        higher utilization. Bundles inherit the strictest cancellation policy of any included listing.
      </app-alert>

      <form [formGroup]="form" class="space-y-5">
        <app-form-field label="Bundle title" required>
          <input appInput formControlName="title" placeholder="Elk Season Bundle — Thermal + NV" />
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
                  <div class="text-xs text-muted">{{ listing.gearTypeLabel }} · {{ listing.dailyRateCents | money }}/day</div>
                </div>
              </label>
            }
          </div>
        </div>

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
    this.listings.search({ pageSize: 50 }).pipe(
      map((page) => {
        const myName = this.auth.currentUser()?.name;
        return myName ? page.items.filter((l) => l.listerName === myName) : page.items.slice(0, 6);
      }),
    ),
    { initialValue: [] as ListingSummary[] },
  );
  protected readonly includedIds = signal<string[]>([]);
  protected readonly submitting = signal(false);
  protected readonly sumIncludedCents = computed(() =>
    this.myListings()
      .filter((l) => this.includedIds().includes(l.id))
      .reduce((sum, l) => sum + l.dailyRateCents, 0),
  );

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
    this.submitting.set(true);
    this.listings
      .create({
        title: this.form.value.title!,
        gearType: 'other',
        gearTypeLabel: 'Bundle',
        condition: 'field-ready',
        pickupZip: '00000',
        listerId: me.id,
        listerName: me.name,
        listerVerified: me.verified,
      })
      .subscribe({
        next: (draft) => {
          this.listings
            .update(draft.id, {
              dailyRateCents: this.form.value.dailyRateCents ?? 0,
              description: this.form.value.description ?? '',
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
