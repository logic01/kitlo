import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  Alert,
  Avatar,
  Button,
  FormField,
  Input,
  PageHeader,
  StarInput,
  TagPillGroup,
  type PillOption,
} from '../../../../shared';
import { AuthService } from '../../../../core/services/auth.service';
import { BookingsService } from '../../../../core/services/bookings.service';
import { ReviewsService } from '../../../../core/services/reviews.service';
import type { BookingSummary } from '../../../../core/models/booking';

const TAG_OPTIONS: PillOption[] = [
  { value: 'accurate', label: 'Accurate description' },
  { value: 'communication', label: 'Great communication' },
  { value: 'pickup', label: 'Easy pickup' },
  { value: 'photographed', label: 'Gear as photographed' },
  { value: 'fully-charged', label: 'Fully charged' },
];

@Component({
  selector: 'app-dashboard-leave-review',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    Alert,
    Avatar,
    Button,
    FormField,
    Input,
    PageHeader,
    StarInput,
    TagPillGroup,
  ],
  template: `
    <div class="px-8 py-8 max-w-2xl">
      <app-page-header title="Leave a review" subtitle="Reviews are released once both sides have submitted." />

      @if (booking(); as b) {
        <div class="flex items-center gap-4 p-4 border border-line bg-bone mt-6 mb-6">
          <app-avatar size="md" [name]="b.counterpartyName" />
          <div class="flex-1">
            <div class="font-semibold">{{ b.gearTitle }}</div>
            <div class="text-xs text-muted">From {{ b.counterpartyName }} · {{ b.startDate }} → {{ b.endDate }}</div>
          </div>
        </div>
      }

      @if (error(); as msg) {
        <app-alert tone="danger" class="block mb-4">{{ msg }}</app-alert>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">
        <div>
          <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-2">
            Overall rating
          </p>
          <app-star-input [(value)]="rating" />
        </div>

        <div>
          <p class="font-mono text-overline text-muted tracking-[0.10em] uppercase mb-2">
            What stood out?
          </p>
          <app-tag-pill-group [options]="tagOptions" [(selected)]="selectedTags" />
        </div>

        <app-form-field label="Tell other hunters about it" hint="Public review. Specifics help.">
          <textarea
            appInput
            rows="6"
            formControlName="text"
            placeholder="Glass was every bit as advertised. Spotted hogs at 600 yards…"
          ></textarea>
        </app-form-field>

        <div class="flex gap-2">
          <a appButton variant="ghost" routerLink="/dashboard/bookings">Cancel</a>
          <button
            appButton
            variant="primary"
            type="submit"
            class="flex-1"
            [disabled]="form.invalid || submitting()"
          >
            {{ submitting() ? 'Submitting…' : 'Submit review' }}
          </button>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLeaveReview {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly reviews = inject(ReviewsService);
  private readonly bookings = inject(BookingsService);

  protected readonly tagOptions = TAG_OPTIONS;
  protected readonly rating = signal<1 | 2 | 3 | 4 | 5>(5);
  protected readonly selectedTags = signal<string[]>([]);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  private readonly bookingId = toSignal(
    this.route.params.pipe(map((p) => p['id'] as string)),
    { initialValue: '' },
  );

  protected readonly booking = toSignal(
    toObservable(this.bookingId).pipe(
      switchMap((id) => (id ? this.bookings.getById(id).pipe(catchError(() => of(null))) : of(null))),
    ),
    { initialValue: null as BookingSummary | null },
  );

  protected readonly listingId = computed(() => `lst-${this.bookingId()}`);

  protected readonly form = this.fb.group({
    text: ['', [Validators.required, Validators.minLength(20)]],
  });

  protected submit(): void {
    if (this.form.invalid || this.submitting()) return;
    const me = this.auth.currentUser();
    const b = this.booking();
    if (!me || !b) {
      this.error.set('Sign in to submit a review.');
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.reviews
      .submit({
        bookingId: b.id,
        listingId: this.listingId(),
        rating: this.rating(),
        text: this.form.value.text!,
        tags: this.selectedTags(),
        reviewerName: me.name,
        reviewerAvatarUrl: me.avatarUrl,
        reviewedRole: 'lister',
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard/reviews'),
        error: (err: Error) => {
          this.error.set(err.message);
          this.submitting.set(false);
        },
      });
  }
}
