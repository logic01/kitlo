# Sub-task tracker

> Granular, resumable breakdown of the current main task. See `docs/tasks.md` for the main task list.

---

## Active main task: 3.8 → 3.7 → 3.6 (combined — natural dependency order)

> Tasks.md lists these as 3.6, 3.7, 3.8 but 3.6's auth/role guards depend on 3.8's AuthService and 3.7's state. Executing in dependency order; main-task status in tasks.md still uses original numbers.

### Goal
Stand up the auth + state foundation needed to make routes work without a backend: a mock `AuthService` (signal-backed currentUser in localStorage with role switcher), guards that read it, and routes that use the layouts from 3.5.

### Sub-tasks
| # | Sub-task | Status |
|---|----------|--------|
| A | 3.8 — Mock AuthService + dev role switcher (RoleSwitcher component) | ⬜ Pending |
| B | 3.7 — Scaffold state management (signal stores in `core/state/`) | ⬜ Pending |
| C | 3.6 — App routing with `authGuard`/`roleGuard`, lazy feature areas | ⬜ Pending |
| D | Verify build/lint/test all clean | ⬜ Pending |

---

## Completed

### 3.5 — Build layout components ✅
4 layouts (PublicLayout, AuthenticatedLayout, AdminLayout, MobileLayout) in `src/app/layouts/`. Each renders `<router-outlet />`; they'll be used as parent routes in 3.6.

---

## Completed

### 3.4 — Build shared component library ✅

47 components across 7 categories + 3 pipes + 5 domain model files. Bundle 289 kB initial / 76 kB transfer.

| # | Sub-task | Status |
|---|----------|--------|
| 3.4.1 | Foundation primitives: Button, Input, FormField, Avatar, Badge, StatusBadge, StatusDot, TagPill, Spinner, Skeleton | ✅ Done |
| 3.4.2 | Pipes: MoneyPipe, DateRangePipe, ConditionLabelPipe | ✅ Done |
| 3.4.3 | Layout & nav: Footer, TopNav, Sidebar, MobileTabBar, PageHeader, Tabs, Stepper, ProgressBar (RoleSwitcher → 3.8) | ✅ Done |
| 3.4.4 | Cards: ListingCard, ProfileCard, BookingCard, StepCard, TrustCard, ConditionCard, StatCard, ReviewCard, ReviewSummary, QueueItem | ✅ Done |
| 3.4.5 | Forms & inputs: SearchBar, Toggle, StarInput, ConditionRatingInput, DateRangeInput, AvailabilityCalendar, TagPillGroup, UploadZone, PhotoGrid, StripePaymentForm (stub), MapView (stub), FilterSidebar | ✅ Done |
| 3.4.6 | Data display: PhotoGallery, SpecTable, CostTable, DataTable, Timeline, CountdownDisplay, BookingSidebar, PhotoCompare | ✅ Done |
| 3.4.7 | Feedback: Alert, Modal, ConfirmDialog, EmptyState | ✅ Done |
| 3.4.8 | Marketing blocks: Hero, OliveBand, DarkBand, ConditionGrid | ✅ Done |

---

## Completed

### 3.3 — Identify common components across pages ✅
- `docs/components.md` — 60+ components inventoried across 7 categories (foundation, layout, cards, forms, data display, feedback, marketing). Each has selector, style.css mapping, inputs/outputs, notes. Build order specified for 3.4.



### 3.1 — Verify Angular project setup ✅
- 3.1.1 Tailwind v4 (`@tailwindcss/postcss` + `@import 'tailwindcss'`)
- 3.1.2 ESLint flat config (`angular-eslint` 21.3) + `npm run lint`
- 3.1.3 `src/environments/{environment.ts, environment.development.ts}` + `fileReplacements`
- 3.1.4 Build / lint / dev build / tests all pass

### 3.2 — Port brand/style.css design tokens into Tailwind theme ✅
- 3.2.1 `@theme` block in `src/styles.css` with brand colors, fonts, type scale (with line-height + tracking per size), radius
- 3.2.2 Non-Tailwind tokens (`--kitlo-max-width`, `--kitlo-page-gutter`, `--kitlo-transition-*`) kept as `:root` vars
- 3.2.3 Replaced Angular CLI boilerplate `app.html` with brand smoke-test using `bg-bone`, `text-slate`, `font-condensed`, `text-display`, `bg-olive-pale`, condition badges, etc. Build/lint/test all clean (194 kB bundle).
