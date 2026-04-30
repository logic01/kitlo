import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface SidebarItem {
  label: string;
  route: string;
  icon?: string;
  badgeCount?: number;
  section?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside
      class="bg-bone border-r border-line py-6 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto flex flex-col w-[220px]"
    >
      @for (group of groups(); track group.section) {
        @if (group.section) {
          <span
            class="font-mono text-overline tracking-[0.14em] uppercase text-muted px-5 pt-5 pb-2 block"
          >{{ group.section }}</span>
        }
        <ul class="list-none flex flex-col">
          @for (item of group.items; track item.route) {
            <li>
              <a
                [routerLink]="item.route"
                routerLinkActive="!text-slate !border-l-olive bg-olive-pale font-semibold"
                [routerLinkActiveOptions]="{ exact: false }"
                class="flex items-center gap-3 px-5 py-2 text-sm font-medium text-muted no-underline border-l-2 border-transparent transition-colors hover:text-ink hover:bg-surface"
              >
                @if (item.icon) {
                  <span aria-hidden="true">{{ item.icon }}</span>
                }
                <span class="flex-1">{{ item.label }}</span>
                @if (item.badgeCount; as count) {
                  <span class="ml-auto bg-amber text-white font-mono text-[10px] font-medium px-1.5 rounded-full min-w-[18px] text-center">
                    {{ count }}
                  </span>
                }
              </a>
            </li>
          }
        </ul>
      }
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  readonly items = input.required<SidebarItem[]>();

  protected readonly groups = () => {
    const items = this.items();
    const sections = new Map<string, SidebarItem[]>();
    for (const item of items) {
      const key = item.section ?? '';
      if (!sections.has(key)) sections.set(key, []);
      sections.get(key)!.push(item);
    }
    return Array.from(sections.entries()).map(([section, items]) => ({ section, items }));
  };
}
