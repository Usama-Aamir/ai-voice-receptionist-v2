# Design System — AI Voice Receptionist

Reference this file in every UI-related Windsurf prompt. Goal: premium,
executive, ops-dashboard feel (think Stripe/Linear/Mercury bank dashboards)
— NOT a typical bubbly AI-generated startup look.

## Colors
```
--bg:            #0B0F14   /* charcoal-navy background, not pure black */
--surface:       #131920   /* cards, sidebar */
--border:        #232B35   /* hairline 1px borders only, no heavy shadows */
--text-primary:  #E8ECEF
--text-secondary:#8B94A0
--accent:        #C9A15C   /* muted brass/gold — used SPARINGLY */
--success:       #4C9A76   /* muted sage, desaturated */
--danger:        #C1665A   /* muted clay red, desaturated */
```

## Typography
- **UI text + headings:** Geist Sans (already bundled with Next.js — no extra font loading needed)
- **Numbers, stats, phone numbers, IDs, dates:** Geist Mono — this detail is what gives the "precise ops dashboard" feel
- Headings: tight letter-spacing, medium-bold weight, no oversized hero text in the dashboard interior
- Small uppercase mono labels as section "eyebrows" (e.g. "OVERVIEW", "TODAY") — 11px, letter-spacing 0.05em, text-secondary color

## Layout principles
- Sidebar: fixed width, `--surface` background, hairline right border, generous vertical spacing between nav items
- Active nav item: thin 2px brass left-border accent, not a filled background block
- Cards: `--surface` background, 1px `--border`, 6-8px border radius (crisp, not overly rounded/bubbly), generous internal padding (24px+)
- Stat numbers: large, Geist Mono, `--text-primary`, with small mono eyebrow label above
- Status badges: outlined pills (1px border in status color, transparent/dark fill, colored text) — NOT solid filled color blocks
- No gradients, no drop shadows beyond a very subtle 1px definition, no bright saturated colors anywhere
- Buttons: solid brass accent for primary actions only (use sparingly — one primary action per view), outlined/ghost style for secondary actions

## What to avoid
- Generic purple/blue gradient SaaS look
- Rounded bubbly cards with heavy shadows
- Bright neon accent colors
- Emoji in the UI
- Overly playful copy — tone should be direct, plain, professional