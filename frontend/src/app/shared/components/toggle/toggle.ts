import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-toggle',
  template: `
    <label
      class="flex items-center justify-between py-3 border-b border-line gap-6 last:border-b-0 cursor-pointer"
    >
      <span class="flex-1">
        <span class="text-sm font-medium text-slate block">{{ label() }}</span>
        @if (sub()) {
          <span class="text-xs text-muted block mt-0.5">{{ sub() }}</span>
        }
      </span>
      <span
        class="relative w-10 h-[22px] shrink-0 inline-block"
        role="switch"
        [attr.aria-checked]="checked()"
      >
        <input
          type="checkbox"
          class="sr-only peer"
          [id]="id"
          [checked]="checked()"
          (change)="checked.set(asChecked($event))"
        />
        <span
          class="absolute inset-0 bg-surface border border-line transition-colors peer-checked:bg-olive peer-checked:border-olive"
        ></span>
        <span
          class="absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-muted transition-transform peer-checked:translate-x-[18px] peer-checked:bg-white"
          aria-hidden="true"
        ></span>
      </span>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toggle {
  readonly label = input.required<string>();
  readonly sub = input<string>();
  readonly checked = model<boolean>(false);

  protected readonly id = `toggle-${++nextId}`;

  protected asChecked(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }
}
