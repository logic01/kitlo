import { ChangeDetectionStrategy, Component, input } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-form-field',
  template: `
    <div class="mb-5 flex flex-col gap-2">
      @if (label()) {
        <label
          [for]="fieldId"
          class="font-mono text-overline uppercase tracking-[0.12em] text-muted"
        >
          {{ label() }}@if (required()) {
            <span class="text-battle ml-1">*</span>
          }
        </label>
      }
      <div [id]="fieldId">
        <ng-content />
      </div>
      @if (hint() && !error()) {
        <p class="text-xs text-muted">{{ hint() }}</p>
      }
      @if (error()) {
        <p class="font-mono text-xs text-battle">{{ error() }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  readonly label = input<string>();
  readonly hint = input<string>();
  readonly error = input<string | null>();
  readonly required = input(false, { transform: (v: boolean | string) => v === '' || v === true });

  protected readonly fieldId = `field-${++nextId}`;
}
