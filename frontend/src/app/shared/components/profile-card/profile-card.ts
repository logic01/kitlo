import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Avatar } from '../avatar/avatar';
import { Badge } from '../badge/badge';
import { MoneyPipe } from '../../pipes/money.pipe';
import type { ProfileSummary } from '../../../core/models/user';

@Component({
  selector: 'app-profile-card',
  imports: [Avatar, Badge, MoneyPipe],
  template: `
    <article
      class="border border-line bg-bone p-5 flex gap-4 items-start relative"
    >
      <app-avatar [name]="profile().name" [imageUrl]="profile().avatarUrl" size="md" tone="olive" />
      <div class="flex-1 min-w-0">
        <h3
          class="font-condensed text-[18px] font-extrabold uppercase tracking-[0.04em] text-slate"
        >
          {{ profile().name }}
        </h3>
        @if (profile().city || profile().state) {
          <p class="font-mono text-[11px] text-muted mt-0.5">
            {{ profile().city }}@if (profile().city && profile().state) {, }{{ profile().state }}
          </p>
        }
        @if (profile().primaryGear) {
          <p class="text-xs text-ink font-medium mt-2">{{ profile().primaryGear }}</p>
        }
        @if (profile().primaryRateCents !== undefined && profile().primaryRateCents !== null) {
          <p class="font-mono text-xs text-olive font-medium mt-1">
            {{ profile().primaryRateCents | money }}/day
          </p>
        }
      </div>
      @if (profile().verified) {
        <span class="absolute top-5 right-5">
          <app-badge kind="verified" />
        </span>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCard {
  readonly profile = input.required<ProfileSummary>();
}
