import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-upload-zone',
  template: `
    <div
      [class]="zoneClass()"
      (click)="fileInput.click()"
      (dragover)="onDragOver($event)"
      (dragleave)="dragover.set(false)"
      (drop)="onDrop($event)"
      role="button"
      tabindex="0"
    >
      <div
        class="w-10 h-10 border border-line flex items-center justify-center text-muted mb-2"
        aria-hidden="true"
      >+</div>
      <h3 class="font-condensed text-h4 font-extrabold uppercase tracking-[0.06em] text-slate">
        {{ title() }}
      </h3>
      <p class="text-xs text-muted">{{ sub() }}</p>
      <input
        #fileInput
        type="file"
        class="sr-only"
        [accept]="accept()"
        [multiple]="multiple()"
        (change)="onChange($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadZone {
  readonly title = input<string>('Drop photos to upload');
  readonly sub = input<string>('PNG or JPG · up to 10 MB each · 3 minimum');
  readonly accept = input<string>('image/*');
  readonly multiple = input<boolean>(true);
  readonly filesAdded = output<File[]>();

  protected readonly dragover = signal(false);
  protected readonly host = inject(ElementRef<HTMLElement>);

  protected zoneClass(): string {
    const base =
      'border-2 border-dashed bg-surface px-10 py-12 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-colors';
    return this.dragover()
      ? `${base} border-slate bg-bone`
      : `${base} border-line hover:border-slate hover:bg-bone`;
  }

  protected onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragover.set(true);
  }

  protected onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragover.set(false);
    const files = Array.from(e.dataTransfer?.files ?? []);
    if (files.length) this.filesAdded.emit(files);
  }

  protected onChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length) this.filesAdded.emit(files);
    input.value = '';
  }
}
