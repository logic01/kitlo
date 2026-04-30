import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ComparePhoto {
  url: string;
  capturedAt: string;
}

@Component({
  selector: 'app-photo-compare',
  template: `
    <div class="grid grid-cols-2 gap-px bg-line border border-line">
      <div class="bg-bone">
        <p class="font-mono text-overline tracking-[0.10em] uppercase text-on-dark bg-slate px-4 py-2 flex justify-between">
          <span>{{ beforeLabel() }}</span>
          <span class="text-on-dark-muted">{{ before().capturedAt }}</span>
        </p>
        <img [src]="before().url" alt="Before" class="w-full aspect-[4/3] object-cover bg-surface block" />
      </div>
      <div class="bg-bone">
        <p class="font-mono text-overline tracking-[0.10em] uppercase text-on-dark bg-slate px-4 py-2 flex justify-between">
          <span>{{ afterLabel() }}</span>
          <span class="text-on-dark-muted">{{ after().capturedAt }}</span>
        </p>
        <img [src]="after().url" alt="After" class="w-full aspect-[4/3] object-cover bg-surface block" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoCompare {
  readonly before = input.required<ComparePhoto>();
  readonly after = input.required<ComparePhoto>();
  readonly beforeLabel = input<string>('Before pickup');
  readonly afterLabel = input<string>('After return');
}
