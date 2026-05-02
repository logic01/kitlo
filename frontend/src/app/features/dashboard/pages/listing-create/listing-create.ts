import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import {
  Alert,
  Button,
  ConditionRatingInput,
  FormField,
  Input,
  PageHeader,
  Stepper,
  TagPillGroup,
  UploadZone,
  type PillOption,
  type StepDef,
} from '../../../../shared';
import type { Condition } from '../../../../shared';
import { AuthService } from '../../../../core/services/auth.service';
import { ListingsService } from '../../../../core/services/listings.service';
import { kitloValidators } from '../../../../core/forms/validators';
import type { GearType } from '../../../../core/models/listing';

const STEPS: StepDef[] = [
  { label: 'Category' },
  { label: 'Photos' },
  { label: 'Pricing' },
  { label: 'Review' },
];

// Weapons (firearms, hunting bows, crossbows) are not listable on Kitlo.
// Keep the option set in sync with `GearType` in core/models/listing.ts.
const CATEGORY_OPTIONS: PillOption[] = [
  { value: 'thermal', label: 'Thermal' },
  { value: 'night-vision', label: 'Night Vision' },
  { value: 'optics', label: 'Optics' },
  { value: 'tree-stand', label: 'Treestand / saddle' },
  { value: 'pack', label: 'Pack' },
];

@Component({
  selector: 'app-dashboard-listing-create',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    Alert,
    Button,
    ConditionRatingInput,
    FormField,
    Input,
    PageHeader,
    Stepper,
    TagPillGroup,
    UploadZone,
  ],
  template: `
    <div class="px-8 py-8 max-w-3xl">
      <app-page-header title="Create listing" />

      <div class="mt-6 mb-6">
        <app-stepper [steps]="steps" [currentIndex]="step()" />
      </div>

      @switch (step()) {
        @case (0) {
          <form [formGroup]="basics" (ngSubmit)="advance()">
            <app-form-field label="What are you listing?" required [control]="basics.controls.title">
              <input
                appInput
                formControlName="title"
                placeholder="Pulsar Helion 2 XP50 Pro"
                [invalid]="showError(basics.controls.title)"
              />
            </app-form-field>
            <app-form-field
              label="Description"
              hint="Specs, condition notes, what's included. 60 chars minimum."
              required
              [control]="basics.controls.description"
            >
              <textarea
                appInput
                rows="5"
                formControlName="description"
                placeholder="Pulsar XP50 Pro thermal scope. 640×480 sensor, 50 mm objective, 2 batteries…"
                [invalid]="showError(basics.controls.description)"
              ></textarea>
            </app-form-field>
            <app-form-field
              label="Category"
              required
              [error]="categoryError()"
            >
              <app-tag-pill-group [options]="categoryOptions" [(selected)]="categories" />
            </app-form-field>
            <app-form-field label="Pickup ZIP" required [control]="basics.controls.zip">
              <input
                appInput
                formControlName="zip"
                placeholder="80301"
                maxlength="5"
                [invalid]="showError(basics.controls.zip)"
              />
            </app-form-field>
            <app-form-field label="Condition" required>
              <app-condition-rating-input [(value)]="condition" />
            </app-form-field>
            <button appButton variant="primary" type="submit">Continue</button>
          </form>
        }

        @case (1) {
          <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-2">Photos</h2>
          <p class="text-sm text-muted mb-5">At least 3 photos. First photo becomes the listing card hero.</p>
          <app-upload-zone (filesAdded)="onFilesAdded($event)" />
          @if (photos().length > 0) {
            <ul class="grid grid-cols-3 gap-3 mt-4" aria-label="Selected photos">
              @for (photo of photos(); track photo.url) {
                <li class="relative border border-line bg-bone p-1">
                  <img [src]="photo.url" [alt]="photo.name" class="w-full h-24 object-cover" />
                  <button
                    type="button"
                    class="absolute top-1 right-1 bg-bone border border-line text-xs px-1.5 py-0.5"
                    aria-label="Remove photo"
                    (click)="removePhoto(photo.url)"
                  >×</button>
                </li>
              }
            </ul>
          }
          <p class="text-xs text-muted mt-3" aria-live="polite">
            {{ photos().length }} of 3 minimum
          </p>
          <app-alert tone="info" class="block mt-5">
            Show the gear in good light, multiple angles, and any cosmetic wear. Honesty pays off — accurate listings get more 5-star reviews.
          </app-alert>
          @if (photoError(); as msg) {
            <app-alert tone="danger" class="block mt-3">{{ msg }}</app-alert>
          }
          <div class="flex gap-2 mt-6">
            <button appButton variant="ghost" type="button" (click)="back()">Back</button>
            <button appButton variant="primary" type="button" class="flex-1" (click)="advance()">Continue</button>
          </div>
        }

        @case (2) {
          <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-2">Pricing</h2>
          <form [formGroup]="pricing" (ngSubmit)="advance()">
            <app-form-field
              label="Daily rate"
              hint="Similar gear in your area is renting for $80–$110 / day."
              required
              [control]="pricing.controls.dailyRate"
            >
              <input
                appInput
                type="number"
                formControlName="dailyRate"
                placeholder="$85"
                [invalid]="showError(pricing.controls.dailyRate)"
              />
            </app-form-field>
            <app-form-field
              label="Refundable deposit"
              hint="Recommended: 25–40% of MSRP."
              [control]="pricing.controls.deposit"
            >
              <input
                appInput
                type="number"
                formControlName="deposit"
                placeholder="$250"
                [invalid]="showError(pricing.controls.deposit)"
              />
            </app-form-field>
            <app-form-field label="Cancellation policy" required>
              <select appInput formControlName="cancellation">
                <option value="flexible">Flexible — full refund 7+ days out</option>
                <option value="moderate">Moderate — 50% within 48 hr–7 days</option>
                <option value="strict">Strict — no refund within 48 hours</option>
              </select>
            </app-form-field>
            <div class="flex gap-2 mt-2">
              <button appButton variant="ghost" type="button" (click)="back()">Back</button>
              <button appButton variant="primary" type="submit" class="flex-1">
                Continue
              </button>
            </div>
          </form>
        }

        @case (3) {
          <h2 class="font-condensed text-h2 font-extrabold uppercase text-slate mb-3">Review & publish</h2>
          <div class="border border-line bg-bone p-5 space-y-2 text-sm">
            <p><strong>Title:</strong> {{ basics.value.title }}</p>
            <p><strong>Category:</strong> {{ categories().join(', ') || '—' }}</p>
            <p><strong>Pickup ZIP:</strong> {{ basics.value.zip }}</p>
            <p><strong>Condition:</strong> {{ condition() }}</p>
            <p><strong>Daily rate:</strong> {{ pricing.value.dailyRate ? '$' + pricing.value.dailyRate : '—' }}</p>
            <p><strong>Deposit:</strong> {{ pricing.value.deposit ? '$' + pricing.value.deposit : '—' }}</p>
            <p><strong>Cancellation:</strong> {{ pricing.value.cancellation }}</p>
          </div>
          <app-alert tone="warning" class="block mt-5">
            High-value listings (&gt; $2,500 MSRP) go through admin review before going live. Usually under 24 hours.
          </app-alert>
          @if (error(); as msg) {
            <app-alert tone="danger" class="block mt-4">{{ msg }}</app-alert>
          }
          <div class="flex gap-2 mt-6">
            <button appButton variant="ghost" type="button" (click)="back()">Back</button>
            <a appButton variant="ghost" routerLink="/dashboard/listings">Save as draft</a>
            <button
              appButton
              variant="primary"
              type="button"
              class="flex-1"
              [disabled]="submitting()"
              (click)="publish()"
            >
              {{ submitting() ? 'Publishing…' : 'Publish listing' }}
            </button>
          </div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardListingCreate {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly listings = inject(ListingsService);
  private readonly auth = inject(AuthService);

  protected readonly steps = STEPS;
  protected readonly step = signal(0);
  protected readonly categoryOptions = CATEGORY_OPTIONS;
  protected readonly categories = signal<string[]>([]);
  protected readonly condition = signal<Condition>('field-ready');
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly photos = signal<{ name: string; url: string }[]>([]);
  protected readonly photoError = signal<string | null>(null);

  protected readonly basics = this.fb.group({
    title: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(60)]],
    zip: ['', [Validators.required, kitloValidators.zip]],
  });

  protected readonly pricing = this.fb.group({
    dailyRate: [0, [Validators.required, kitloValidators.dailyRate({ minCents: 100 })]],
    deposit: [0],
    cancellation: 'moderate',
  });

  protected readonly categoryError = computed(() =>
    this.categoryTouched() && this.categories().length === 0 ? 'Pick at least one category.' : null,
  );
  private readonly categoryTouched = signal(false);

  protected advance(): void {
    if (this.step() === 0) {
      if (this.basics.invalid || this.categories().length === 0) {
        this.basics.markAllAsTouched();
        this.categoryTouched.set(true);
        return;
      }
    }
    if (this.step() === 1) {
      if (this.photos().length < 3) {
        this.photoError.set('At least 3 photos are required to publish.');
        return;
      }
      this.photoError.set(null);
    }
    if (this.step() === 2 && this.pricing.invalid) {
      this.pricing.markAllAsTouched();
      return;
    }
    this.step.update((n) => Math.min(n + 1, STEPS.length - 1));
  }

  protected onFilesAdded(files: File[]): void {
    this.photoError.set(null);
    // Local object-URL preview. Real Cloudinary upload happens at publish time.
    const next = files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    this.photos.update((current) => [...current, ...next]);
  }

  protected removePhoto(url: string): void {
    this.photos.update((list) => {
      const remaining = list.filter((p) => p.url !== url);
      try { URL.revokeObjectURL(url); } catch { /* not all URLs are object URLs */ }
      return remaining;
    });
  }

  protected back(): void {
    this.step.update((n) => Math.max(0, n - 1));
  }

  protected showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  protected publish(): void {
    if (this.submitting()) return;
    const me = this.auth.currentUser();
    if (!me) {
      this.error.set('Sign in to publish a listing.');
      return;
    }
    if (this.photos().length < 3) {
      this.error.set('At least 3 photos are required to publish.');
      this.step.set(1);
      return;
    }
    const gearTypeRaw = this.categories()[0] ?? 'optics';
    const gearTypeMap: Record<string, GearType> = {
      thermal: 'thermal',
      'night-vision': 'night-vision',
      optics: 'optics',
      'tree-stand': 'tree-stand',
      pack: 'pack',
    };
    const gearType = gearTypeMap[gearTypeRaw] ?? 'optics';
    const gearTypeLabel = this.categoryOptions.find((c) => c.value === gearTypeRaw)?.label ?? 'Optics';
    const dailyRateCents = Math.round((this.pricing.value.dailyRate ?? 0) * 100);
    const depositCents = Math.round((this.pricing.value.deposit ?? 0) * 100);
    const cancellationPolicy = this.pricing.value.cancellation as 'flexible' | 'moderate' | 'strict';
    const description = this.basics.value.description ?? '';

    this.submitting.set(true);
    this.error.set(null);

    // Single create call now carries all the basics so we don't have an
    // orphaned-draft window if the follow-up update fails.
    this.listings
      .create({
        title: this.basics.value.title!,
        description,
        gearType,
        gearTypeLabel,
        condition: this.condition(),
        pickupZip: this.basics.value.zip!,
        dailyRateCents,
        depositCents: depositCents || undefined,
        cancellationPolicy,
        listerId: me.id,
        listerName: me.name,
        listerVerified: me.verified,
      })
      .subscribe({
        next: (draft) => {
          const photosToAdd = this.photos().map((p, i) => ({
            url: p.url,
            alt: p.name,
            isHero: i === 0,
          }));
          this.listings.addPhotos(draft.id, photosToAdd).subscribe({
            next: () => {
              this.listings.publish(draft.id).subscribe({
                next: () => this.router.navigateByUrl('/dashboard/listings'),
                error: (e: { error?: { message?: string } }) => {
                  this.error.set(e.error?.message ?? 'Could not publish listing.');
                  this.submitting.set(false);
                },
              });
            },
            error: (e: { error?: { message?: string } }) => {
              this.error.set(e.error?.message ?? 'Could not upload photos.');
              this.submitting.set(false);
            },
          });
        },
        error: (e: { error?: { message?: string } }) => {
          this.error.set(e.error?.message ?? 'Could not create listing.');
          this.submitting.set(false);
        },
      });
  }
}
