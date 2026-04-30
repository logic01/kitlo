import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  selector: 'app-photo-gallery',
  template: `
    <div class="bg-surface border-b border-line">
      <img
        [src]="photos()[activeIndex()]"
        [alt]="alt() + ' photo ' + (activeIndex() + 1)"
        class="w-full aspect-video max-h-[480px] object-cover block"
      />
      @if (photos().length > 1) {
        <div
          class="grid gap-px p-px bg-line border-t-2 border-line"
          style="grid-template-columns: repeat(auto-fill, minmax(80px, 1fr))"
        >
          @for (photo of photos(); track $index; let i = $index) {
            <button
              type="button"
              [class]="thumbClass(i === activeIndex())"
              (click)="activeIndex.set(i)"
              [attr.aria-label]="'Show photo ' + (i + 1)"
            >
              <img [src]="photo" [alt]="alt() + ' thumb ' + (i + 1)" class="w-full h-full object-cover" />
            </button>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGallery {
  readonly photos = input.required<string[]>();
  readonly alt = input<string>('Listing');
  readonly activeIndex = model<number>(0);

  protected thumbClass(active: boolean): string {
    const base = 'aspect-[4/3] bg-surface cursor-pointer overflow-hidden border-2 transition-colors';
    return active ? `${base} border-olive` : `${base} border-transparent hover:border-muted`;
  }
}
