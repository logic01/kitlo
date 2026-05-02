import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';

// Leaflet's default-icon images are referenced relatively in CSS and break when
// imported inline. Wire them up here instead so markers render correctly.
const ICON_BASE = 'https://unpkg.com/leaflet@1.9.4/dist/images';
const KitloMarkerIcon = L.icon({
  iconUrl: `${ICON_BASE}/marker-icon.png`,
  iconRetinaUrl: `${ICON_BASE}/marker-icon-2x.png`,
  shadowUrl: `${ICON_BASE}/marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  priceCents?: number;
}

const DEFAULT_CENTER: L.LatLngTuple = [40.0, -105.27]; // Boulder, CO

@Component({
  selector: 'app-map-view',
  template: `
    <div
      #host
      class="relative bg-surface border border-line min-h-[420px] overflow-hidden"
      style="z-index: 0"
    ></div>
  `,
  styles: `
    :host { display: block; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapView implements AfterViewInit, OnDestroy {
  readonly pins = input.required<MapPin[]>();
  readonly center = input<{ lat: number; lng: number }>();
  readonly pinClick = output<MapPin>();

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private map?: L.Map;
  private layer?: L.LayerGroup;

  constructor() {
    effect(() => {
      const list = this.pins();
      if (this.map) this.renderPins(list);
    });
  }

  ngAfterViewInit(): void {
    const el = this.host().nativeElement;
    const c = this.center();
    const initial: L.LatLngTuple = c ? [c.lat, c.lng] : DEFAULT_CENTER;

    this.map = L.map(el, {
      center: initial,
      zoom: 11,
      attributionControl: true,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.layer = L.layerGroup().addTo(this.map);
    this.renderPins(this.pins());
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private renderPins(pins: MapPin[]): void {
    if (!this.map || !this.layer) return;
    this.layer.clearLayers();

    pins.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lng], { title: pin.label, icon: KitloMarkerIcon });
      const price = pin.priceCents !== undefined ? `<br><strong>$${(pin.priceCents / 100).toFixed(0)}/day</strong>` : '';
      marker.bindPopup(`<strong>${this.escape(pin.label)}</strong>${price}`);
      marker.on('click', () => this.pinClick.emit(pin));
      marker.addTo(this.layer!);
    });

    if (pins.length > 0) {
      const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng] as L.LatLngTuple));
      this.map.fitBounds(bounds.pad(0.2), { animate: false, maxZoom: 14 });
    }
  }

  private escape(text: string): string {
    return text.replace(/[&<>"']/g, (c) =>
      c === '&' ? '&amp;' :
      c === '<' ? '&lt;' :
      c === '>' ? '&gt;' :
      c === '"' ? '&quot;' : '&#39;',
    );
  }
}
