import { ChangeDetectionStrategy, Component, model, input } from '@angular/core';

export interface TabDef {
  id: string;
  label: string;
  count?: number;
}

@Component({
  selector: 'app-tabs',
  template: `
    <div role="tablist" class="flex border-b border-line px-10 -mb-px">
      @for (tab of tabs(); track tab.id) {
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="tab.id === activeId()"
          [class]="classFor(tab.id === activeId())"
          (click)="activeId.set(tab.id)"
        >
          {{ tab.label }}
          @if (tab.count !== undefined && tab.count !== null) {
            <span class="font-mono text-[11px] text-muted bg-surface px-1.5 rounded-full">
              {{ tab.count }}
            </span>
          }
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tabs {
  readonly tabs = input.required<TabDef[]>();
  readonly activeId = model.required<string>();

  protected classFor(active: boolean): string {
    const base =
      'inline-flex items-center gap-2 font-medium text-sm py-3 px-5 border-b-2 cursor-pointer bg-transparent transition-colors';
    return active
      ? `${base} text-slate border-olive font-semibold`
      : `${base} text-muted border-transparent hover:text-ink`;
  }
}
