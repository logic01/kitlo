import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface StepDef {
  label: string;
}

@Component({
  selector: 'app-stepper',
  template: `
    <ol
      class="flex items-start gap-0 px-10 py-5 border-b border-line bg-bone list-none"
    >
      @for (step of steps(); track $index; let i = $index) {
        <li class="flex flex-col items-center gap-2 flex-1 relative">
          @if (i > 0) {
            <span
              class="absolute left-[-50%] top-3.5 -translate-y-1/2 w-full h-px"
              [class.bg-olive]="i <= currentNorm()"
              [class.bg-line]="i > currentNorm()"
              aria-hidden="true"
            ></span>
          }
          <span
            [class]="dotClass(i)"
          >{{ i + 1 }}</span>
          <span [class]="labelClass(i)">{{ step.label }}</span>
        </li>
      }
    </ol>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stepper {
  readonly steps = input.required<StepDef[]>();
  readonly currentIndex = input.required<number>();

  protected readonly currentNorm = computed(() =>
    Math.max(0, Math.min(this.currentIndex(), this.steps().length - 1)),
  );

  protected dotClass(i: number): string {
    const base =
      'w-7 h-7 rounded-full inline-flex items-center justify-center font-condensed text-[13px] font-extrabold shrink-0 relative z-[1] border';
    if (i < this.currentNorm()) return `${base} bg-olive border-olive text-on-dark`;
    if (i === this.currentNorm()) return `${base} bg-slate border-slate text-on-dark`;
    return `${base} bg-surface border-line text-muted`;
  }

  protected labelClass(i: number): string {
    const base = 'text-xs font-medium whitespace-nowrap';
    if (i < this.currentNorm()) return `${base} text-olive`;
    if (i === this.currentNorm()) return `${base} text-slate font-semibold`;
    return `${base} text-muted`;
  }
}
