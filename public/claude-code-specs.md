# Claude Code Task Specs — Appalachian Cryptid Compendium

## Task 1: Field Guide Page ✅ COMPLETE

> **Completed:** 2026-02-06
> **Commit:** `f26593c Add Field Guide page with Bureau memo styling`

### What to build
A new `/field-guide` route — a single long-scroll naturalist journal-style reference page that displays all cryptids (and optionally anomalies) in a condensed, beautifully formatted field guide layout. Think old National Park Service pamphlet or Victorian naturalist's journal.

### Route & navigation
- Add a new lazy-loaded page at `src/pages/FieldGuide.tsx`
- Add route `/field-guide` in `src/App.tsx` (above the catch-all)
- Add "Field Guide" to the Header nav (currently: Field Guide, Anomalies Desk, About, Sighting Map, Report a Sighting)

### Data source
- Use the same Sanity hooks from `src/hooks/use-sanity-cryptids.ts` — specifically `useCryptids()` to fetch all cryptids
- Optionally also pull anomalies via `useAnomalies()` from `src/hooks/use-sanity-anomalies.ts`
- Falls back to static data automatically (the dual data mode is already built)

### Design direction
This should feel like a naturalist's field journal — NOT like the existing card grid. Key aesthetic cues:
- Sepia/cream paper texture (the site already has `paper-texture` and `memo-paper` CSS classes)
- Typewriter font for labels (site uses `font-typewriter` class)
- Display font for headings (site uses `font-display` class)
- Hand-drawn divider lines or botanical border ornaments between entries
- Each cryptid entry is a compact "journal page" with: small illustration (use gridImage from Sanity), name, scientific name, location, danger level, a 2-3 sentence description, and key tags
- The page should feel like one continuous scroll — no pagination, no "load more"
- Include a simple sticky table of contents / jump nav on the side (desktop) or top (mobile) that lets you jump to entries alphabetically or by region

### SEO
- Add structured data using the existing `StructuredData` component
- Use `useSEO` hook for meta tags
- Title: "Appalachian Cryptid Field Guide — Complete Reference"
- Description: "A naturalist's field guide to the cryptids, creatures, and strange beings of the Appalachian Mountains and American South."

### Existing components to reuse
- `Header` and `Footer` (use `variant="full"` on Footer)
- `BackToTop`
- `LabelTape` for tags
- `Stamp` for any status badges
- Sanity `urlFor()` for image URLs

### What NOT to do
- Don't duplicate the card grid from Index.tsx — this is a different format
- Don't add new npm dependencies
- Don't modify existing components — create new ones if needed

---

## Task 2: Report a Sighting — Bureau Confirmation ✅ COMPLETE

> **Completed:** 2026-02-06
> **Files created:** `src/components/SightingReceipt.tsx`
> **Files modified:** `src/pages/ReportSighting.tsx`

### Overview
Upgrade the existing `src/pages/ReportSighting.tsx` with two additions:
1. ~~A Mapbox GL JS map picker in the Location Details section~~ — **SKIPPED** (site already has dedicated Map page; form map pickers are often janky UX)
2. A Bureau-styled confirmation/receipt screen after successful submission ✅

### 2A: Mapbox Location Picker — SKIPPED

**Where it goes:** In the "LOCATION DETAILS" card section of the existing form, below the current location text input and state dropdown.

**Behavior:**
- Embed a Mapbox GL JS map (the project already has `mapbox-gl` as a dependency)
- User can click the map to drop a pin, which auto-fills the location text field with reverse-geocoded coordinates
- OR the user can type a location and the map updates to show that area
- Store lat/lng in form state — add `latitude` and `longitude` fields to `formData`
- Include these coordinates in the sighting submission payload
- The map should be bounded to roughly the Appalachian/Southeast US region by default (center around ~36°N, 82°W, zoom ~5)
- Use the same Mapbox token that's already configured for the Map page (check `src/pages/Map.tsx` or `.env` for `VITE_MAPBOX_TOKEN`)

**Map styling:**
- Use a muted/outdoors style that fits the site aesthetic — `mapbox://styles/mapbox/outdoors-v12` or similar
- The pin/marker should feel on-brand (use the primary color from the theme)

**Important:** The existing location text input and state dropdown should remain functional — the map is an enhancement, not a replacement. If someone doesn't want to use the map, the form still works fine.

### 2B: Bureau-Styled Confirmation Receipt ✅ COMPLETE

**What happens now:** ~~After successful submission, a toast notification appears and the form resets. This is underwhelming for the worldbuilding.~~ **FIXED** — Now shows a full Bureau Filing Receipt.

**What to build instead:** After successful submission, replace the form with a full-page "Bureau Filing Receipt" styled like the existing BureauMemo component. This should feel like an official government document confirming your report was received.

**Receipt content:**
- Header: "APPALACHIAN CRYPTID DIVISION — DEPARTMENT OF UNEXPLAINED PHENOMENA"
- Title: "SIGHTING REPORT — FILED"
- A generated case number (e.g., `SIG-2026-0205-XXXX` based on date + random)
- Summary of what was submitted: witness name (redacted partially like "K. Welborn"), date, location, creature name if provided
- Status: "PENDING FIELD REVIEW"
- A stamp component with "RECEIVED" 
- A "FILE COPY" watermark stamp
- Message: "Your report has been assigned to the nearest field office. An agent may contact you if additional details are required."
- Classification footer: "FOR OFFICIAL USE ONLY — DISTRIBUTION RESTRICTED"
- Two buttons at the bottom: "File Another Report" (resets to fresh form) and "Return to Directory" (links to /)

**Styling:** Reuse the existing memo-paper CSS classes, hole-punch marks, paper-clip, and Stamp component from `src/components/BureauMemo.tsx`. The receipt should have the same slightly-rotated, physical-document feel.

**Implementation approach:**
- Add a `submitted` state boolean and a `submissionData` object to store what was submitted
- When `submitted === true`, render the receipt component instead of the form
- "File Another Report" sets `submitted = false` and resets form
- Still keep the toast for error cases

### Backend changes — N/A (map picker skipped)
~~- The existing `functions/api/sightings/index.ts` POST endpoint needs to accept optional `latitude` and `longitude` fields~~
~~- The `db/schema.sql` sighting_reports table may need `latitude REAL` and `longitude REAL` columns added — check current schema first~~
~~- If the schema needs updating, provide a migration SQL file~~

### Files modified
- `src/pages/ReportSighting.tsx` — added submission state, conditional receipt rendering ✅
- ~~`src/hooks/use-sightings.ts` — add lat/lng to the submission type~~ — N/A (map picker skipped)
- ~~`functions/api/sightings/index.ts` — accept lat/lng in POST~~ — N/A (map picker skipped)
- ~~`db/schema.sql` — add columns if needed~~ — N/A (map picker skipped)

### Files created
- `src/components/SightingReceipt.tsx` — the Bureau confirmation receipt component ✅
- ~~`src/components/MapPicker.tsx` — the Mapbox location picker component~~ — SKIPPED

### What NOT to do ✅ All followed
- Don't restructure the form into multi-step — keep it as a single scrolling form ✅
- Don't remove the existing photo upload functionality ✅
- Don't add new npm dependencies (mapbox-gl is already installed) ✅
- Don't modify the BureauMemo component — create a new SightingReceipt that reuses the same CSS patterns ✅
