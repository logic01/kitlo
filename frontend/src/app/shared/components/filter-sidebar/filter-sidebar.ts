import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';
import { FormField } from '../form-field/form-field';
import { Input } from '../input/input';
import { Toggle } from '../toggle/toggle';
import { TagPillGroup } from '../tag-pill-group/tag-pill-group';
import type { Condition } from '../badge/badge';

export interface SearchFilters {
  minPriceCents?: number;
  maxPriceCents?: number;
  conditions: Condition[];
  gearTypes: string[];
  verifiedOnly: boolean;
  instantBook: boolean;
  radiusMiles: number;
}

const CONDITION_OPTIONS = [
  { value: 'mint', label: 'Mint' },
  { value: 'field-ready', label: 'Field-Ready' },
  { value: 'battle-scarred', label: 'Battle-Scarred' },
];

const GEAR_OPTIONS = [
  { value: 'thermal', label: 'Thermal' },
  { value: 'night-vision', label: 'Night vision' },
  { value: 'tree-stand', label: 'Tree stand' },
  { value: 'optics', label: 'Optics' },
  { value: 'pack', label: 'Pack' },
];

@Component({
  selector: 'app-filter-sidebar',
  imports: [FormField, Input, Toggle, TagPillGroup],
  template: `
    <aside class="w-[260px] shrink-0 border border-line bg-bone p-5">
      <h3
        class="font-condensed text-h4 font-extrabold uppercase tracking-[0.06em] text-slate mb-4"
      >Filters</h3>

      <section class="mb-5">
        <p class="font-mono text-overline tracking-[0.12em] uppercase text-muted mb-2">
          Daily price
        </p>
        <div class="grid grid-cols-2 gap-2">
          <app-form-field>
            <input
              appInput
              type="number"
              placeholder="Min"
              [value]="minPriceDollars()"
              (input)="onMin($event)"
            />
          </app-form-field>
          <app-form-field>
            <input
              appInput
              type="number"
              placeholder="Max"
              [value]="maxPriceDollars()"
              (input)="onMax($event)"
            />
          </app-form-field>
        </div>
      </section>

      <section class="mb-5">
        <p class="font-mono text-overline tracking-[0.12em] uppercase text-muted mb-2">Condition</p>
        <app-tag-pill-group
          [options]="conditionOptions"
          [selected]="conditionStrings()"
          (selectedChange)="onConditionsChange($event)"
        />
      </section>

      <section class="mb-5">
        <p class="font-mono text-overline tracking-[0.12em] uppercase text-muted mb-2">Gear type</p>
        <app-tag-pill-group
          [options]="gearOptions"
          [selected]="filters().gearTypes"
          (selectedChange)="onGearTypesChange($event)"
        />
      </section>

      <section>
        <app-toggle
          label="Verified hunters only"
          sub="ID-verified listers only"
          [checked]="filters().verifiedOnly"
          (checkedChange)="updateBool('verifiedOnly', $event)"
        />
        <app-toggle
          label="Instant book"
          sub="Skip the approval step"
          [checked]="filters().instantBook"
          (checkedChange)="updateBool('instantBook', $event)"
        />
      </section>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSidebar {
  readonly filters = model.required<SearchFilters>();

  protected readonly conditionOptions = CONDITION_OPTIONS;
  protected readonly gearOptions = GEAR_OPTIONS;

  protected readonly conditionStrings = computed<string[]>(() => this.filters().conditions);

  protected minPriceDollars(): string {
    const c = this.filters().minPriceCents;
    return c == null ? '' : String(Math.round(c / 100));
  }

  protected maxPriceDollars(): string {
    const c = this.filters().maxPriceCents;
    return c == null ? '' : String(Math.round(c / 100));
  }

  protected onMin(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    const cents = v ? Math.round(Number(v) * 100) : undefined;
    this.filters.set({ ...this.filters(), minPriceCents: cents });
  }

  protected onMax(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    const cents = v ? Math.round(Number(v) * 100) : undefined;
    this.filters.set({ ...this.filters(), maxPriceCents: cents });
  }

  protected onConditionsChange(values: string[]): void {
    this.filters.set({ ...this.filters(), conditions: values as Condition[] });
  }

  protected onGearTypesChange(values: string[]): void {
    this.filters.set({ ...this.filters(), gearTypes: values });
  }

  protected updateBool(key: 'verifiedOnly' | 'instantBook', value: boolean): void {
    this.filters.set({ ...this.filters(), [key]: value });
  }
}
