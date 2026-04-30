import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { ListingPhoto } from '../../../core/models/listing';

@Component({
  selector: 'app-photo-grid',
  template: `
    <div class="grid grid-cols-4 gap-2 mt-4">
      @for (photo of photos(); track photo.id; let i = $index) {
        <div [class]="thumbClass(i === heroIndex())">
          <img [src]="photo.url" [alt]="photo.alt ?? ''" class="w-full h-full object-cover" />
          @if (i === heroIndex()) {
            <span
              class="absolute bottom-0 inset-x-0 bg-olive font-mono text-[9px] tracking-[0.08em] uppercase text-on-dark px-1.5 py-0.5 text-center"
            >Hero</span>
          }
          <button
            type="button"
            class="absolute top-1 right-1 w-5 h-5 bg-slate/85 text-white text-xs flex items-center justify-center cursor-pointer"
            (click)="remove.emit(i)"
            [attr.aria-label]="'Remove photo ' + (i + 1)"
          >×</button>
          @if (i !== heroIndex()) {
            <button
              type="button"
              class="absolute top-1 left-1 px-1.5 h-5 bg-slate/85 text-white font-mono text-[9px] uppercase tracking-[0.08em] cursor-pointer"
              (click)="setHero.emit(i)"
            >Set hero</button>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGrid {
  readonly photos = input.required<ListingPhoto[]>();
  readonly heroIndex = input<number>(0);
  readonly remove = output<number>();
  readonly setHero = output<number>();

  protected thumbClass(isHero: boolean): string {
    const base = 'aspect-[4/3] bg-surface relative overflow-hidden border';
    return isHero ? `${base} border-olive border-2` : `${base} border-line`;
  }
}
