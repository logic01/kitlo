# Kitlo Brand Guidelines

> **Status: Locked.** These are the decided brand decisions for all future design and development work.

---

## North Star

**"Access, not just Ownership."**

High-end thermal and NV gear sits unused 90% of the time. Kitlo puts it to work — giving renters access to $5,000 optics for $200 a weekend, and giving listers a return on gear they already own. The platform is a tool for efficient stewardship of expensive gear, not a lifestyle brand or social network.

---

## Brand Voice

**Rugged. Knowledgeable. Reliable. Neighborly.**

Write like one hunter talking to another — not a brand talking at a customer. Assume competence. Skip the warm-up.

### Rules

- **Direct.** Lead with the fact, not the context.
- **No hand-holding.** Your customers know what a VOx microbolometer is. Don't explain basics.
- **No patronizing copy.** No "safety first," no "we know how important it is to you."
- **No lifestyle inflation.** Don't oversell the experience. The gear does the work.
- **Short sentences win.** Especially in headlines and CTAs.
- **Practical nouns.** Gear, kit, scope, bundle, deposit, pickup. Not "experience," "adventure," "passion."

### Voice in practice

| Context | Wrong | Right |
|---|---|---|
| Hero | "Find amazing gear from passionate hunters!" | "Access, not just Ownership." |
| CTA | "Get started on your outdoor adventure" | "Find gear" / "List your gear" |
| Confirmation | "You're all set! Have an amazing hunt! 🦌" | "Booking confirmed. Pickup details below." |
| Onboarding | "Share your passion and earn money!" | "List your gear. Set your price. Get paid." |
| Empty state | "No listings yet — be the first!" | "No listings in this area yet." |

### What to avoid
- Patriotic framing, flag imagery, "American tradition" hooks
- Exclamation points in product UI
- Emojis in product copy
- Corporate warmth ("We're passionate about connecting you with...")
- Safety theater (liability-speak woven into copy)
- Overusing the word "community"

---

## Color Palette

The master CSS file is at `brand/style.css`. All values are defined as CSS custom properties under `:root`.

### Primary Colors

| Token | Hex | Name | Usage |
|---|---|---|---|
| `--color-slate` | `#2F353B` | Backcountry Slate | Primary text, dark UI, nav, heavy borders |
| `--color-olive` | `#535A2D` | Alpine Earth | Primary CTA buttons, heading accents, olive band |
| `--color-amber` | `#F2994A` | Safety Amber | Secondary CTA, booking actions, alerts — use sparingly |
| `--color-bg` | `#F7F7F1` | Bone White | Page background |
| `--color-surface` | `#EEEDE6` | Warm surface | Cards, form inputs, secondary areas |

### Supporting Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-amber-dark` | `#D4781E` | Amber hover state |
| `--color-footer-bg` | `#1E2428` | Footer, sub-footer |
| `--color-muted` | `#7A8087` | Secondary text, labels, placeholders |
| `--color-border` | `#D8D8D0` | All borders on light backgrounds |

### Condition System Colors

| Condition | Hex | Token |
|---|---|---|
| Mint | `#2D6B3A` | `--color-mint` |
| Field-Ready | `#535A2D` | `--color-olive` |
| Battle-Scarred | `#D4781E` | `--color-battle` |

### On-dark text

When placing text on Slate or Footer backgrounds:

| Token | Value | Usage |
|---|---|---|
| `--color-on-dark` | `#F7F7F1` | Primary text on dark |
| `--color-on-dark-muted` | `rgba(247,247,241,0.50)` | Secondary text on dark |
| `--color-on-dark-faint` | `rgba(247,247,241,0.30)` | Footer copy, sub-labels |

---

## Typography

Google Fonts import string:
```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800;900&family=DM+Sans:wght@400;500;600&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Families

| Role | Family | CSS Token | Notes |
|---|---|---|---|
| **Headlines** | Barlow Condensed | `--font-condensed` | Always uppercase, weights 800–900 for hero/display, 700–800 for h2–h4 |
| **Body / UI** | DM Sans | `--font-body` | All paragraph text, nav links, labels, button text |
| **Data / Specs** | Roboto Mono | `--font-mono` | Prices, gear specs, overlines, ratings, IDs |

### Type Scale

| Class | Family | Size | Weight | Case | Use |
|---|---|---|---|---|---|
| `.text-hero` | Condensed | clamp(64–104px) | 900 | Upper | Hero H1 only |
| `.text-display` | Condensed | clamp(40–56px) | 900 | Upper | Page titles |
| `.text-h1` | Condensed | 42px | 900 | Upper | Section headings |
| `.text-h2` | Condensed | 32px | 900 | Upper | Sub-section headings |
| `.text-h3` | Condensed | 22px | 800 | Upper | Card titles, step titles |
| `.text-h4` | Condensed | 18px | 800 | Upper | Minor labels |
| `.text-body-lg` | DM Sans | 17px | 400 | Sentence | Hero subheadings |
| `.text-body` | DM Sans | 15px | 400 | Sentence | General body copy |
| `.text-sm` | DM Sans | 14px | 400–500 | Sentence | Nav links, card body |
| `.text-xs` | DM Sans | 13px | 400–600 | Sentence | Small UI text |
| `.text-overline` | Roboto Mono | 10px | 400 | UPPER | Section labels above headings |
| `.text-mono` | Roboto Mono | 14px | 500 | — | Specs, data |
| `.text-price` | Roboto Mono | 22px | 500 | — | Prices in listing cards |

### Rules
- All condensed headings are uppercase. No exceptions.
- Body text is sentence case.
- Prices always use Roboto Mono so numerals are optically stable.
- Max prose width: `440px` (hero sub), `640px` (olive band body).

---

## Topographic Texture

A subtle concentric ellipse pattern applied to background sections (hero, marketing panels) to evoke terrain navigation and the onX aesthetic. Never used on card surfaces or dark backgrounds.

```css
.topo-texture {
  background-image:
    radial-gradient(ellipse 50% 35% at 50% 50%, transparent 78%, rgba(83,90,45,0.06) 78%, rgba(83,90,45,0.06) 79%, transparent 79%),
    radial-gradient(ellipse 68% 50% at 50% 50%, transparent 82%, rgba(83,90,45,0.04) 82%, rgba(83,90,45,0.04) 83%, transparent 83%),
    radial-gradient(ellipse 86% 65% at 50% 50%, transparent 86%, rgba(83,90,45,0.03) 86%, rgba(83,90,45,0.03) 87%, transparent 87%);
}
```

---

## Condition Rating System

Every listing must have a condition rating. This is a trust signal, not a marketing label — listers who inflate it will get flagged in reviews.

| Rating | Color | Meaning |
|---|---|---|
| **Mint** | `#2D6B3A` | Barely used. No visible wear. Functions as new. Rental history backs it up. |
| **Field-Ready** | `#535A2D` | Used on real hunts. Body wear possible — scratches on chassis, not glass. Fully functional. |
| **Battle-Scarred** | `#D4781E` | Veteran gear. Shows its history. Priced accordingly. Performance intact. Read the lister's notes. |

Use `.badge-condition` with modifier `.badge-mint`, `.badge-field-ready`, or `.badge-battle-scarred` from `style.css`.

---

## Verified Hunter Badge

Applied to lister profiles once ID verification is complete. Required before any listing is published.

- Icon: shield/arrowhead SVG, 8×10px, filled
- Font: Barlow Condensed, 10px, 700, uppercase, tracked
- Color: Alpine Earth (`#535A2D`) on pale olive background
- Border: 1px solid `rgba(83,90,45,0.15)`

```html
<span class="badge-verified">
  <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor">
    <path d="M4 0L0 1.5v3C0 7 2 9.2 4 10 6 9.2 8 7 8 4.5v-3L4 0z"/>
  </svg>
  Verified Hunter
</span>
```

---

## Photography Direction

Reference: MeatEater visual style. Gear in context, authentic wear, human hunters — not studio product shots.

- **Gear in action.** Never on a white background. Show a scope at dawn, a pack leaning on a tree, NV goggles on a truck tailgate.
- **Authentic wear is a feature.** Scuffs, mud, field marks on gear reinforce the P2P story — this gear has worked. Don't retouch them out.
- **Human connection.** Lister profile photos should be field photos, not tech headshots. Builds peer trust.
- **No trophy shots as hero imagery.** The hunt is the subject, not the kill.

---

## UI Component Reference

All components are defined in `brand/style.css`. Key classes:

| Component | Class(es) |
|---|---|
| Navigation | `.nav`, `.nav-logo`, `.nav-links`, `.nav-right` |
| Buttons | `.btn` + `.btn-primary` / `.btn-secondary` / `.btn-olive` / `.btn-ghost` |
| Inputs | `.input`, `.input-label`, `.form-group`, `.search-bar` |
| Listing card | `.listing-card`, `.listing-card-img`, `.listing-card-body`, `.listing-card-name` |
| Profile card | `.profile-card`, `.profile-name`, `.profile-meta`, `.profile-verified` |
| Step card | `.step-card`, `.step-num`, `.step-title` |
| Trust card | `.trust-card`, `.trust-card-label`, `.trust-card-title` |
| Badges | `.badge-verified`, `.badge-condition`, `.badge-mint`, `.badge-field-ready`, `.badge-battle-scarred` |
| Avatar | `.avatar` + `.avatar-sm` / `.avatar-md` / `.avatar-lg` |
| Condition system | `.condition-grid`, `.condition-card`, `.condition-name`, `.condition-indicator` |
| Olive band | `.olive-band`, `.olive-band-inner`, `.olive-band-headline` |
| Dark band | `.dark-band`, `.dark-band-inner`, `.dark-band-heading` |
| Hero | `.hero`, `.hero-inner`, `.hero-left`, `.hero-right`, `.hero-heading` |
| Footer | `.footer`, `.footer-logo`, `.footer-copy` |
| Layout | `.container`, `.section`, `.grid-2`, `.grid-3`, `.grid-4`, `.topo-texture` |

---

## What This Brand Is Not

- **Not a lifestyle brand.** Kitlo is a tool. It doesn't need to evoke emotion about hunting — the hunt does that.
- **Not Silicon Valley.** No gradient text, no rounded pill buttons everywhere, no "we're disrupting the outdoors."
- **Not a discount store.** Bone White, slate, and olive read premium. Keep it.
- **Not rustic.** No wood textures, no distressed type, no campfire photography in the product UI.
- **Not patriotic.** No flags, no "America's hunters," no veteran-identity hooks woven into brand copy.
