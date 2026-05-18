# Plan — Multi-Marketplace Backend

> Single Kitlo backend serving multiple frontends (Overlanding now, Festival next, future Hunting). Listers pick which marketplaces a listing appears on; vertical-level policy gates restrict ineligible combinations (e.g., Hunting Optics never on Festival).

---

## 1. Naming

**Recommendation: `Marketplace`.**

"Frontend" is a tech concept (the Angular app). The domain concept is a *marketplace / storefront* — the audience-facing surface a listing appears on. A single domain term lets us reuse it across DB, API, and UI without confusion.

Considered + rejected: `Storefront` (acceptable but "marketplace" is what Kitlo already calls itself in business-plan.md), `Channel` (too marketing-flavored), `Surface` (too generic).

## 2. Domain Model

### 2.1 New enum

```csharp
// Kitlo.Core/Enums/Enums.cs
public enum Marketplace
{
    Overlanding = 0,
    Festival = 1,
    // Future: Hunting = 2
}
```

### 2.2 Listing ↔ Marketplace (many-to-many)

A listing is authored once; it can appear on 1..N marketplaces (subset of those its `Vertical` allows).

**Recommendation: join table `ListingMarketplace`** — normalized, indexable, EF-native.

```csharp
// Kitlo.Core/Models/Listing.cs
public class Listing
{
    // ...existing fields...
    public ICollection<ListingMarketplace> Marketplaces { get; set; } = [];
}

public class ListingMarketplace
{
    public Guid ListingId { get; set; }
    public Listing? Listing { get; set; }
    public Marketplace Marketplace { get; set; }
}
```

Considered + rejected:
- **Bitmask int column** — efficient but opaque; tooling/admin queries become painful.
- **JSON array column** — works in Postgres with GIN; less idiomatic EF and harder to JOIN against in search.

### 2.3 New rule map: `Vertical → allowed Marketplaces`

Source of truth for what's eligible where. Lives next to `VerticalRules.cs`:

```csharp
// Kitlo.Core/Catalogue/MarketplaceRules.cs
public static class MarketplaceRules
{
    public static readonly IReadOnlyDictionary<Vertical, Marketplace[]> VerticalToMarketplaces =
        new Dictionary<Vertical, Marketplace[]>
        {
            [Vertical.Overlanding]   = [Marketplace.Overlanding, Marketplace.Festival],
            [Vertical.PowerStation]  = [Marketplace.Overlanding, Marketplace.Festival],
            [Vertical.HuntingOptics] = [Marketplace.Overlanding],                  // never Festival
            [Vertical.FlyFishing]    = [Marketplace.Overlanding],
            [Vertical.IceFishing]    = [Marketplace.Overlanding],                  // adds IceFishing enum value
        };

    public static bool IsAllowed(Vertical v, Marketplace m) =>
        VerticalToMarketplaces.TryGetValue(v, out var allowed) && Array.IndexOf(allowed, m) >= 0;
}
```

**Phase-1 crossover into Festival:**
- ✅ Overlanding (camping kit, tents, fridges, kitchen gear translate directly to festival camping)
- ✅ Power Station (huge festival use case)
- ❌ Hunting Optics, Fly Fishing, Ice Fishing

**Also requires:** add `Vertical.IceFishing = 4` to the enum (already in CLAUDE.md, missing from code).

### 2.4 User default marketplaces

So listers don't re-pick on every listing.

```csharp
// Kitlo.Core/Models/User.cs
public class User
{
    // ...existing fields...
    public List<Marketplace> DefaultMarketplaces { get; set; } = [];
}
```

Storage: JSON column on `users` (small cardinality, edited rarely; not worth a join table).

---

## 3. API Changes

### 3.1 Tenant identification

Each frontend tells the backend which marketplace it represents.

**Recommendation: explicit `X-Marketplace: festival` header** set by an Angular HTTP interceptor per app build config.

Considered + rejected: Origin-based inference — couples API to host names, fragile in staging/preview, breaks for native/mobile in the future.

Middleware reads the header into `HttpContext.Items["Marketplace"]`. Required for public search; optional for owner-scoped endpoints.

### 3.2 Search / discovery (`ListingService.SearchAsync`)

- New param: `Marketplace? marketplace` (from middleware)
- Public search filters to listings where `ListingMarketplace` contains the request's marketplace.
- Owner-scoped queries (`listerId` set, `includeUnpublished=true`) ignore the filter so listers see all their listings in dashboard.

```csharp
if (marketplace is not null && !includeUnpublished)
    q = q.Where(l => l.Marketplaces.Any(m => m.Marketplace == marketplace));
```

### 3.3 Create / update listing

Request DTO adds `Marketplaces: Marketplace[]`. Service validates:

1. Non-empty.
2. Each value ∈ `MarketplaceRules.VerticalToMarketplaces[listing.Vertical]`.
3. Marketplace set is replaced atomically on update (no orphans).

422 on policy violation, with error code `marketplace_not_allowed_for_vertical` and the offending pair in the response — frontend turns it into a clear toast.

### 3.4 New catalogue endpoints

- `GET /api/marketplaces` — list of active marketplaces with display metadata (slug, label, status).
- `GET /api/catalogue/vertical-rules` — expanded to include `verticalToMarketplaces` so the wizard can show only allowed checkboxes.

### 3.5 Existing endpoints affected

| Endpoint | Change |
|---|---|
| `GET /api/listings` (search) | Filtered by request marketplace |
| `GET /api/listings/{id}` | Unchanged (single-listing lookup not tenant-scoped); detail page can show "available on: Overlanding, Festival" |
| `POST /api/listings` | New `Marketplaces` field + validation |
| `PUT /api/listings/{id}` | Same |
| `GET /api/users/me/listings` | Unchanged — owner sees all |
| `GET /api/admin/listings` | Add marketplace filter for moderation queue |

---

## 4. Database Migration

New migration: `20260518_AddMarketplaces.cs`.

```sql
-- Join table
CREATE TABLE listing_marketplaces (
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    marketplace SMALLINT NOT NULL,
    PRIMARY KEY (listing_id, marketplace)
);
CREATE INDEX ix_listing_marketplaces_marketplace ON listing_marketplaces(marketplace);

-- User defaults
ALTER TABLE users ADD COLUMN default_marketplaces JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Backfill: every existing listing → Overlanding (the only marketplace today)
INSERT INTO listing_marketplaces (listing_id, marketplace)
SELECT id, 0 FROM listings;
```

Rollback: drop the table + column. Backfill is non-destructive.

---

## 5. Validation & Policy Enforcement

| Layer | What it checks |
|---|---|
| DTO (FluentValidation) | Non-empty marketplace set, valid enum values |
| `ListingService` (publish path) | Subset of `VerticalToMarketplaces[vertical]` |
| Admin review (`docs/features/18-admin-listing-review.md`) | Surface marketplace assignments in queue; admin can strip a marketplace without deleting the listing |
| DB | FK + composite PK only — no policy enforcement at DB layer (verticals live in app code) |

---

## 6. Frontend Mirror (downstream — not in this plan's scope, but called out)

After backend lands:

`frontend/src/app/core/catalogue/marketplace-rules.ts` — TypeScript mirror.

`listing-create.ts` wizard: add multi-select "Where should this be listed?" filtered to `allowedMarketplaces(vertical)`. Pre-checked from `user.defaultMarketplaces`.

`HttpInterceptor` (per app) sets `X-Marketplace`. The Overlanding build sets `overlanding`; the future Festival build sets `festival`.

Festival frontend itself is **a separate plan** — this one only enables it.

---

## 7. Tests

- `MarketplaceRulesTests` — assert HuntingOptics rejects Festival; IceFishing rejects Festival; Overlanding allows both.
- `ListingService_PublishTests` — publish with disallowed marketplace returns 422; publish with allowed subset succeeds.
- `ListingService_SearchTests` — search with `marketplace=festival` excludes hunting/fly-fishing listings even if they exist.
- Migration smoke test on a copy of staging — backfill produces 1 row per existing listing.

---

## 8. Build Order (suggested PR sequence)

1. **Enum + rules:** add `Marketplace` enum, `IceFishing` enum, `MarketplaceRules`. Pure compile-only change.
2. **Model + migration:** `ListingMarketplace` join entity, `User.DefaultMarketplaces`, EF config, migration with backfill.
3. **DTO + create/update:** request models accept `Marketplaces`, validation, service applies subset rule.
4. **Search filter + middleware:** `X-Marketplace` header → `HttpContext`, search query filters by it. Default Overlanding when missing (keeps the current Overlanding app working without code change until interceptor lands).
5. **Catalogue endpoints:** `/marketplaces`, expand `/catalogue/vertical-rules`.
6. **Admin queue:** marketplace column in admin listing review.
7. **Tests + docs** (`docs/features/23-category-listing-rules.md` and the create-listing feature doc updated to mention marketplace selection).

Steps 1–3 can land in one PR if small; 4 is a separate PR because it changes behavior for the existing app and warrants its own review.

---

## 9. Open Decisions

| # | Question | Default if no input |
|---|---|---|
| 1 | Name: `Marketplace`? | Yes |
| 2 | Storage: join table? | Yes |
| 3 | Tenant ID: explicit `X-Marketplace` header? | Yes |
| 4 | Festival Phase-1 catalogue verticals = Overlanding + Power Station only? | Yes |
| 5 | Add Festival-native verticals now (Sound, Lighting, Stages, Glamping) or in a follow-up plan? | Follow-up |
| 6 | When a lister has no `DefaultMarketplaces`, force them to pick at first listing or default to whatever marketplace the current frontend represents? | Default to current FE |

---

## 10. Out of Scope (track separately)

- Per-marketplace pricing rules / take rates
- Per-marketplace Stripe Connect accounts
- Per-marketplace cancellation / deposit policy
- Per-marketplace identity verification standards (Festival likely has weaker requirements than Overlanding)
- Frontend Festival app itself (separate plan)
- Festival-specific verticals (sound gear, stage lighting, glamping tents, costumes/wardrobe)
- SEO / domain strategy for two frontends sharing data

---

## 11. Risks

| Risk | Mitigation |
|---|---|
| Listings published without a marketplace become invisible | Backfill ensures every existing listing → Overlanding; new endpoint rejects empty sets at validation |
| Festival frontend ships before backend can serve it | Build order puts middleware behind a default; Festival app simply gets empty results until backend marketplaces are wired |
| Admins approve a listing that violates marketplace policy via direct DB edit | Add a CHECK trigger in a follow-up if it becomes a real issue; for now, app-layer is sufficient |
| `X-Marketplace` header spoofing | Marketplace is a discovery filter, not a security boundary — spoofing only changes what listings the spoofer sees, not what they can do |
