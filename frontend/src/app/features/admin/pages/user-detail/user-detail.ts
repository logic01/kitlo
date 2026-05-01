import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Avatar, Badge, Button, PageHeader, Spinner, StatCard, type Crumb } from '../../../../shared';
import { AdminService, type UserAdminRecord } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-admin-user-detail',
  imports: [Avatar, Badge, Button, PageHeader, Spinner, StatCard],
  template: `
    @if (loading()) {
      <div class="px-8 py-16 text-center"><app-spinner /></div>
    } @else if (record(); as r) {
      <div class="px-8 py-8">
        <app-page-header [title]="r.user.name" [breadcrumbs]="crumbs()">
          <div slot="actions" class="flex gap-2">
            <button
              appButton
              variant="ghost"
              type="button"
              [disabled]="acting()"
              (click)="warn()"
            >
              Issue warning
            </button>
            <button
              appButton
              variant="ghost"
              type="button"
              class="text-amber-dark"
              [disabled]="acting()"
              (click)="restrict()"
            >
              Restrict
            </button>
            <button
              appButton
              variant="ghost"
              type="button"
              class="text-battle"
              [disabled]="acting()"
              (click)="suspend()"
            >
              Suspend
            </button>
            <button
              appButton
              variant="primary"
              type="button"
              [disabled]="acting()"
              (click)="reinstate()"
            >
              Reinstate
            </button>
          </div>
        </app-page-header>

        <div class="flex items-center gap-5 p-6 border border-line bg-bone mt-6 mb-7">
          <app-avatar size="lg" [name]="r.user.name" [imageUrl]="r.user.avatarUrl" />
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-condensed text-h2 font-extrabold uppercase text-slate">{{ r.user.name }}</span>
              @if (r.user.verified) {
                <app-badge kind="verified" label="Verified" />
              }
              <app-badge kind="gear-type" [label]="r.user.role" />
            </div>
            <div class="text-sm text-muted">
              {{ r.user.email }} · {{ r.user.city }}, {{ r.user.state }} · Member since {{ r.user.joinedAt }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <app-stat-card [overline]="'Status'" [value]="r.status" tone="primary" />
          <app-stat-card overline="Bookings" value="14" />
          <app-stat-card overline="Listings" value="3" />
          <app-stat-card overline="Disputes" value="0" />
        </div>

        <h3 class="font-condensed text-h3 font-extrabold uppercase tracking-[0.06em] text-slate mb-4">
          Activity (latest 10)
        </h3>
        <div class="border border-line bg-bone divide-y divide-line">
          @for (entry of activity; track entry.id) {
            <div class="px-5 py-3 flex items-center justify-between text-sm">
              <span>{{ entry.label }}</span>
              <span class="font-mono text-xs text-muted">{{ entry.when }}</span>
            </div>
          }
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly admin = inject(AdminService);

  private readonly userId = toSignal(
    this.route.params.pipe(map((p) => p['id'] as string)),
    { initialValue: '' },
  );

  private readonly recordResult = toSignal(
    toObservable(this.userId).pipe(
      switchMap((id) =>
        id ? this.admin.getUserRecord(id).pipe(catchError(() => of(null))) : of(null),
      ),
      startWith(undefined as UserAdminRecord | null | undefined),
    ),
    { initialValue: undefined as UserAdminRecord | null | undefined },
  );

  private readonly statusOverride = signal<string | null>(null);

  protected readonly loading = computed(() => this.recordResult() === undefined);
  protected readonly record = computed(() => {
    const base = this.recordResult();
    const override = this.statusOverride();
    if (!base) return base ?? null;
    return override ? { ...base, status: override as UserAdminRecord['status'] } : base;
  });

  protected readonly acting = signal(false);

  protected readonly crumbs = computed<Crumb[]>(() => [
    { label: 'Users', route: '/admin/users' },
    { label: this.record()?.user.name ?? '' },
  ]);

  protected readonly activity = [
    { id: 1, label: 'Booked Pulsar Helion 2 XP50 from Jess Park', when: '2026-04-22 18:13' },
    { id: 2, label: 'Left a 5-star review on lst-001', when: '2026-04-19 17:42' },
    { id: 3, label: 'Verified email', when: '2025-09-12 10:04' },
  ];

  protected warn(): void {
    this.runAction('warned', (id) => this.admin.warnUser(id, { reason: 'Inappropriate behavior' }));
  }

  protected restrict(): void {
    this.runAction('restricted', (id) => this.admin.restrictUser(id, { reason: 'Repeated violations' }));
  }

  protected suspend(): void {
    this.runAction('suspended', (id) =>
      this.admin.suspendUser(id, { reason: 'Severe violation', durationDays: 7 }),
    );
  }

  protected reinstate(): void {
    this.runAction('active', (id) => this.admin.reinstateUser(id));
  }

  private runAction(
    nextStatus: string,
    call: (id: string) => ReturnType<AdminService['warnUser']>,
  ): void {
    const id = this.userId();
    if (!id || this.acting()) return;
    this.acting.set(true);
    call(id).subscribe({
      next: () => {
        this.acting.set(false);
        this.statusOverride.set(nextStatus);
      },
      error: () => this.acting.set(false),
    });
  }
}
