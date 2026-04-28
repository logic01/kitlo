# Kitlo — Peer-to-Peer Hunting Equipment Rental

A marketplace where hunters can list and rent hunting equipment to/from each other.

## Design Philosophy

- **Clean and minimal**: No clutter, no noise. Whitespace is intentional. Avoid decorative UI.
- **Content-first**: Equipment photos and listing details take center stage.
- **Neutral palette**: Earthy tones (slate, stone, warm grays) with a single accent color.
- Prefer `shadcn/ui` components — they are unstyled by default and pair well with the minimal approach.
- No emojis in UI. No gradient text. No card shadows unless truly needed.

## Tech Stack

### Frontend
- **Next.js 15** (App Router) — SSR/SSG for SEO, file-based routing, server components by default
- **TypeScript** — strict mode enabled throughout
- **Tailwind CSS v4** — utility-first, enforces consistent spacing/typography
- **shadcn/ui** — accessible, unstyled-first component primitives

### Backend
- **Next.js API Routes / Route Handlers** — unified repo, co-located with frontend
- **Prisma ORM** — type-safe database client, migrations via `prisma migrate`
- **PostgreSQL** — relational data model fits users, listings, bookings, reviews, and payments

### Auth
- **Clerk** — handles sign-up/sign-in, OAuth providers, session management, and webhooks for user sync

### Payments
- **Stripe Connect** — P2P payment flow: renters pay Kitlo, Kitlo pays out to equipment owners. Handles holds, refunds, and identity verification for listers.

### Media
- **Cloudinary** — equipment photo uploads, automatic resizing/optimization

### Deployment
- **Vercel** — Next.js-native, preview deploys per PR
- **Supabase** (or Railway) — managed PostgreSQL

## Project Structure

```
kitlo/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Clerk auth routes
│   ├── (marketplace)/      # Public listing pages
│   ├── dashboard/          # Authenticated user dashboard
│   ├── api/                # Route Handlers (REST API)
│   └── layout.tsx
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   └── ...                 # Feature components
├── lib/
│   ├── db.ts               # Prisma client singleton
│   ├── stripe.ts           # Stripe client
│   └── cloudinary.ts       # Cloudinary config
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── public/
```

## Core Domain Models

- **User** — lister or renter (same user can be both)
- **Listing** — equipment item with photos, price/day, availability, condition, pickup location
- **Booking** — rental period with status (pending, confirmed, active, returned, disputed)
- **Payment** — Stripe PaymentIntent linked to a Booking
- **Review** — bidirectional (renter reviews listing, lister reviews renter)

## Key Business Rules

- Lister sets a daily rate; renter pays rate × days + service fee.
- Funds are held until the rental period ends, then released to lister minus platform fee.
- Both parties must confirm return before funds release.
- Equipment must have at minimum: title, 3 photos, condition, pickup ZIP, daily rate.

## Development Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npx prisma studio    # Visual DB browser
npx prisma migrate dev --name <name>   # New migration
```

## Environment Variables

```
# .env.local
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Coding Conventions

- Server Components by default; add `"use client"` only when needed (event handlers, hooks, browser APIs).
- Data fetching lives in Server Components or Route Handlers — never `useEffect` + fetch.
- All DB access goes through `lib/db.ts` (Prisma singleton).
- Stripe webhooks handled at `app/api/webhooks/stripe/route.ts`.
- Clerk webhooks handled at `app/api/webhooks/clerk/route.ts`.
- No `any` types. No disabled ESLint rules without a comment explaining why.
