# Kitlo Codebase — Overlanding Pivot Implementation Plan

> Saved 2026-05-10. Pairs with the doc-level pivot in `docs/business-plan.md`, `docs/gear-catalogue.md`, `docs/brand.md`, `docs/features/03-create-listing.md`, `docs/features/22-bundle-listing.md`, `docs/features/23-category-listing-rules.md`. Implementation deferred — no code changes yet.

## Context

The docs landed in `kitlo/docs/` (CLAUDE.md, business-plan.md, gear-catalogue.md, brand.md, features/03/18/22/23, personas.md) pivot Kitlo from "hunting equipment only" to **overlanding-led with five verticals**:

1. **Camping & Overlanding** — Phase 1 anchor
2. **Night Hunting Optics** — Phase 1 (already implemented as the only vertical)
3. **Portable Power Stations** — Phase 1 bundle add-on only
4. **Fly Fishing** — Phase 2 layered vertical
5. **Smokers & Pizza Ovens** — Phase 2+ provisional, **NOT BUILT** in this codebase

The current code only models hunting optics: `GearType` enum is a flat list of 6 values (`Thermal, NightVision, TreeStand, Optics, Pack, Other`); seed data ships 2 hunting listings; create-listing wizard, search filter sidebar, and ~7 marketing-copy pages reference "hunting" hardcoded.

**Goal:** restructure the codebase so overlanding is the anchor vertical, hunting optics keeps working unchanged, and the architecture supports the four open verticals without a second pivot. Per-vertical attestation/spec fields stay in the existing `ListingSpec` key/value rows for now and get promoted to typed columns later if the data shape proves out.

**User-confirmed decisions:**
- **Taxonomy:** add a `Vertical` column on `Listing` AND expand `GearType` for sub-categorization. One source of truth per concept.
- **Wire format:** switch backend listing JSON from int enums → string enums via `JsonStringEnumConverter`. Eliminates the positional `GEAR_TYPES` array in `listings.service.ts` that currently must stay in lock-step with the C# enum int values.

---

## Architecture

### Two-tier taxonomy

```
Vertical (4 values, drives business rules)
└── GearType (~25 values, drives sub-category UX and search)
    └── ListingSpec rows (free-form key/value, drives per-listing details)
```

- `Vertical` → drives admin review triggers, deposit tier modifiers, attestation flow, walkthrough script, and search filter primary axis. Lives on `Listing` as a typed column.
- `GearType` → drives the create-listing wizard's category step, search filter secondary axis, and listing card label. Expands additively (existing values 0–5 stay; new values start at 10+).
- `ListingSpec` → already exists; becomes the home for per-vertical attestations (vehicle-fit info, US-Person attestation, UL cert #, sole material). Promoted to typed columns later if a column-level need emerges.

### Wire format

Register `JsonStringEnumConverter` in `Program.cs`. All enum properties on Listing/Booking/etc. serialize as their member name (`"vertical": "overlanding"`, `"gearType": "rooftopTent"`). Removes the int↔string array mapping in `listings.service.ts`.

### Smokers/pizza vertical

**Backend allowlist** in a new `Kitlo.Core/Catalogue/VerticalRules.cs` rejects `Vertical.SmokerPizza` (or just doesn't include the value at all in the enum) on publish. **Frontend hide** is convenience only; backend is the authority. Phase 2+ is when this opens.

---

## Phased Rollout

### Phase 1 — Schema + Enum Foundation (S/M)

Backend changes that ship as one PR. Leaves the running app working for the existing 2 seed listings.

**Files:**
- `backend/Kitlo.Core/Enums/Enums.cs`
  - **Add** `Vertical` enum: `Overlanding=0, HuntingOptics=1, PowerStation=2, FlyFishing=3`. (No SmokerPizza — gated at the type level.)
  - **Expand** `GearType` additively. Keep existing 0–5. Add: overlanding (`RooftopTent=10, Awning=11, Fridge12V=12, DualBattery=13, RecoveryBoard=14, AirCompressor=15, Navigation=16, CampKitchen=17, OverlandKit=18`), optics expansions (`ThermalMonocular=20, ThermalScope=21, ClipOnThermal=22, NvScope=23, ClipOnNv=24`), power (`PowerStation=30, SolarPanel=31`), fly fishing (`Wader=40, WadingBoot=41, FlyRodReel=42, FlyPack=43, SpecialtyWeight=44, FloatTube=45`).
- `backend/Kitlo.Core/Models/Listing.cs`
  - **Add** `public Vertical Vertical { get; set; }` property.
  - **Code comment** on `GearTypeLabel` marking it user-authored display text (kept; revisit removal later).
- `backend/Kitlo.Core/Catalogue/VerticalRules.cs` *(new)*
  - `VerticalToGearTypes` static map (e.g., `Overlanding → [RooftopTent, Awning, Fridge12V, ...]`).
  - `IsValid(Vertical, GearType)` predicate for publish validation.
- `backend/Kitlo.Api/Program.cs`
  - Register `JsonStringEnumConverter`: `builder.Services.AddControllers().AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)))`.
  - (Same for the OpenAPI doc options if needed for schema accuracy.)
- `backend/Kitlo.Api/Services/ListingService.cs` (or whichever owns publish)
  - Validate `(Vertical, GearType)` combo via `VerticalRules.IsValid` on create + publish. Return 422 if mismatch or if `Vertical` is one we don't support yet.
- `backend/Kitlo.Data/Migrations/{timestamp}_AddVerticalToListing.cs` *(new)*
  - Adds `Vertical` int NOT NULL DEFAULT 1 (HuntingOptics) — backfills existing 2 seed listings with `HuntingOptics`. No downtime.

**Verification:**
- `dotnet ef database update` succeeds.
- `GET /api/listings` returns `{ "vertical": "huntingOptics", "gearType": "thermal", ... }` (strings, not ints) for the seeded listings.
- POST a draft with `vertical: "overlanding", gearType: "rooftopTent"` succeeds; with `vertical: "overlanding", gearType: "thermal"` returns 422.

---

### Phase 2 — Frontend Type Sync (S)

Ships with Phase 1 in the same PR. The two are meaningless apart.

**Files:**
- `frontend/src/app/core/models/listing.ts`
  - **Add** `Vertical` string-literal union: `'overlanding' | 'huntingOptics' | 'powerStation' | 'flyFishing'`.
  - **Expand** `GearType` to match backend enum names verbatim in camelCase (`'thermal' | 'nightVision' | 'rooftopTent' | 'awning' | ...`).
  - Add `vertical: Vertical` to `ListingSummary` and `Listing` interfaces.
- `frontend/src/app/core/services/listings.service.ts` lines 98–119
  - **Delete** `GEAR_TYPES` array, `gearTypeFromInt`, `gearTypeToInt`, `gearTypeMap` callers.
  - Update `BackendListingSummary` / `BackendListing` types to declare `vertical: Vertical` and `gearType: GearType` as strings (no more `number`).
  - `mapSummary` / `mapListing` pass values through unchanged (no conversion).
  - Keep similar treatment for `Condition` and `CancellationPolicy` if those also flip to string enums (recommend: yes, same converter handles all).
- `frontend/src/app/core/catalogue/vertical-rules.ts` *(new)*
  - `VERTICAL_CATEGORY_MAP: Record<Vertical, GearType[]>` mirroring backend's `VerticalToGearTypes`.
  - `verticalLabel(v: Vertical): string` and `gearTypeLabel(g: GearType): string` for UI display.
  - `gearTypeToVertical(g: GearType): Vertical` reverse lookup.

**Verification:**
- `npm run build` passes with strict TS, no `any`.
- Existing pages (home, search, listing detail) render unchanged with the seeded data.
- Network tab shows string enum values.

---

### Phase 3 — Create-Listing Wizard (M/L)

Largest user-visible change. Restructures the wizard from 4 → 6 steps.

**File:** `frontend/src/app/features/dashboard/pages/listing-create/listing-create.ts`

**Step changes:**
- **Step 0 (new): Vertical** — single-select pill group of 4 verticals. Smokers absent.
- **Step 1 (new): Category** — single-select pill group filtered from `VERTICAL_CATEGORY_MAP[selectedVertical]`. (Verify `tag-pill-group` supports a single-select mode; if not, add it as a small companion change in `shared/components/tag-pill-group/`.)
- **Step 2: Basics** — title, description, pickup ZIP, condition. Same as current Step 0 minus the category pill group (now its own step).
- **Step 3: Photos** — unchanged.
- **Step 4: Pricing** — unchanged. Plus a **non-blocking nudge** when `vertical === 'powerStation'`: `<app-alert tone="info">` "Power stations rent best as part of an overlanding bundle. [Bundle this with other gear]" linking to `/dashboard/bundles/new` (passes the draft listing id).
- **Step 5: Review** — surface vertical + category prominently in the summary card.

**Per-category suggested specs (minimal scope for Phase 3):**
- `SuggestedSpecKeys: Record<GearType, string[]>` constant in `vertical-rules.ts` listing the keys a renter expects (e.g. `RooftopTent → ['Mount type', 'Load rating (lbs)', 'Sleeping capacity', 'Setup time (min)']`).
- Wizard renders these as pre-filled empty `<app-form-field>` rows in Step 2 the lister can complete; values flow into the existing `ListingSpec` rows on publish.
- This delivers the per-vertical UX of `features/23-category-listing-rules.md` without any new schema.

**Wire to backend:** the `publish()` flow now sends `vertical` + `gearType` (string) and a `specs[]` array (already supported by `addPhotos` / specs API — confirm endpoint signature). The current first-element-of-categories pattern (lines 323–331) is removed.

**Verification:**
- Create one listing per vertical end-to-end. Confirm DB row has correct `Vertical` int + `GearType` int.
- Confirm spec rows persist for the suggested keys filled in.
- Confirm vertical=Overlanding + gearType=Thermal is rejected by backend (422 surfaces in the error alert).
- Confirm Smokers vertical does not appear in the picker.

---

### Phase 4 — Bundle Create + Search Filter Sidebar (S/M)

**`bundle-create.ts`:**
- Show vertical + gear-type badges next to each child listing in the eligible-listings list.
- Compute a derived `bundleVertical` (all-children-same → that vertical; mixed → "Mixed"). Display in the bundle summary.
- Update the example info-alert copy from "Elk season" thermal+NV to mention overlanding kits as the canonical bundle.
- (No backend bundle-vertical column yet — derive client-side; promote later if admin queue needs it.)

**`shared/components/filter-sidebar/filter-sidebar.ts`:**
- **Add** a new `Vertical` filter section (chip group, single-select) above the existing `Gear type` section.
- `GEAR_OPTIONS` becomes a `computed()` filtered by selected vertical from `VERTICAL_CATEGORY_MAP`. When no vertical is selected, hide the gear-type sub-filter (cleaner than dumping all 25 options).
- Update `SearchFilters` interface to include `vertical?: Vertical`.

**`features/public/pages/search/search.ts`:**
- `KNOWN_GEAR_TYPES` becomes derived from `VERTICAL_CATEGORY_MAP` flattened, not hardcoded.
- Add `vertical` to URL query parameter handling — read in `ngOnInit` equivalent, write in the existing query-string sync from `tasks.md` 3.20.

**`backend/Kitlo.Api/Controllers/ListingsController.cs` Search endpoint:**
- Add optional `vertical` query parameter; filter listings where `l.Vertical == vertical` when provided.

**Verification:**
- Filter `vertical=overlanding` in the URL → only overlanding listings return.
- Combine `vertical=overlanding&gearType=rooftopTent` → narrowed.
- URL params round-trip on page reload.

---

### Phase 5 — Marketing Copy Refresh (S)

Mechanical rewrite. Voice from `docs/brand.md` and `docs/business-plan.md`. Lead with overlanding; mention all four open verticals naturally; hunting optics gets a paragraph not the headline.

**Files (already inventoried):**
- `frontend/src/app/features/public/pages/early-access/early-access.ts` (lines 43, 135)
- `frontend/src/app/features/public/pages/about/about.ts` (lines 9, 12–14)
- `frontend/src/app/features/public/pages/home/home.ts` (lines 38, 53, 109)
- `frontend/src/app/features/public/pages/list-your-gear/list-your-gear.ts` (lines 11, 16)
- `frontend/src/app/features/public/pages/trust/trust.ts` (lines 132–136)
- `frontend/src/app/features/auth/pages/signup/signup.ts` (line 199)
- `frontend/src/app/features/dashboard/pages/bundle-create/bundle-create.ts` (lines 26, 32 — info alert example copy)

**Verification:**
- Grep `frontend/src/app/features/{public,auth,dashboard}` for `hunting`, `thermal`, `night vision` (case-insensitive). Confirm only contextually-correct usages remain (e.g., the hunting-optics vertical filter label).
- Visual walkthrough of `/`, `/about`, `/list-your-gear`, `/trust`, `/auth/signup`.

---

### Phase 6 — Seed Data Refresh (S)

**File:** `backend/Kitlo.Data/Seed/SeedData.cs`

- **Keep** the 2 existing optics listings (Pulsar Thermion + ATN X-Sight) — assign `Vertical = HuntingOptics`. Confirms the migration backfill works.
- **Add** for `jess@example.com`:
  - Roofnest Sparrow Eye RTT (`Vertical=Overlanding, GearType=RooftopTent`) with specs (mount type, load rating, sleeping capacity).
  - ARB Series III 2500 Awning (`Overlanding, Awning`).
  - Dometic CFX3 55IM fridge (`Overlanding, Fridge12V`) with specs (capacity, power draw, voltage).
  - MaxTrax MKII recovery board set (`Overlanding, RecoveryBoard`).
  - Bluetti AC180 power station (`PowerStation, PowerStation`) with specs (capacity Wh, AC output W, UL cert).
  - Simms G3 Guide stockingfoot waders (`FlyFishing, Wader`) — for Phase 2 vertical isn't empty in dev.
- **Add** one bundle: "Weekend Overland Kit" combining RTT + fridge + power station (3-child bundle).

Idempotency guard (`if Users.AnyAsync return`) stays. Document in `kitlo/CLAUDE.md` that existing dev DBs need a manual reset (`docker compose down -v && docker compose up -d`) to pick up new seed data.

**Verification:**
- Drop dev DB, re-run, confirm:
  - 7 listings + 1 bundle render in `/search`.
  - Vertical filter chips work correctly across the seed mix.
  - Bundle detail page resolves all 3 child listings.
  - Vertical badges show correctly on listing cards.

---

## Files to Modify (Summary)

**Backend:**
- `backend/Kitlo.Core/Enums/Enums.cs` — add `Vertical`; expand `GearType` (additive only).
- `backend/Kitlo.Core/Models/Listing.cs` — add `Vertical Vertical` property.
- `backend/Kitlo.Core/Catalogue/VerticalRules.cs` *(new)* — `VerticalToGearTypes` map + `IsValid` predicate.
- `backend/Kitlo.Api/Program.cs` — register `JsonStringEnumConverter`.
- `backend/Kitlo.Api/Services/ListingService.cs` — validate `(Vertical, GearType)` on create/publish.
- `backend/Kitlo.Api/Controllers/ListingsController.cs` — add `vertical` query param to Search.
- `backend/Kitlo.Data/Migrations/{timestamp}_AddVerticalToListing.cs` *(new)* — column + backfill HuntingOptics.
- `backend/Kitlo.Data/Seed/SeedData.cs` — refresh seed data.

**Frontend:**
- `frontend/src/app/core/models/listing.ts` — `Vertical` union; expanded `GearType`; `vertical` field on listing types.
- `frontend/src/app/core/services/listings.service.ts` — drop positional int helpers; pass strings through.
- `frontend/src/app/core/catalogue/vertical-rules.ts` *(new)* — `VERTICAL_CATEGORY_MAP`, label/lookup helpers, suggested specs.
- `frontend/src/app/features/dashboard/pages/listing-create/listing-create.ts` — vertical step + filtered category step + suggested specs + power-station bundle nudge.
- `frontend/src/app/features/dashboard/pages/bundle-create/bundle-create.ts` — vertical badges + derived bundle vertical.
- `frontend/src/app/shared/components/filter-sidebar/filter-sidebar.ts` — vertical filter section + computed gear options.
- `frontend/src/app/features/public/pages/search/search.ts` — `vertical` query param + derived `KNOWN_GEAR_TYPES`.
- `frontend/src/app/shared/components/tag-pill-group/tag-pill-group.ts` *(possibly)* — confirm/add single-select mode.
- 7 marketing-copy files (Phase 5).

---

## Reused Patterns

- **Reactive forms + signals:** `listing-create.ts` already uses `NonNullableFormBuilder` + signal-based step state. Phase 3 extends the same pattern; no new state-management approach.
- **`loadable()` helper** (`core/loading/loadable.ts`, per `tasks.md` 3.18): use for any new vertical-filtered list views in search.
- **`kitloValidators`** (`core/forms/validators.ts`): reuse for new pricing/spec validation (e.g., min capacity Wh on power stations).
- **`ListingSpec` rows** (existing): home for all per-vertical attestation data this phase. No new tables.
- **`HttpTestingController`** pattern from `listings.service.spec.ts` (5.2): use for the new vertical query parameter test.

---

## Suggested PR Sequencing

| PR | Phases | Why grouped |
|---|---|---|
| 1 | 1 + 2 | Schema and frontend type swap are inseparable — frontend breaks without backend's new wire format. |
| 2 | 3 | Largest user-visible UX change; ship alone for clean review and rollback. |
| 3 | 4 + 5 + 6 | "Verticals visible everywhere" — search, bundle, marketing, seed. Independent of PR 2 once types are aligned. |

---

## Effort Estimate

| Phase | Effort |
|---|---|
| 1: Schema + enum | S/M |
| 2: Frontend type sync | S |
| 3: Create-listing wizard | M/L |
| 4: Bundle + search filter | S/M |
| 5: Marketing copy | S |
| 6: Seed refresh | S |

---

## Verification (end-to-end after all phases)

1. **Reset dev DB:** `cd backend && docker compose down -v && docker compose up -d && dotnet run --project Kitlo.Api`.
2. **Browser:** open `http://localhost:4200`. Confirm all 4 verticals visible in search filter; vertical badges on listing cards; bundle "Weekend Overland Kit" renders with 3 children.
3. **Create-listing flow per vertical:**
   - Sign in as `jess@example.com`.
   - Create one listing per vertical (Overlanding/HuntingOptics/PowerStation/FlyFishing). Confirm category step is filtered, specs persist, publish succeeds.
   - Try to publish `vertical=Overlanding, gearType=Thermal` via DevTools-modified request → confirm 422.
4. **Search filter:** filter by each vertical individually + combined with gear-type sub-filter. Confirm URL round-trips.
5. **Marketing copy:** walk `/`, `/about`, `/list-your-gear`, `/trust`, `/auth/signup`. No hunting-only headlines remain; voice matches `docs/brand.md`.
6. **Backend tests:** `dotnet test` should pass; if there are tests on `ListingsService` they may need updates for the new `Vertical` field.
7. **Frontend tests:** `npm test` (vitest) — `listings.service.spec.ts` will need updates since `gearTypeFromInt` is gone; expect 1–2 broken tests to fix.
8. **Lint + build:** `npm run lint && npm run build` clean. `dotnet build` clean.
