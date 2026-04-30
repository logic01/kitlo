import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Badge } from '../badge/badge';
import { MoneyPipe } from '../../pipes/money.pipe';
import type { ListingSummary } from '../../../core/models/listing';

@Component({
  selector: 'app-listing-card',
  imports: [RouterLink, NgOptimizedImage, Badge, MoneyPipe],
  template: `
    <a
      [routerLink]="['/listing', listing().id]"
      class="block border border-line bg-bone no-underline transition-colors hover:border-slate"
    >
      <div class="relative h-40 bg-surface flex items-end p-3 overflow-hidden">
        <img
          [ngSrc]="listing().heroPhotoUrl"
          [alt]="listing().title"
          fill
          priority
          class="object-cover"
        />
        <div class="relative flex gap-2 z-[1]">
          <app-badge kind="gear-type" [label]="listing().gearTypeLabel" />
          @if (listing().isBundle) {
            <app-badge kind="gear-type" label="Bundle" />
          }
        </div>
      </div>

      <div class="px-5 py-4">
        <div class="flex justify-between items-start mb-2">
          <h3
            class="font-condensed text-[20px] font-extrabold uppercase tracking-[0.04em] text-slate leading-tight"
          >
            {{ listing().title }}
          </h3>
          <app-badge kind="condition" [condition]="listing().condition" />
        </div>
        <p
          class="font-mono text-[11px] text-muted mb-4 uppercase tracking-[0.06em]"
        >
          {{ listing().pickupZip }}
        </p>

        <div class="flex items-center gap-2 pt-4 border-t border-line">
          <span class="text-xs font-semibold text-ink">{{ listing().listerName }}</span>
          @if (listing().listerVerified) {
            <app-badge kind="verified" label="Verified" />
          }
          <span class="font-mono text-base font-medium text-olive ml-auto">
            {{ listing().dailyRateCents | money }}<span class="text-muted text-xs"> /day</span>
          </span>
        </div>
      </div>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingCard {
  readonly listing = input.required<ListingSummary>();
}
