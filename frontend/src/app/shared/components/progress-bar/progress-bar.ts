import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  template: `
    <div
      class="h-[3px] bg-surface border-b border-line"
      role="progressbar"
      [attr.aria-valuenow]="percent()"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="h-full bg-olive transition-[width] duration-300 ease-out"
        [style.width.%]="percent()"
      ></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBar {
  readonly value = input.required<number>();

  protected readonly percent = computed(() =>
    Math.max(0, Math.min(100, this.value() * 100)),
  );
}
