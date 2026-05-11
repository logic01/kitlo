# Kitlo Brand Guidelines

## What Kitlo Is

A tool overlanders use to rent gear from other overlanders. Rooftop tents, fridges, recovery boards, awnings, dual-battery, optics for the hunt, waders for the river, power for the camp. Not a lifestyle brand. Not a community platform trying to sell you on the outdoors. A utility that respects your time, your expertise, and your money.

The name is direct: **kit** (your gear) + **lo** (keep it low — low friction, low overhead). That's the product promise embedded in the name.

---

## Brand Positioning

**For:** Overlanders, weekend campers, and trip-driven hunters and anglers who already know what they need and don't want to own everything they use.

**Against:** Gear-hoarding, expensive one-trip purchases, corporate rental counters, two-day mail-order shipping when you needed it Saturday.

**Not:** An outdoor lifestyle brand. Not a social app for the trail. Not REI. Not Bass Pro. Not Hygglo.

Kitlo is the transaction layer between two overlanders. The brand should feel like that — clean infrastructure, not a campfire experience.

The hunting-optics renter is an overlander going somewhere to hunt. The angler renting waders is an overlander going somewhere to fish. The renter picking up a power station for a four-day desert loop is an overlander. Kitlo's voice talks to that one person, regardless of which subcategory they're shopping.

---

## Tone of Voice

### The One Rule
Write like one overlander talking to another. Not a brand talking to a customer.

### What That Means in Practice

**Direct.** Say the thing. Skip the warm-up.
- Not: "We know how important it is to have the right gear for your trip."
- Yes: "Rent the kit. Roll out."

**No hand-holding.** Assume competence. Your renters know what a 12V fridge is, what an inverter does, what "field-ready" means, what a 3-weight is for. Don't explain basics.
- Not: "Make sure to inspect gear carefully before your rental begins for a safe and enjoyable experience!"
- Yes: "Inspect on pickup. Flag damage before you leave."

**Transactional honesty.** The platform is a tool. Don't oversell the experience.
- Not: "Connect with passionate overlanders in your area and share your love of the outdoors!"
- Yes: "Find what you need. Book it. Go."

**Short sentences win.** Especially in headlines and CTAs.

**Practical nouns over emotional ones.** RTT, fridge, scope, awning, recovery boards, waders, power station. Not "experience," "adventure," "passion," "community."

**Per-vertical specificity is fine.** Use the noun the renter would use: "rooftop tent" not "shelter," "thermal monocular" not "night optic," "waders" not "wet weather gear." Generic nouns sound like a marketplace mall; specific nouns sound like a tool built by people who use the gear.

### Voice Examples

| Context | Wrong | Right |
|---|---|---|
| Hero headline | "The Platform Built for Overlanders Like You" | "Rent the kit. Roll out." |
| Empty state | "No listings yet — be the first to share your gear with the community!" | "No listings in this area yet." |
| Booking confirmation | "You're all set for an amazing trip! 🏕️" | "Booking confirmed. Pickup details below." |
| Lister onboarding | "Share your passion and earn money doing what you love!" | "List your gear. Set your price. Get paid." |
| Error message | "Oops! Something went wrong on our end. Sorry about that!" | "Something went wrong. Try again." |
| Bundle CTA | "Build the ultimate overland experience!" | "Roof tent, fridge, awning. One booking." |
| Optics category | "For the hunters in our community" | "Thermal detect. NV engage. One rental." |
| Fly fishing category | "Cast into adventure!" | "Waders, boots, the right rod for the water." |

### What to Avoid
- Patriotic framing (flags, founding-father energy)
- Extreme/adrenaline language ("Epic," "Ultimate," "Legendary," "Adventure awaits")
- Corporate warmth ("We're passionate about connecting you with...")
- Overland-cosplay language ("expedition-grade," "built different," "made for the wild")
- Safety theater (liability-speak baked into UI copy)
- Overuse of "community" — use it once, mean it
- Exclamation points in product UI
- Emojis in product UI (the categories of gear we list don't need them)

---

## Visual Identity

### Color Palette

Built around the visual reality of overlanding: dust, dusk, dawn light over a campsite, cold mornings on the river, late-season hunting fields. Muted, earthy, practical. Not camo. Not blaze orange. Not a sporting goods catalog. Not the gradient-saturated brand template every overlanding YouTuber uses.

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

Kitlo should support dark mode from day one — anyone using the app at 4am, in a tent, on a riverbank, or scouting before legal light, appreciates it.

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
- No literal overlanding imagery (no Jeep silhouettes, no rooftop tents, no compass roses, no mountain ranges)
- If an icon is needed: a geometric mark — two horizontal lines suggesting a horizon and a third meeting them at right angle. Reads as direction, road, terrain — without quoting any one of them. Works at favicon scale.
- Mark works in single color only (no multi-color logo)

---

## What the Brand Is Not

To keep the brand honest, explicit anti-patterns:

- **Not a lifestyle brand.** Kitlo doesn't care if you love the outdoors. It assumes you do and moves on.
- **Not patriotic.** No flags, no "American tradition," no veteran-identity hooks.
- **Not rustic.** No wood textures, leather grain, distressed type, or campfire photography in the product UI.
- **Not extreme.** No aggressive energy. Overlanding is preparation, patience, and unhurried days.
- **Not social.** Kitlo is not a forum, feed, or photo-sharing platform. Transactions and trust signals only.
- **Not overlander-cosplay.** No "expedition-grade" badges, no faux-mil-spec typography, no aerial drone-shot hero photos of a single rig at sunset. The brand respects overlanders who actually go places by not flattering the ones who only post about it.

---