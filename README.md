# Kitlo

Peer-to-peer rental marketplace for hunting optics. Angular 21 frontend, ASP.NET (.NET 10) backend, PostgreSQL, JWT auth, Stripe Connect (scaffold), Cloudinary (scaffold).

> **Listing policy:** weapons (firearms, hunting bows, crossbows) are not listable on Kitlo. See [`docs/gear-catalogue.md`](docs/gear-catalogue.md) and [`docs/features/18-admin-listing-review.md`](docs/features/18-admin-listing-review.md).

---

## Prerequisites

| Tool | Version | Used for |
|---|---|---|
| Node.js | ≥ 20 | Angular dev server, tooling |
| .NET SDK | 10.x | Backend build/run |
| Docker Desktop | any recent | Local Postgres (and optionally the API) |

Verify:

```powershell
node --version
dotnet --version
docker --version
```

---

## Quickstart — full stack in three terminals

This is the path that lets you exercise real auth, real listings, and the seeded test users.

### 1. Start Postgres

```powershell
cd C:\repo\kitlo\database
docker compose up -d
```

Postgres listens on `localhost:5432` (db `kitlo`, user `postgres`, password `postgres`). The `kitlo-pgdata` volume persists data across restarts.

### 2. Start the API

```powershell
cd C:\repo\kitlo\backend
dotnet run --project Kitlo.Api
```

The first run applies EF Core migrations and runs `SeedData.ApplyAsync` (Development env only) — this creates three demo users and two listings. The API listens on `http://localhost:5268`. OpenAPI doc at `http://localhost:5268/openapi/v1.json`.

To run the API in Docker instead:

```powershell
cd C:\repo\kitlo\backend
docker compose --profile full up -d
```

### 3. Start the Angular app

```powershell
cd C:\repo\kitlo\frontend
npm install            # first time only
npm start
```

App runs at `http://localhost:4200`. The dev environment (`environment.development.ts`) points at `http://localhost:5268/api`.

---

## Testing as a fake user

There are **two ways** to act as a user. Use real login when you want backend behaviour to work end-to-end (search, bookings, listings). Use the dev role switcher when you want to flip personas without re-logging-in to walk UI screens.

### A. Real login with seeded users

Seed runs once on first API start (`backend/Kitlo.Data/Seed/SeedData.cs`). All three accounts share the same password.

| Email | Role | Password |
|---|---|---|
| `sam@example.com`   | Renter | `password` |
| `jess@example.com`  | Lister | `password` |
| `lee@kitlo.com`     | Admin  | `password` |

Steps:

1. Open `http://localhost:4200/auth/login`
2. Sign in with one of the rows above
3. The JWT lands in `localStorage` under `kitlo_access_token`; subsequent API calls are authorized via the HTTP interceptor

Sign up flow at `/auth/signup` works against the real backend too — pick **Renter / Lister / Both**, finish the wizard, and the new account persists.

### B. Dev role switcher (no real auth)

A `<select>` labelled **Role** is rendered in the top nav whenever `environment.production === false` (i.e. always under `npm start`). Pick **Renter / Lister / Admin / Logged out** to flip the current-user signal instantly.

> **Caveat:** the role switcher seeds an in-memory user with id `u-renter-1` / `u-lister-1` / `u-admin-1`. Those ids do **not** exist in the database, so any page that fetches data scoped to the current user (`/api/users/me`, `/api/listings/mine`, `/api/bookings`, etc.) will return 401/404. Use the switcher for layout walks; use real login (above) for end-to-end behaviour.

The switcher lives in `frontend/src/app/shared/components/role-switcher/role-switcher.ts`. It is hidden in production builds by design (`environment.production` gate).

### C. Workflow walkthrough

A walkthrough that hits the most important pages once you're logged in:

1. **As a renter (`sam@example.com`)**
   - Browse `/` and `/search` (filter by gear type / condition / verified-only)
   - Open a listing detail (`/listings/{id}`) and view the spec table + reviews
   - Try the booking sidebar (note: known gap — see `problem.md` for which actions are wired)
   - Inbox: `/dashboard/messages`
2. **As a lister (`jess@example.com`)**
   - Sign out, log back in as Jess
   - `/dashboard/listings` shows your published listings (Pulsar Thermion, ATN X-Sight from seed)
   - `/dashboard/listings/new` walks the create-listing wizard (categories: thermal / NV / optics / treestand / pack — weapons are intentionally absent)
   - `/dashboard/earnings` shows the payout summary (empty until bookings flow through)
3. **As an admin (`lee@kitlo.com`)**
   - `/admin` dashboard: pending listings, open disputes, verification queue
   - `/admin/listings` queue (gated to `Admin` policy in the backend)
   - `/admin/users` to warn / restrict / suspend a user

For the full feature catalogue, see [`docs/features/`](docs/features/) (22 numbered workflows).

---

## URLs & ports

| Service | URL |
|---|---|
| Angular dev server | `http://localhost:4200` |
| .NET API | `http://localhost:5268` |
| OpenAPI JSON | `http://localhost:5268/openapi/v1.json` |
| SignalR messages hub | `http://localhost:5268/hubs/messages` |
| Postgres | `localhost:5432` (user `postgres`, pwd `postgres`, db `kitlo`) |

---

## Useful commands

### Frontend

```powershell
cd C:\repo\kitlo\frontend
npm start              # dev server (http://localhost:4200)
npm run build          # production bundle
npm test               # vitest
npm run lint           # eslint flat config
npx playwright test    # e2e (after npx playwright install)
```

### Backend

```powershell
cd C:\repo\kitlo\backend
dotnet build
dotnet run --project Kitlo.Api
dotnet test
dotnet ef migrations add <Name> --project Kitlo.Data --startup-project Kitlo.Api
dotnet ef database update --project Kitlo.Data --startup-project Kitlo.Api
```

### Docker

```powershell
cd C:\repo\kitlo\backend
docker compose up -d                  # Postgres only
docker compose --profile full up -d   # Postgres + API
docker compose down                   # stop, keep data
docker compose down -v                # stop + wipe the kitlo-pgdata volume
```

---

## Deploy

The early-access waitlist page deploys to **kitlo.net** as a static S3 + CloudFront + Route 53 site. The form posts to Formspree (no backend required for the waitlist phase). Step-by-step in [`docs/deploy-early-access.md`](docs/deploy-early-access.md).

---

## Reset to a clean state

To wipe the seed data and start over (fresh users, fresh listings):

```powershell
cd C:\repo\kitlo\backend
docker compose down -v
docker compose up -d
dotnet run --project Kitlo.Api        # re-seeds on first request
```

In the browser, also clear `localStorage` (DevTools → Application → Storage) so the stale `kitlo_access_token` and `kitlo_current_user` keys are dropped.

---

## What's wired vs. what's a known gap

The Phase 3 mock-data layer has been swapped for real backend calls (Phase 5.2 is done). Stripe and Cloudinary are scaffolded — booking/payment flow renders end-to-end but money does not actually move without live Stripe keys. Image uploads fall back to placeholder URLs without a Cloudinary cloud configured.

A full bug & gap audit lives in [`problem.md`](problem.md) at the project root. Skim it before declaring a workflow broken — many "dead button" issues are tracked there with the precise line numbers.

---

## Directory map

```
kitlo/
├── frontend/        Angular 21 SPA (npm)
├── backend/         .NET 10 solution (dotnet)
│   ├── Kitlo.Api/   ASP.NET Core Web API
│   ├── Kitlo.Core/  Domain models + enums
│   ├── Kitlo.Data/  EF Core DbContext, migrations, seed
│   └── docker-compose.yml
└── docs/
    ├── tasks.md             Active task tracker
    ├── done-tasks.md        Completed task archive
    ├── brand.md             Voice + visual identity
    ├── gear-catalogue.md    Listing policy (incl. prohibited weapons)
    ├── pages.md             Route map
    ├── features/            22 numbered feature specs
    └── layouts/             Static HTML wireframes
```
