import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  Alert,
  Button,
  FormField,
  Input,
  PageHeader,
  PhotoGrid,
  UploadZone,
  type Crumb,
} from '../../../../shared';
import { ListingsService } from '../../../../core/services/listings.service';
import type { Listing } from '../../../../core/models/listing';

@Component({
  selector: 'app-dashboard-listing-edit',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    Alert,
    Button,
    FormField,
    Input,
    PageHeader,
    PhotoGrid,
    UploadZone,
  ],
  template: `
    @if (listing(); as l) {
      <div class="px-8 py-8 max-w-3xl">
        <app-page-header title="Edit listing" [breadcrumbs]="crumbs()">
          <div slot="actions" class="flex gap-2">
            <a appButton variant="ghost" [routerLink]="['/listing', l.id]">Preview</a>
            <button
              appButton
              variant="primary"
              type="button"
              [disabled]="saving()"
              (click)="save()"
            >
              {{ saving() ? 'Saving…' : 'Save changes' }}
            </button>
          </div>
        </app-page-header>

        @if (saved()) {
          <app-alert tone="success" class="block mt-4">Listing updated.</app-alert>
        }

        <form [formGroup]="form" class="mt-6">
          <app-form-field label="Title" required>
            <input appInput formControlName="title" />
          </app-form-field>
          <app-form-field label="Description" hint="Markdown supported.">
            <textarea appInput rows="6" formControlName="description"></textarea>
          </app-form-field>
          <div class="grid grid-cols-2 gap-3">
            <app-form-field label="Daily rate (cents)" required>
              <input appInput type="number" formControlName="dailyRateCents" />
            </app-form-field>
            <app-form-field label="Pickup ZIP" required>
              <input appInput formControlName="pickupZip" maxlength="5" />
            </app-form-field>
          </div>
          <app-form-field label="Photos">
            <app-photo-grid [photos]="l.photos" />
            <app-upload-zone class="mt-3 block" />
          </app-form-field>
          <div class="flex gap-2">
            <button appButton variant="ghost" type="button">Pause listing</button>
            <button appButton variant="ghost" type="button" class="text-battle" (click)="archive()">Archive</button>
          </div>
        </form>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardListingEdit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly listings = inject(ListingsService);

  private readonly listingId = toSignal(
    this.route.params.pipe(map((p) => p['id'] as string)),
    { initialValue: '' },
  );

  protected readonly listing = toSignal(
    toObservable(this.listingId).pipe(
      switchMap((id) => (id ? this.listings.getById(id).pipe(catchError(() => of(null))) : of(null))),
    ),
    { initialValue: null as Listing | null },
  );

  protected readonly crumbs = computed<Crumb[]>(() => [
    { label: 'My listings', route: '/dashboard/listings' },
    { label: this.listing()?.title ?? 'Edit' },
  ]);

  protected readonly saving = signal(false);
  protected readonly saved = signal(false);

  protected readonly form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    dailyRateCents: [0, [Validators.required, Validators.min(0)]],
    pickupZip: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const l = this.listing();
      if (!l) return;
      this.form.setValue({
        title: l.title,
        description: l.description,
        dailyRateCents: l.dailyRateCents,
        pickupZip: l.pickupZip,
      });
    });
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) return;
    const id = this.listingId();
    if (!id) return;
    this.saving.set(true);
    this.saved.set(false);
    this.listings.update(id, this.form.getRawValue()).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
      },
      error: () => this.saving.set(false),
    });
  }

  protected archive(): void {
    const id = this.listingId();
    if (!id) return;
    this.listings.archive(id).subscribe(() => this.router.navigateByUrl('/dashboard/listings'));
  }
}
