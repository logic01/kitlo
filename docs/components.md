# Kitlo — Frontend Component Inventory

> Output of task 3.3. Cross-reference of `docs/pages.md`, `docs/layouts/*.html`, and `docs/layouts/style.css` (44 sections). Every component listed here is the input to task 3.4 (build shared library).
>
> **Selector convention:** `app-` prefix, kebab-case (`app-listing-card`).
> **Inputs/outputs:** Angular signals — `input()`, `output()`, `model()`.
> **Source of truth for styling:** the matching `.class` in `docs/layouts/style.css`. New components needed for runnable shells (Toast, Skeleton, role switcher, etc.) are flagged "NEW".

---

## 1. Foundation primitives

| Component | Selector | Maps to | Inputs | Outputs | Notes |
|---|---|---|---|---|---|
| Button | `app-button` | `.btn`, `.btn-primary/-secondary/-olive/-ghost/-outline`, size `-sm/-lg`, `--condensed` | `variant: 'primary'\|'secondary'\|'olive'\|'ghost'\|'outline'`, `size: 'sm'\|'md'\|'lg'`, `condensed: boolean`, `disabled`, `type` | `(click)` | Renders `<button>` or `<a>` based on presence of `href` input. Icon slot via content projection. |
| Input | `app-input` | `.input` | `type`, `placeholder`, `disabled`, `error: string\|null`, `model value` | `(blur)` | Used inside `app-form-field`. Supports prefix/suffix slots. |
| FormField | `app-form-field` | `.form-group`, `.input-label`, `.form-error` | `label`, `hint`, `error`, `required` | — | Wraps `app-input`/native control with label + error. |
| Avatar | `app-avatar` | `.avatar`, `.avatar-sm/-md/-lg`, `.avatar-slate/-olive/-brown` | `name` (initials), `imageUrl?`, `size`, `tone` | — | Falls back to initials on a brand-tone bg. Use NgOptimizedImage when imageUrl present. |
| Badge | `app-badge` | `.badge-verified`, `.badge-condition`, `.badge-mint/-field-ready/-battle-scarred`, `.tag-type` | `kind: 'verified'\|'condition'\|'gear-type'`, `condition?: 'mint'\|'field-ready'\|'battle-scarred'`, `label` | — | `kind="verified"` ignores condition. |
| StatusBadge | `app-status-badge` | `.status-badge`, `.status-{confirmed,active,returned,completed,disputed,cancelled,draft,pending,paused,flagged,archived}` | `status: BookingStatus\|ListingStatus` | — | Type union from domain models. |
| StatusDot | `app-status-dot` | `.status-dot`, `.dot-{active,confirmed,disputed,pending,paused}` | `tone` | — | Indicator-only variant. |
| Chip / TagPill | `app-tag-pill` | `.tag-pill`, `.selected`, `.selected-amber` | `selected: boolean`, `tone: 'slate'\|'amber'`, `label` | `(toggle)` | Used in review submission and filter chips. |
| Spinner | `app-spinner` | NEW | `size`, `tone` | — | Inline loader. Hand-rolled SVG or CSS keyframes. Used inside async buttons + skeleton fallbacks. |
| Skeleton | `app-skeleton` | NEW (style: pulsing `.bg-surface`) | `variant: 'card'\|'line'\|'avatar'\|'image'`, `count` | — | Loading placeholders. Built in 3.18. |

---

## 2. Layout & navigation

| Component | Selector | Maps to | Inputs | Outputs | Notes |
|---|---|---|---|---|---|
| PublicLayout | `app-public-layout` | `.nav` + `.footer` shell | `transparent: boolean` | — | Used by public pages. Slots: default content. |
| AuthenticatedLayout | `app-authenticated-layout` | `.app-shell` + `.sidebar` + `.main-content` | — | — | Reads current role from AuthService to decide which sidebar items render. |
| AdminLayout | `app-admin-layout` | `.app-shell` (admin-themed sidebar) | — | — | Same shell, admin nav items. |
| MobileLayout | `app-mobile-layout` | `docs/layouts/mobile/` bottom-tab pattern | — | — | Renders `app-mobile-tab-bar` at the bottom; expects single content slot. |
| Header / TopNav | `app-top-nav` | `.nav`, `.nav-logo`, `.nav-links`, `.nav-right` | `currentUser: User\|null`, `mode: 'public'\|'authenticated'\|'minimal'` | `(signOut)` | Includes role switcher (NEW, dev-only) when `currentUser` present. |
| Sidebar | `app-sidebar` | `.sidebar`, `.sidebar-section-label`, `.sidebar-item`, `.sidebar-badge` | `items: SidebarItem[]`, `activeRoute: string` | — | `SidebarItem = { label, route, icon?, badgeCount?, section? }`. |
| MobileTabBar | `app-mobile-tab-bar` | mobile layout bottom nav | `items: TabItem[]`, `activeRoute` | — | NEW — patterned from `docs/layouts/mobile/`. |
| Footer | `app-footer` | `.footer`, `.footer-logo/-copy/-links` | `links?: FooterLink[]` | — | — |
| PageHeader | `app-page-header` | `.page-header`, `.page-breadcrumb`, `.page-title`, `.page-subtitle`, `.page-header-actions` | `title`, `subtitle?`, `breadcrumbs?: Crumb[]` | — | Action slot via content projection. |
| Tabs | `app-tabs` | `.tabs`, `.tab`, `.tab-count`, `.tab-panel` | `tabs: TabDef[]`, `activeId` | `(activeIdChange)` | `TabDef = { id, label, count? }`. Two-way binding via `model()`. |
| Stepper | `app-stepper` | `.stepper`, `.stepper-step`, `.stepper-num`, `.stepper-label`, `.completed`, `.active` | `steps: StepDef[]`, `currentIndex` | — | Linear wizard indicator. |
| ProgressBar | `app-progress-bar` | `.progress-bar-wrap`, `.progress-bar-fill` | `value` (0–1) | — | Thin top-of-page variant for onboarding. |
| RoleSwitcher | `app-role-switcher` | NEW | — | `(roleChange: 'renter'\|'lister'\|'admin'\|'guest')` | Dev-only. Hidden in production via env flag. Used by `app-top-nav` to swap mock user without re-signup. |

---

## 3. Cards & content blocks

| Component | Selector | Maps to | Inputs | Outputs | Notes |
|---|---|---|---|---|---|
| ListingCard | `app-listing-card` | `.listing-card`, `-img/-body/-header/-name/-sub/-footer/-price/-lister-name/-rating` | `listing: Listing` | `(click)` | Routes to `/listing/:id`. Includes `app-badge` (condition + verified) and `.tag-type`. |
| ProfileCard | `app-profile-card` | `.profile-card`, `.profile-name/-meta/-gear/-price/-cond-tag` | `profile: ProfileSummary` | — | Used on homepage right column + listing detail lister block. |
| BookingCard | `app-booking-card` | `.booking-card`, `.booking-card-img`, `.booking-gear-name`, `.booking-meta`, `.booking-party`, `.booking-card-right` | `booking: Booking` | `(click)` | Routes to `/booking/:id`. Includes `app-status-badge`. |
| StepCard | `app-step-card` | `.step-card`, `.step-num`, `.step-title`, `.step-body` | `number`, `title`, `body` | — | How-it-works marketing card. |
| TrustCard | `app-trust-card` | `.trust-card`, `.trust-card-label/-title/-body` | `label`, `title`, `body` | — | Used inside `.dark-band`. |
| ConditionCard | `app-condition-card` | `.condition-card`, `.condition-name`, `.condition-desc` | `condition: 'mint'\|'field-ready'\|'battle-scarred'`, `description` | — | Three-up grid via `.condition-grid`. |
| StatCard | `app-stat-card` | `.stat-card`, `.stat-overline`, `.stat-value`, `.stat-sublabel`, `.stat-primary/-pending` | `overline`, `value`, `sublabel?`, `tone?: 'default'\|'primary'\|'pending'` | — | Earnings dashboard. Render formatted dollars in Roboto Mono. |
| ReviewCard | `app-review-card` | `.review-card`, `.review-header`, `.review-reviewer`, `.review-name`, `.review-date`, `.review-stars`, `.review-star`, `.review-accuracy`, `.review-text`, `.review-tags`, `.review-tag` | `review: Review` | — | Star block computed from rating. Accuracy chip variants `accurate/somewhat/inaccurate`. |
| ReviewSummary | `app-review-summary` | `.review-summary`, `.review-summary-score/-count` | `averageRating`, `count` | — | Above review list on listing detail. |
| QueueItem | `app-queue-item` | `.queue-item`, `.queue-item-name/-meta`, `.queue-reason`, `.sla-countdown` | `item: AdminQueueItem` | `(click)` | Admin review/dispute list rows. Reason tone: `high-value` or `flagged`. |

---

## 4. Forms & inputs

| Component | Selector | Maps to | Inputs | Outputs | Notes |
|---|---|---|---|---|---|
| SearchBar | `app-search-bar` | `.search-bar`, `.hero-search` | `variant: 'hero'\|'sticky'`, `defaultLocation?`, `defaultType?` | `(submit: SearchQuery)` | Emits typed query; consumer routes to `/search`. |
| FilterSidebar | `app-filter-sidebar` | composed: `.input` (price), checkboxes, `app-toggle`, dropdowns | `filters: SearchFilters`, `model: SearchFilters` | `(change)` | Two-way bind via `model()`. URL-synced in 3.20. |
| Toggle | `app-toggle` | `.toggle-wrap`, `.toggle`, `.toggle-track`, `.toggle-thumb`, `.toggle-label`, `.toggle-sub` | `label`, `sub?`, `model checked: boolean` | — | — |
| StarInput | `app-star-input` | `.star-input`, `.star-btn`, `.filled` | `model value: 1\|2\|3\|4\|5` | — | Used in review submission. |
| ConditionRatingInput | `app-condition-rating-input` | `.condition-card` selectable variant | `model value: 'mint'\|'field-ready'\|'battle-scarred'` | — | Three large tap-cards for listing creation. |
| DateRangeInput | `app-date-range-input` | `.date-picker-row`, `.date-picker-cell`, `.date-picker-label/-value` | `min?: Date`, `max?: Date`, `blocked?: Date[]`, `model range: { start, end }` | — | Trigger surface on listing detail booking sidebar. Opens `app-availability-calendar` popover. |
| AvailabilityCalendar | `app-availability-calendar` | `.calendar`, `.cal-header`, `.cal-month`, `.cal-nav-btn`, `.cal-weekdays`, `.cal-grid`, `.cal-day` (states: today/booked/blocked/pending/selected/in-range), `.cal-legend` | `month: Date`, `blockedDates: Date[]`, `bookedDates: Date[]`, `pendingDates: Date[]`, `mode: 'view'\|'select-range'`, `model range?: DateRange` | `(monthChange)` | Read-only and selectable modes. Heart of booking flow + lister availability mgmt. |
| TagPillGroup | `app-tag-pill-group` | repeated `.tag-pill` | `options: PillOption[]`, `model selected: string[]` | — | Multi-select chip group used in review tags + filter chips. |
| UploadZone | `app-upload-zone` | `.upload-zone`, `.upload-zone-icon/-title/-sub`, `.dragover` | `accept?`, `maxSize?`, `multiple?` | `(filesAdded: File[])` | Stub for Cloudinary upload (3.4 stub; real wiring in 5.5). Dragover state. |
| PhotoGrid | `app-photo-grid` | `.photo-grid`, `.photo-thumb`, `.photo-thumb-remove`, `.hero-thumb`, `.hero-thumb-label` | `photos: ListingPhoto[]`, `heroIndex: number` | `(remove: index)`, `(setHero: index)`, `(reorder: { from, to })` | Listing creation editor. |
| StripePaymentForm | `app-stripe-payment-form` | NEW (visual only) | `amountCents: number` | `(submit: { paid: true })` | Stub component — renders a fake card-input UI matching brand. Real Stripe Elements wiring in 5.4. |
| MapView | `app-map-view` | NEW | `pins: MapPin[]`, `center?: { lat, lng }` | `(pinClick: MapPin)` | Stub — renders a styled placeholder div with pin list. Real Mapbox wiring in 5.7. |

---

## 5. Data display

| Component | Selector | Maps to | Inputs | Outputs | Notes |
|---|---|---|---|---|---|
| PhotoGallery | `app-photo-gallery` | `.photo-gallery`, `.photo-hero`, `.photo-thumb-strip`, `.thumb`, `.thumb.active` | `photos: string[]`, `model activeIndex` | — | Listing detail. Click thumb swaps hero. |
| SpecTable | `app-spec-table` | `.spec-table`, `.spec-row`, `.spec-key`, `.spec-value` | `rows: { key, value }[]` | — | Listing detail specs. |
| CostTable | `app-cost-table` | `.cost-table`, `.cost-row`, `.cost-label`, `.cost-value`, `.cost-total`, `.cost-deposit-row` | `lines: CostLine[]`, `total: Money`, `deposit?: Money` | — | Used at checkout + listing-detail booking sidebar. |
| DataTable | `app-data-table` | `.data-table`, `.td-mono/-name/-actions` | `columns: ColumnDef[]`, `rows: T[]`, `rowHref?: (row) => string` | `(rowClick)` | Generic admin tables. Action slot per row. |
| Timeline | `app-timeline` | `.timeline`, `.timeline-item`, `.timeline-dot` (states `done/now/alert`), `.timeline-event/-ts/-detail` | `events: TimelineEvent[]` | — | Booking event history. |
| CountdownDisplay | `app-countdown-display` | `.countdown-display`, `.countdown-number/-unit`, `.urgent` | `targetDate: Date`, `urgentWithinHours?: number` | — | Active rental return timer. |
| BookingSidebar | `app-booking-sidebar` | `.booking-sidebar`, `.booking-sidebar-price` | `listing: Listing`, `model range: DateRange` | `(book)` | Sticky sidebar on listing detail. Composes DateRangeInput + CostTable + Button. |
| PhotoCompare | `app-photo-compare` | `.photo-compare`, `.photo-compare-col/-label/-img`, `.label-ts` | `before: Photo`, `after: Photo` | — | Admin dispute evidence side-by-side. |

---

## 6. Feedback & overlays

| Component | Selector | Maps to | Inputs | Outputs | Notes |
|---|---|---|---|---|---|
| Alert | `app-alert` | `.alert`, `.alert-info/-success/-warning/-danger`, `.alert-label` | `tone: 'info'\|'success'\|'warning'\|'danger'`, `label?`, `message` | `(dismiss)` | Inline. Action slot for buttons. |
| Modal | `app-modal` | `.modal-overlay`, `.modal`, `.modal-header/-title/-close/-body/-footer` | `model open: boolean`, `title`, `size?: 'sm'\|'md'\|'lg'` | `(close)` | Header/body/footer projected slots. Trap focus. Escape closes. |
| Toast | `app-toast` (host) + `ToastService` | NEW | service-driven | — | NEW — built in 3.17. Singleton overlay. ToastService.show({ tone, message, action? }). |
| EmptyState | `app-empty-state` | `.empty-state`, `.empty-state-icon/-title/-body` | `icon?`, `title`, `body`, `actionLabel?` | `(action)` | Used in zero-result lists, empty bookings, etc. |
| ConfirmDialog | `app-confirm-dialog` | `.modal` variant | `title`, `body`, `confirmLabel`, `confirmTone?: 'primary'\|'danger'` | `(confirm)`, `(cancel)` | Composes `app-modal`. |
| ErrorPage404 | `app-error-404` | composed of `app-empty-state` + layout | — | — | Built once; routed via wildcard. |
| ErrorPage500 | `app-error-500` | composed | — | — | Triggered by global ErrorHandler. |

---

## 7. Marketing blocks (homepage / how-it-works)

| Component | Selector | Maps to | Inputs | Outputs |
|---|---|---|---|---|
| Hero | `app-hero` | `.hero`, `.hero-inner/-left/-right/-issue/-heading/-sub/-search` | `kicker?`, `headline`, `accent?`, `sub?`, `showSearch: boolean` | `(search: SearchQuery)` |
| OliveBand | `app-olive-band` | `.olive-band`, `.olive-band-inner/-label/-headline/-sub/-pillars/-pillar` | `label`, `headline`, `sub`, `pillars: { title, body }[]` | — |
| DarkBand | `app-dark-band` | `.dark-band`, `.dark-band-inner/-heading/-sub/-grid` | `heading`, `accent?`, `sub`, `cards: TrustCardData[]` | — |
| ConditionGrid | `app-condition-grid` | `.condition-grid`, `.condition-card` | — | — | Renders three `app-condition-card` with brand copy. Static. |
| TopoTexture | `app-topo-texture` | `.topo-texture` | — | — | Decorative background — applied as a class wrapper. May not need its own component. |

---

## 8. Cross-cutting (state-only or service-driven)

| Name | Kind | Notes |
|---|---|---|
| AuthGuard | route guard | Redirects to `/auth/login` if no current user. Reads `AuthService.currentUser()`. |
| RoleGuard | route guard | Factory: `roleGuard('lister' \| 'admin')`. 403 page if logged in but wrong role. |
| ToastService | service | Singleton. Methods: `success/info/warning/error`. Pushes to a signal consumed by `app-toast`. |
| LoadingSignalDirective | directive | `[loading]="signal"` — projects a skeleton over its content while the signal is true. |
| FocusTrapDirective | directive | Used by `app-modal`. |
| MoneyPipe | pipe | `{{ cents \| money }}` → `$120.00`. All money is cents per CLAUDE.md. |
| DateRangePipe | pipe | `{{ range \| dateRange }}` → `Jan 12 → Jan 16 · 4 days`. |
| ConditionLabelPipe | pipe | Maps enum `'mint'` → `Mint`, etc. |

---

## Decisions / open questions

- **No tooltip primitive in style.css.** Pages.md mentions tooltips on form fields — punt on this until a real need arises in 3.12+; native `title` may suffice for shells.
- **Pagination / load-more.** Two patterns appear in pages.md (numbered + load-more). Recommend a single `app-load-more` button for now (mock data is small); add `app-pagination` only if/when admin tables need it.
- **The `pages.md` references to Clerk and Next.js App Router are stale** — we are Angular + mock auth. Treat the route paths as informative, the framework specifics as ignorable.
- **Bundle listing UI variants** (feature 22) reuse ListingCard with a "BUNDLE" `tag-type` and a two-column spec table on the detail page. No separate component class needed.
- **Verified Hunter badge** is `app-badge kind="verified"` — not a separate component.
- **Mobile-only components** are: `app-mobile-tab-bar`, plus filter/booking bottom sheets. Bottom sheets can be modeled as `app-modal size="sheet"` variant — add a sheet style to the modal component instead of a new one.

---

## Build order for 3.4

Bottom-up so each layer composes the prior:

1. **Foundation:** Button, Input, FormField, Avatar, Badge, StatusBadge, StatusDot, TagPill, Spinner, Skeleton, MoneyPipe, DateRangePipe.
2. **Layout shells:** Footer, TopNav, Sidebar, MobileTabBar, PageHeader, Tabs, Stepper, ProgressBar, RoleSwitcher, PublicLayout, AuthenticatedLayout, AdminLayout, MobileLayout — wired in 3.5 but components scaffolded in 3.4.
3. **Cards:** ListingCard, ProfileCard, BookingCard, StepCard, TrustCard, ConditionCard, StatCard, ReviewCard, ReviewSummary, QueueItem.
4. **Forms / inputs:** SearchBar, Toggle, StarInput, ConditionRatingInput, DateRangeInput, AvailabilityCalendar, TagPillGroup, UploadZone (stub), PhotoGrid, StripePaymentForm (stub), MapView (stub), FilterSidebar.
5. **Data display:** PhotoGallery, SpecTable, CostTable, DataTable, Timeline, CountdownDisplay, BookingSidebar, PhotoCompare.
6. **Feedback:** Alert, Modal, ConfirmDialog, EmptyState. (Toast + skeleton patterns finalized in 3.17/3.18.)
7. **Marketing blocks:** Hero, OliveBand, DarkBand, ConditionGrid, TopoTexture.

`docs/layouts/template.html` (1342 lines) is the live demo of all of these — once 3.4 is built, the same template should render in Angular by composing these components.
