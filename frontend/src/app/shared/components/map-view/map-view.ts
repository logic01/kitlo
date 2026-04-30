import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MoneyPipe } from '../../pipes/money.pipe';

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  priceCents?: number;
}

@Component({
  selector: 'app-map-view',
  imports: [MoneyPipe],
  template: `
    <div
      class="relative bg-surface border border-line min-h-[420px] flex items-center justify-center overflow-hidden topo"
    >
      <div class="absolute inset-0 topo-texture opacity-40" aria-hidden="true"></div>
      <div class="relative z-[1] text-center">
        <p
          class="font-mono text-overline tracking-[0.10em] uppercase text-muted mb-2"
        >Map placeholder</p>
        <p
          class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] text-slate"
        >Real Mapbox wiring lands in Phase 5</p>
      </div>
      <ul class="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2 z-[1]">
        @for (pin of pins(); track pin.id) {
          <li>
            <button
              type="button"
              class="w-full text-left bg-bone border border-line px-3 py-2 cursor-pointer hover:border-slate transition-colors"
              (click)="pinClick.emit(pin)"
            >
              <span class="font-condensed text-sm font-extrabold uppercase tracking-[0.04em] text-slate block">
                {{ pin.label }}
              </span>
              @if (pin.priceCents !== undefined) {
                <span class="font-mono text-xs text-olive">
                  {{ pin.priceCents | money }}/day
                </span>
              }
            </button>
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    .topo-texture {
      background-image:
        radial-gradient(ellipse 50% 35% at 50% 50%, transparent 78%, rgba(83, 90, 45, 0.06) 78%, rgba(83, 90, 45, 0.06) 79%, transparent 79%),
        radial-gradient(ellipse 68% 50% at 50% 50%, transparent 82%, rgba(83, 90, 45, 0.04) 82%, rgba(83, 90, 45, 0.04) 83%, transparent 83%),
        radial-gradient(ellipse 86% 65% at 50% 50%, transparent 86%, rgba(83, 90, 45, 0.03) 86%, rgba(83, 90, 45, 0.03) 87%, transparent 87%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapView {
  readonly pins = input.required<MapPin[]>();
  readonly center = input<{ lat: number; lng: number }>();
  readonly pinClick = output<MapPin>();
}
