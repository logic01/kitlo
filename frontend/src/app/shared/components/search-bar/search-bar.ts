import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Button } from '../button/button';
import { Input } from '../input/input';

export interface SearchQuery {
  location: string;
  gearType: string;
}

export type SearchBarVariant = 'hero' | 'sticky';

@Component({
  selector: 'app-search-bar',
  imports: [Button, Input],
  template: `
    <form [class]="formClass()" (submit)="onSubmit($event)" role="search">
      <input
        appInput
        [value]="location()"
        (input)="location.set(asValue($event))"
        placeholder="ZIP or city"
        aria-label="Pickup location"
        class="!border-0 !rounded-none border-r border-line"
      />
      <input
        appInput
        [value]="gearType()"
        (input)="gearType.set(asValue($event))"
        placeholder="Gear type · e.g. thermal"
        aria-label="Gear type"
        class="!border-0 !rounded-none"
      />
      <button
        appButton
        [variant]="variant() === 'hero' ? 'secondary' : 'olive'"
        [condensed]="variant() === 'hero'"
        type="submit"
        class="!rounded-none !shrink-0"
      >
        Find gear
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBar {
  readonly variant = input<SearchBarVariant>('sticky');
  readonly defaultLocation = input<string>('');
  readonly defaultType = input<string>('');
  readonly submitted = output<SearchQuery>();

  protected readonly location = signal('');
  protected readonly gearType = signal('');

  protected readonly formClass = computed(() => {
    const base = 'flex border-2 border-slate bg-bone';
    return this.variant() === 'hero' ? base : `${base}`;
  });

  constructor() {
    queueMicrotask(() => {
      if (this.defaultLocation()) this.location.set(this.defaultLocation());
      if (this.defaultType()) this.gearType.set(this.defaultType());
    });
  }

  protected asValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.emit({ location: this.location(), gearType: this.gearType() });
  }
}
