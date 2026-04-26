# Sightings Map Homepage Teaser — Vintage Surveillance Grid Illustration

## Status

Deferred. The placeholder `MapCTA` was removed from the homepage (`src/app/page.tsx`) and the
component file (`src/components/MapCTA.tsx`) was deleted on 2026-04-25. This plan captures
the intended replacement so future work can pick up cold.

## Goal

Replace the homepage map teaser slot — between the editorial row (Featured Case File +
Bulletins) and the Cryptid Directory — with a stylized vintage **surveillance grid SVG**
that leans fully into the bureau / forgotten-field-guide aesthetic, instead of a
fake-looking CSS gradient or a heavy live Mapbox embed.

The real interactive map already exists at `/map`. The homepage teaser is an
*invitation* and *decorative artifact*, not a working preview.

## Why this approach (vs alternatives)

- **Live Mapbox mini-map (Option A)** — rejected for now. Mapbox GL JS is ~700kb and
  even lazy-loaded it adds bundle weight, API load cost, and a Core Web Vitals risk on
  the homepage. The real map is one click away.
- **Static Mapbox snapshot** — rejected. Sterile, dated-feeling, and breaks the bureau
  fiction.
- **Memo-card CTA with no map (Option C)** — viable fallback if illustration time
  isn't available, but loses the "map" affordance the user originally imagined.
- **Vintage surveillance grid SVG (Option B)** — chosen. Matches the FeaturedCryptid
  and BulletinTeaser memo aesthetic, no JS, no API calls, fast LCP.

## Visual Spec

Treat this like a **declassified field-issued map sheet from 1972** — what an ACD
field agent would have folded in their pocket.

**Composition** (single horizontal card, full width inside `max-w-6xl`):

- **Surface:** cream paper, faint paper-texture (use existing `paper-texture` class
  or `memo-paper`). Subtle drop shadow + inset shadow for depth.
- **Frame:** thin double-rule border in `hsl(var(--bureau-ink-muted))`. Maybe
  hand-creased fold line down the middle (very faint).
- **Top-left corner:** typewriter classification stamp:
  `ACD SURVEILLANCE GRID / SHEET 7-C / RESTRICTED — INTERNAL USE`
- **Top-right corner:** small **compass rose** (SVG, hand-drawn feel,
  `bureau-ink` color) with N/S/E/W markers.
- **Bottom-right corner:** scale bar `0 ─── 50mi` and authoring credit
  `CARTOGRAPHY: ACD FIELD DESK · REV. 11/72`.
- **Bottom-left corner:** legend block —
  `● CONFIRMED SIGHTING   △ ANOMALY   ✕ UNRESOLVED`.

**Map illustration itself** (the meat):

- **Region outline:** hand-drawn-feeling SVG path of the Appalachian region — rough
  silhouette of WV, eastern KY, western VA, eastern TN, western NC, northern GA,
  western SC. Use a slightly wobbly stroke, not a precise GeoJSON. Stroke
  `hsl(var(--bureau-ink) / 0.7)`, ~1.5px.
- **State borders:** dashed thin lines inside the region.
- **Topographic contour curves:** layered SVG paths in faint sepia
  (`hsl(var(--bureau-ink-muted) / 0.18)`), suggesting the Appalachian ridges. 4–6
  curves, organic shapes.
- **Major rivers:** 1–2 thin curved lines (Ohio, Tennessee, French Broad).
- **City labels:** typewriter font, `text-[10px]`, with a small `+` cross-mark.
  Include: Charleston WV, Asheville NC, Roanoke VA, Knoxville TN, Pittsburgh PA,
  Lexington KY (whichever fit). Position approximately, not precisely.
- **Sighting pins:** ~6–8 red `●` markers at hotspot positions (Point Pleasant for
  Mothman, Charles Mill Lake for Orange Eyes, Greenbrier for the Ghost, etc.) with
  small typewriter case numbers next to them: `CASE 47B`, `CASE 19A`, `CASE 03C`.
- **Stamps:** one or two angled overlay stamps:
  - `RESTRICTED` top-right corner (rotated -8°, in `hsl(var(--bureau-stamp))`)
  - Optional: a faint inkpad-style `BUREAU OF CRYPTID DOCUMENTATION` circular seal
    bottom-center, low opacity.

**Hover state:** very subtle — a `hover:scale-[1.005]` lift, deeper shadow. No need
for animation on the pins.

**Right side / text block:** keeps the institutional copy from the previous version
but trimmed:

```
ACD Surveillance Grid — Active

Sightings Map

Plot of corroborated encounters across West Virginia, Tennessee,
North Carolina, and the broader Appalachian region. Searchable by
cryptid, county, and date range.

Open the Surveillance Grid →
```

## Implementation Notes

- **Component:** recreate `src/components/MapCTA.tsx`. Server Component (no client
  state). Inline SVG so it ships in the HTML — no separate asset request.
- **Route:** wrap whole card in `<Link href="/map">`.
- **Section wrapper:** match the previous border styling
  (`border-t border-b border-border`) and `max-w-6xl mx-auto px-6 lg:px-8 py-8` so
  the page rhythm doesn't shift.
- **Position in `page.tsx`:** between the editorial row (Featured + Bulletins) and
  the Cryptid Directory section, OR between the directory and the newsletter —
  designer's call. Original placement was between MapCTA and Newsletter.
- **Accessibility:**
  - Wrap decorative SVG in `<div aria-hidden="true">` and rely on the heading and
    link for semantics.
  - Provide `aria-label="Open the interactive sightings map"` on the link.
- **No animation libraries.** All effects via CSS transforms.

## File touchpoints (for future implementation)

- **Recreate:** `src/components/MapCTA.tsx`
- **Edit:** `src/app/page.tsx` — re-import and re-mount `<MapCTA />` between the
  editorial row section and the newsletter (or per designer choice).
- **Maybe extract:** if the SVG gets large, split the surveillance-grid illustration
  into `src/components/SurveillanceGridMap.tsx` and import.

## Design references

- The `FeaturedCryptid` and `BulletinTeaser` memo paper cards established the
  visual language to extend here.
- Real-world inspiration: USGS topo quadrangles, declassified mid-century
  intelligence maps, hand-marked nautical charts.
- Existing CSS variables to use: `--bureau-ink`, `--bureau-ink-muted`,
  `--bureau-stamp`, `--bureau-manila`, `--bureau-border`, `--ledger-margin-line`,
  `--ledger-ruled-line`.

## Verification (when implemented)

1. Build clean: `npm run build` — no warnings, no broken imports.
2. Lint clean: `npm run lint`.
3. Visual: dev server, scroll homepage, confirm card sits between editorial row
   and directory, looks like a 1970s field map, hover lifts subtly.
4. Click → routes to `/map`.
5. No layout shift on load (SVG is inline, no async).
6. Lighthouse: no LCP regression vs current state (no MapCTA at all).
