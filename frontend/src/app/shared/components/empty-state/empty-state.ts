import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-empty-state',
  imports: [Button],
  template: `
    <div class="flex flex-col items-center justify-center px-10 py-20 text-center">
      <div
        class="w-12 h-12 border border-line mb-6 flex items-center justify-center text-muted"
        aria-hidden="true"
      >{{ icon() }}</div>
      <h3
        class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] text-slate mb-2"
      >{{ title() }}</h3>
      <p class="text-sm text-muted leading-relaxed max-w-sm mb-6">{{ body() }}</p>
      @if (actionLabel()) {
        <button appButton variant="primary" type="button" (click)="action.emit()">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  readonly icon = input<string>('∅');
  readonly title = input.required<string>();
  readonly body = input.required<string>();
  readonly actionLabel = input<string>();
  readonly action = output<void>();
}
