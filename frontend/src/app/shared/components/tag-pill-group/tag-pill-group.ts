import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { TagPill } from '../tag-pill/tag-pill';
import type { TagPillTone } from '../tag-pill/tag-pill';

export interface PillOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-tag-pill-group',
  imports: [TagPill],
  template: `
    <div class="flex flex-wrap gap-2" [attr.role]="single() ? 'radiogroup' : 'group'">
      @for (option of options(); track option.value) {
        <app-tag-pill
          [selected]="selected().includes(option.value)"
          [tone]="tone()"
          (toggled)="onToggle(option.value)"
        >{{ option.label }}</app-tag-pill>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagPillGroup {
  readonly options = input.required<PillOption[]>();
  readonly tone = input<TagPillTone>('slate');
  /** When true, only one option may be selected at a time and re-clicking the
   * selected option deselects it. Default false preserves the multi-select behaviour. */
  readonly single = input<boolean>(false);
  readonly selected = model<string[]>([]);

  protected onToggle(value: string): void {
    const current = this.selected();
    if (this.single()) {
      this.selected.set(current.includes(value) ? [] : [value]);
      return;
    }
    this.selected.set(
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    );
  }
}
