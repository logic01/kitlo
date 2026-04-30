import { ChangeDetectionStrategy, Component, computed, input, signal, OnDestroy, inject, DestroyRef } from '@angular/core';

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  totalHours: number;
}

@Component({
  selector: 'app-countdown-display',
  template: `
    <div [class]="containerClass()">
      <span [class]="numberClass()">{{ display().value }}</span>
      <span class="font-mono text-overline tracking-[0.12em] uppercase text-muted">
        {{ display().unit }}
      </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownDisplay implements OnDestroy {
  readonly targetDate = input.required<Date | string>();
  readonly urgentWithinHours = input<number>(6);

  protected readonly now = signal(Date.now());
  private readonly destroyRef = inject(DestroyRef);
  private readonly intervalId: ReturnType<typeof setInterval>;

  constructor() {
    this.intervalId = setInterval(() => this.now.set(Date.now()), 60_000);
    this.destroyRef.onDestroy(() => clearInterval(this.intervalId));
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  protected readonly parts = computed<Parts>(() => {
    const target = new Date(this.targetDate()).getTime();
    const diffMs = Math.max(0, target - this.now());
    const totalMin = Math.floor(diffMs / 60_000);
    const days = Math.floor(totalMin / (60 * 24));
    const hours = Math.floor((totalMin % (60 * 24)) / 60);
    const minutes = totalMin % 60;
    return { days, hours, minutes, totalHours: Math.floor(diffMs / 3_600_000) };
  });

  protected readonly display = computed(() => {
    const p = this.parts();
    if (p.days > 0) return { value: p.days, unit: p.days === 1 ? 'day' : 'days' };
    if (p.hours > 0) return { value: p.hours, unit: p.hours === 1 ? 'hour' : 'hours' };
    return { value: p.minutes, unit: p.minutes === 1 ? 'minute' : 'minutes' };
  });

  protected readonly urgent = computed(() => this.parts().totalHours <= this.urgentWithinHours());

  protected containerClass(): string {
    const base =
      'bg-surface border px-6 py-5 inline-flex items-baseline gap-3';
    return this.urgent() ? `${base} border-[rgba(212,120,30,0.30)]` : `${base} border-line`;
  }

  protected numberClass(): string {
    const base = 'font-mono text-h1 font-medium leading-none';
    return this.urgent() ? `${base} text-battle` : `${base} text-slate`;
  }
}
