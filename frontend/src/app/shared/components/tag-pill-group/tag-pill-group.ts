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
    <div class="flex flex-wrap gap-2" role="group">
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
  readonly selected = model<string[]>([]);

  protected onToggle(value: string): void {
    const current = this.selected();
    this.selected.set(
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    );
  }
}
