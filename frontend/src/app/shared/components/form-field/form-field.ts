import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  untracked,
} from '@angular/core';
import type { AbstractControl } from '@angular/forms';
import { merge, startWith } from 'rxjs';
import {
  firstErrorMessage,
  type ErrorMessageOverrides,
} from '../../../core/forms/error-messages';

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
      <div [id]="fieldId" [attr.aria-describedby]="describedBy()">
        <ng-content />
      </div>
      @if (hint() && !displayedError()) {
        <p [id]="hintId" class="text-xs text-muted">{{ hint() }}</p>
      }
      @if (displayedError(); as msg) {
        <p [id]="errorId" class="font-mono text-xs text-battle" role="alert">{{ msg }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  readonly label = input<string>();
  readonly hint = input<string>();
  /** Manual override — takes precedence over `[control]`-derived errors. */
  readonly error = input<string | null>();
  readonly required = input(false, { transform: (v: boolean | string) => v === '' || v === true });

  /** Optional reactive form control. When set, errors are derived automatically. */
  readonly control = input<AbstractControl | null>(null);
  readonly errorMessages = input<ErrorMessageOverrides>({});

  protected readonly fieldId = `field-${++nextId}`;
  protected readonly errorId = `${this.fieldId}-error`;
  protected readonly hintId = `${this.fieldId}-hint`;

  private readonly tick = signal(0);

  constructor() {
    // Re-evaluate the displayed error whenever the bound control's status
    // or value changes. `onCleanup` handles unsubscription on destroy
    // (or when the bound control changes).
    effect((onCleanup) => {
      const c = this.control();
      if (!c) return;
      const sub = merge(c.statusChanges, c.valueChanges)
        .pipe(startWith(null))
        .subscribe(() => untracked(() => this.tick.update((n) => n + 1)));
      onCleanup(() => sub.unsubscribe());
    });
  }

  protected readonly displayedError = computed<string | null>(() => {
    const manual = this.error();
    if (manual) return manual;

    const c = this.control();
    if (!c) return null;
    // Subscribe to the tick so we re-run when the control's state changes.
    this.tick();
    if (!(c.touched || c.dirty)) return null;
    if (c.valid || !c.errors) return null;
    return firstErrorMessage(c.errors, this.errorMessages());
  });

  protected readonly describedBy = computed(() => {
    if (this.displayedError()) return this.errorId;
    if (this.hint()) return this.hintId;
    return null;
  });
}
