import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Avatar } from '../avatar/avatar';
import type { Review, ReviewAccuracy } from '../../../core/models/review';

const ACCURACY_TONE: Record<ReviewAccuracy, string> = {
  accurate: 'text-mint bg-mint-pale border-mint-border',
  somewhat: 'text-amber-dark bg-[rgba(212,120,30,0.07)] border-[rgba(212,120,30,0.20)]',
  inaccurate: 'text-[#8B0000] bg-[rgba(139,0,0,0.06)] border-[rgba(139,0,0,0.15)]',
};

const ACCURACY_LABEL: Record<ReviewAccuracy, string> = {
  accurate: 'Accurate to listing',
  somewhat: 'Somewhat accurate',
  inaccurate: 'Inaccurate',
};

@Component({
  selector: 'app-review-card',
  imports: [Avatar],
  template: `
    <article class="border-b border-line py-5 last:border-b-0">
      <header class="flex items-start justify-between mb-3 gap-4">
        <div class="flex items-center gap-3">
          <app-avatar
            [name]="review().reviewerName"
            [imageUrl]="review().reviewerAvatarUrl"
            size="sm"
          />
          <div>
            <p class="text-sm font-semibold text-slate">{{ review().reviewerName }}</p>
            <p
              class="font-mono text-[11px] text-muted uppercase tracking-[0.06em] mt-0.5"
            >
              {{ formatDate(review().reviewedAt) }}
            </p>
          </div>
        </div>
        <div class="flex gap-0.5" [attr.aria-label]="review().rating + ' out of 5 stars'">
          @for (filled of stars(); track $index) {
            <span [class]="filled ? 'review-star' : 'review-star-empty'"></span>
          }
        </div>
      </header>

      @if (review().accuracy; as a) {
        <p [class]="accuracyClass()">{{ ACCURACY_LABEL[a] }}</p>
      }

      <p class="text-sm text-ink leading-relaxed mb-3">{{ review().text }}</p>

      @if (review().tags?.length) {
        <ul class="flex flex-wrap gap-2 list-none">
          @for (tag of review().tags; track tag) {
            <li
              class="font-mono text-[10px] tracking-[0.06em] uppercase text-muted border border-line px-2 py-0.5 bg-surface"
            >
              {{ tag }}
            </li>
          }
        </ul>
      }
    </article>
  `,
  styles: `
    .review-star, .review-star-empty {
      width: 14px; height: 14px; flex-shrink: 0;
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    }
    .review-star { background: var(--color-amber); }
    .review-star-empty { background: var(--color-line); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCard {
  readonly review = input.required<Review>();

  protected readonly ACCURACY_LABEL = ACCURACY_LABEL;

  protected readonly stars = computed(() => {
    const rating = this.review().rating;
    return Array.from({ length: 5 }, (_, i) => i < rating);
  });

  protected readonly accuracyClass = computed(() => {
    const a = this.review().accuracy;
    if (!a) return '';
    return `inline-block font-mono text-overline tracking-[0.08em] uppercase px-2 py-0.5 border mb-3 ${ACCURACY_TONE[a]}`;
  });

  protected formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
