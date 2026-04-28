# Kitlo Brand Guidelines

## What Kitlo Is

A tool hunters use to rent gear from other hunters. Not a lifestyle brand. Not a community platform trying to sell you on the outdoors. A utility that respects your time, your expertise, and your money.

The name is direct: **kit** (your gear) + **lo** (keep it low — low friction, low overhead). That's the product promise embedded in the name.

---

## Brand Positioning

**For:** Hunters who already know what they need and don't want to own everything they use.

**Against:** Gear-hoarding, expensive one-trip purchases, corporate rental counters.

**Not:** An outdoor lifestyle brand. Not a hunting app trying to be social. Not REI. Not Bass Pro.

Kitlo is the transaction layer between two hunters. The brand should feel like that — clean infrastructure, not a campfire experience.

---

## Tone of Voice

### The One Rule
Write like one hunter talking to another. Not a brand talking to a customer.

### What That Means in Practice

**Direct.** Say the thing. Skip the warm-up.
- Not: "We know how important it is to have the right gear for your hunt."
- Yes: "Rent the optics. Skip the ownership."

**No hand-holding.** Assume competence. Your customers know what a spotting scope is, what grain bullet weight matters, what "field-ready" means. Don't explain basics.
- Not: "Make sure to inspect gear carefully before your rental begins for a safe and enjoyable experience!"
- Yes: "Inspect on pickup. Flag damage before you leave."

**Transactional honesty.** The platform is a tool. Don't oversell the experience.
- Not: "Connect with passionate hunters in your area and share your love of the outdoors!"
- Yes: "Find what you need. Book it. Hunt."

**Short sentences win.** Especially in headlines and CTAs.

**Practical nouns over emotional ones.** Gear, kit, rifle, pack, blind, lease. Not "experience," "adventure," "passion," "community."

### Voice Examples

| Context | Wrong | Right |
|---|---|---|
| Hero headline | "The Platform Built for Hunters Like You" | "Rent the kit. Do the hunt." |
| Empty state | "No listings yet — be the first to share your gear with the community!" | "No listings in this area yet." |
| Booking confirmation | "You're all set for an amazing hunt! 🦌" | "Booking confirmed. Pickup details below." |
| Lister onboarding | "Share your passion and earn money doing what you love!" | "List your gear. Set your price. Get paid." |
| Error message | "Oops! Something went wrong on our end. Sorry about that!" | "Something went wrong. Try again." |

### What to Avoid
- Patriotic framing ("America's hunters," flags, founding-father energy)
- Extreme/adrenaline language ("Epic," "Ultimate," "Legendary")
- Corporate warmth ("We're passionate about connecting you with...")
- Safety theater (liability-speak baked into UI copy)
- Overuse of "community" — use it once, mean it
- Exclamation points in product UI

---

## Visual Identity

### Color Palette

Built around the visual reality of late-season hunting: muted light, cold mornings, practical gear. Not camo. Not blaze orange. Not a sporting goods catalog.

```
Primary Background   #FAFAF9   Warm off-white (stone-50)
Primary Text         #1C1917   Warm near-black (stone-950)
Accent               #B45309   Amber-700 — dawn light, not warning orange
Muted Text           #57534E   Stone-600
Borders / Dividers   #E7E5E4   Stone-200
Surface / Card       #F5F5F4   Stone-100
Dark Surface         #292524   Stone-800 (for dark mode base)
```

**The accent (#B45309)** is the one expressive color. Used sparingly: primary CTAs, active states, selected items, prices. Not for decorative purposes.

**What the palette is not:** No hunter orange (#FF4500 territory). No camo greens. No navy-and-red sporting goods palette. No gradients.

### Dark Mode

Kitlo should support dark mode from day one — hunters using the app at 4am appreciate it.

```
Dark Background      #1C1917   Stone-950
Dark Surface         #292524   Stone-800
Dark Border          #44403C   Stone-700
Dark Muted Text      #A8A29E   Stone-400
Dark Primary Text    #FAFAF9   Stone-50
Accent (same)        #B45309   Unchanged
```

---

## Typography

### Typefaces

**Display / Headings: Fraunces**
- Variable font with optical sizing — looks different at 72px vs 18px, both intentionally
- Has warmth and character without being decorative or nostalgic
- Feels hand-considered, not corporate
- Source: Google Fonts (free, variable)

**Body / UI: Geist Sans**
- Designed for interfaces — excellent at small sizes
- Clean without being cold
- Developed by Vercel; fits the Next.js stack
- Source: `next/font/google` or `geist` npm package

**Monospace (prices, codes, IDs): Geist Mono**
- Used for: listing IDs, booking reference numbers, prices in tables
- Keeps numbers optically stable

### Type Scale

```
Display     Fraunces   72px / 1.1 lh   Hero headlines only
H1          Fraunces   48px / 1.15 lh
H2          Fraunces   36px / 1.2 lh
H3          Geist Sans 24px / 1.3 lh   Semibold
H4          Geist Sans 18px / 1.4 lh   Semibold
Body        Geist Sans 16px / 1.6 lh   Regular
Small       Geist Sans 14px / 1.5 lh
Label       Geist Sans 12px / 1.4 lh   Semibold, uppercase, tracked
Mono        Geist Mono 14px / 1.4 lh   Prices, codes
```

### Typography Rules
- Headings are sentence case, not Title Case
- No bold italic combinations
- Price displays use Geist Mono to prevent number jitter
- Max prose width: 68ch

---

## Logo / Wordmark Direction

Not designed yet, but the direction:

- **Wordmark-first**: "kitlo" in Fraunces, lowercase, at optical display weight
- No tagline locked to the logo
- No literal hunting imagery (no antlers, no crosshairs, no rifles in the mark)
- If an icon is needed: a geometric abstraction of a scope reticle — four clean lines meeting at center, no circle. Suggests precision without being a clip-art hunting logo.
- Mark works in single color only (no multi-color logo)

---

## What the Brand Is Not

To keep the brand honest, explicit anti-patterns:

- **Not a lifestyle brand.** Kitlo doesn't care if you love the outdoors. It assumes you do and moves on.
- **Not patriotic.** No flags, no "American tradition," no veteran-identity hooks.
- **Not rustic.** No wood textures, leather grain, distressed type, or campfire photography in the product UI.
- **Not extreme.** No aggressive energy. Hunting is patient, methodical, early mornings.
- **Not social.** Kitlo is not a hunting forum, feed, or photo-sharing platform. Transactions and trust signals only.

---

## Open Questions

The following decisions should be revisited once answered:

1. **US-only vs. international**: If international, the tone needs to be less culturally coded to American hunting identity. Affects copy defaults.
2. **Gear tier positioning**: If skewing premium, the accent could shift warmer/richer and typography could lean heavier into Fraunces. If all-tiers, stay utilitarian.
3. **Reference brands**: If the user has brands they respect, cross-check this palette and tone against them.
