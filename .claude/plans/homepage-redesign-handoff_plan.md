# Homepage Redesign + `/field-guide` Removal — Implementation Plan

## Goal

Two coordinated changes shipped together:

1. **Implement the homepage redesign** delivered by Claude Design in `public/handoff/` — adds an editorial row (Featured Cryptid + Recent Bulletins), a Map CTA section, refreshed hero copy, an h2/count above the directory, and updated metadata with regional keywords.
2. **Retire the standalone `/field-guide` route** — its only unique value was being a long-form combined reference of cryptids + anomalies. The redesigned homepage IS the cryptid directory, and `/anomalies` already exists as the anomaly index. The route is now redundant; replace it with a 301 redirect to `/` and clean up every reference.

## What `/field-guide` actually does today

- `src/app/field-guide/page.tsx` — fetches `cryptids` + `anomalies` and renders `<FieldGuideContent>` (a long combined reference layout) with `<Footer variant="full">` and `<BackToTop />`
- `src/components/FieldGuideContent.tsx` — only consumed by this one page (verified via grep)
- `BackToTop` is used by 4 other pages (about, anomaly/[slug], bulletin/[slug], cryptid/[slug]) — leave it alone

So the deletion is clean: one page, one component, both unreferenced after removal.

## Inbound references to `/field-guide` (every place that needs touching)

| File | Line | What's there | Action |
|---|---|---|---|
| `src/app/field-guide/page.tsx` | — | The route itself | DELETE entire folder |
| `src/components/FieldGuideContent.tsx` | — | Only used by the page above | DELETE |
| `src/components/Footer.tsx` | 44 | `<Link href="/field-guide">Field Guide</Link>` in "Explore" column | Change `href` to `/#field-guide` (deep-links to the directory section on the new homepage). Keep the "Field Guide" label — that's the brand language. |
| `src/components/Header.tsx` | 39 | `pathname === "/" \|\| pathname === "/field-guide"` keeps `/` link active when on /field-guide | Remove the `\|\| pathname === "/field-guide"` clause |
| `src/app/sitemap.ts` | 24–27 | Sitemap entry for `/field-guide` | DELETE the entry |
| `scripts/generate-seo-data.mjs` | 70–74 | Static SEO data record for `/field-guide` | DELETE the entry |
| `next.config.ts` | 57–75 | Existing `redirects()` array | ADD `{ source: '/field-guide', destination: '/', permanent: true }` — preserves SEO equity from any external inbound links |
| `CLAUDE.md` | 33 | Doc bullet for the field-guide route | DELETE the line |
| `AGENTS.md` | 33 | Doc bullet (same as CLAUDE.md) | DELETE the line |

## Scope check (verified)

All dependencies referenced by the four handoff files exist in the project at the expected paths and shapes. No missing imports, types, helpers, components, CSS classes, or CSS variables. CSP in `next.config.ts` already allows `cdn.sanity.io`. Safe to drop in as-is.

## ⚠️ One thing still to flag

**`public/handoff/` will leak source code in production if left in place.**
Anything under `public/` is served verbatim, so `https://site.com/handoff/page.tsx` would return raw TypeScript. Plan deletes the whole `public/handoff/` folder after the move.

## Files to modify (full list)

### Move (handoff → src)
| Action | Source | Destination |
|---|---|---|
| Move | `public/handoff/FeaturedCryptid.tsx` | `src/components/FeaturedCryptid.tsx` (NEW) |
| Move | `public/handoff/BulletinTeaser.tsx` | `src/components/BulletinTeaser.tsx` (NEW) |
| Move | `public/handoff/MapCTA.tsx` | `src/components/MapCTA.tsx` (NEW) |
| Replace | `public/handoff/page.tsx` | `src/app/page.tsx` (overwrite existing) |
| Delete | `public/handoff/README.md` + the now-empty folder | — |

### Delete (`/field-guide` retirement)
- `src/app/field-guide/page.tsx`
- `src/app/field-guide/` (the directory)
- `src/components/FieldGuideContent.tsx`

### Edit (small, targeted)
- `src/components/Footer.tsx` — line 44: `href="/field-guide"` → `href="/#field-guide"`
- `src/components/Header.tsx` — line 39: drop `|| pathname === "/field-guide"`
- `src/app/sitemap.ts` — remove the `/field-guide` entry (lines ~24–27)
- `scripts/generate-seo-data.mjs` — remove the `/field-guide` block (lines ~70–74)
- `next.config.ts` — append `{ source: '/field-guide', destination: '/', permanent: true }` to the `redirects()` array
- `CLAUDE.md` — remove line 33 (`field-guide/page.tsx` bullet)
- `AGENTS.md` — remove line 33 (same bullet)

## Critical files referenced (NOT modified — for awareness only)

- `src/lib/sanity/fetchers.ts:140,307` — `fetchCryptids`, `fetchBulletins` (already exist; no new fetcher needed)
- `src/lib/sanity/image.ts:12` — `urlFor`
- `src/lib/caseUtils.ts:20,33` — `getDangerLevelColor`, `getDangerLevelLabel`
- `src/types/sanity.ts:71,163,169` — `SanityCryptidListItem`, `BulletinCategory`, `SanityBulletinListItem`
- `src/components/Stamp.tsx`, `Footer.tsx` (`variant="full"`), `CryptidFilters.tsx`, `NewsletterSignup.tsx`, `ui/badge.tsx`
- `src/app/globals.css` — has all required classes (lines 301–590)
- CSS vars (`--bureau-ink-muted`, `--bulletin-*`) defined in `src/index.css` and `globals.css`
- `next.config.ts` — CSP already permits Sanity CDN; `images.remotePatterns` covers `cdn.sanity.io`

## Execution steps

### Phase A — Homepage redesign (handoff → src)

1. `git mv public/handoff/FeaturedCryptid.tsx src/components/FeaturedCryptid.tsx`
2. `git mv public/handoff/BulletinTeaser.tsx src/components/BulletinTeaser.tsx`
3. `git mv public/handoff/MapCTA.tsx src/components/MapCTA.tsx`
4. `git mv -f public/handoff/page.tsx src/app/page.tsx` (`-f` because destination exists)
5. `rm public/handoff/README.md && rmdir public/handoff`

### Phase B — Retire `/field-guide`

6. `git rm -r src/app/field-guide` (whole folder, contains only `page.tsx`)
7. `git rm src/components/FieldGuideContent.tsx`
8. Edit `src/components/Footer.tsx` line 44: `href="/field-guide"` → `href="/#field-guide"`
9. Edit `src/components/Header.tsx` line 39: drop the `|| pathname === "/field-guide"` clause from the `isActive` helper
10. Edit `src/app/sitemap.ts`: remove the `/field-guide` entry (the object at ~lines 24–27)
11. Edit `scripts/generate-seo-data.mjs`: remove the `seoData['/field-guide'] = {...}` block (lines ~70–74)
12. Edit `next.config.ts`: append a new redirect inside the `redirects()` array:
    ```ts
    {
      source: '/field-guide',
      destination: '/',
      permanent: true,
    },
    ```
13. Edit `CLAUDE.md` and `AGENTS.md`: remove the `- field-guide/page.tsx — Full field guide` bullet (line 33 in each — both files have the identical line)

### Phase C — Static checks

14. `npm run lint` — should pass clean
15. `npm run build` — production build catches TS errors and Next.js page issues. Specifically watch for:
    - Any lingering import of `FieldGuideContent` (should be none)
    - Any lingering reference to the field-guide route in generated SEO output

### Phase D — Visual verification on dev server (do NOT skip; aesthetic bar is high)

16. `npm run dev`, open `http://localhost:3000`
17. Confirm at desktop width (≥1024px): hero → editorial row (Featured Cryptid + Bulletin Teasers, side by side) → Cryptid Directory with new h2 + count → MapCTA → Newsletter → Footer
18. Confirm at tablet (768px): editorial row stays 2-column at md, then stacks below
19. Confirm at mobile (375px): all sections stack vertically; paper-clip / hole-punch decorations don't break the card layout
20. Hover the Featured Cryptid card → "Featured" stamp opacity-swap animation feels right
21. Hover the MapCTA → border highlights; sighting pins scale slightly
22. Click each link in the new sections: featured cryptid → `/cryptid/<slug>`, bulletin teaser → `/bulletin/<slug>`, "All Bulletins" → `/bulletins`, MapCTA → `/map`, footer "Field Guide" → scrolls smoothly to `#field-guide`
23. Open DevTools console → no React warnings, no missing-image errors, no CSP violations

### Phase E — Redirect + leak verification

24. `http://localhost:3000/field-guide` → should 308-redirect to `/` (Next.js uses 308 in dev for `permanent: true`; in production it's 301)
25. `http://localhost:3000/handoff/page.tsx` → should 404 (proves the public-folder source leak is closed)

### Phase F — Edge-case verification

26. **Empty bulletins:** if Sanity has no bulletins, the `BulletinTeaser` block should not render (parent guard in `page.tsx`); the editorial row falls back to a single-column Featured Cryptid. Confirm by either temporarily mocking the fetcher or checking against the static fallback in `src/data/bulletins.ts`.
27. **No featured cryptid (`cryptids[0]` null):** the entire editorial row's `(featuredCryptid || bulletins.length > 0)` guard should drop the section.
28. **Sanity image fallback:** if any cryptid has `gridImage: null`, Featured Cryptid should render the "Photo Unavailable" placeholder instead of a broken image.

### Phase G — Lighthouse / Web Vitals (recommended)

29. Run Lighthouse on `http://localhost:3000` → confirm LCP not regressed by the new Featured Cryptid hero image. The image is sized 200×300 with `placeholder="blur"`, so impact should be minimal.

## Verification (end-to-end summary)

The implementation is "done" when:
- ✅ `npm run lint` exits 0
- ✅ `npm run build` exits 0
- ✅ Dev server renders the new layout at desktop, tablet, and mobile widths
- ✅ All navigation links route correctly (incl. footer "Field Guide" → `/#field-guide` scroll)
- ✅ `/field-guide` 308/301 redirects to `/`
- ✅ `/handoff/*` 404s
- ✅ DevTools console clean (no warnings/errors/CSP violations)
- ✅ `git status` shows: 3 new components, 1 modified `src/app/page.tsx`, 5 deletions in `public/handoff/`, 2 deletions for `/field-guide` removal (page + component), 7 small edits (Footer, Header, sitemap, SEO script, next.config, CLAUDE.md, AGENTS.md)

## Out of scope (do NOT touch)

- Sanity schema changes (the handoff README hints at a future `featured: true` field; not part of this work)
- The legacy `sanity/` folder — irrelevant here
- `BackToTop` component — still used by 4 other pages
- The four other pages that import `BackToTop` (about, anomaly, bulletin, cryptid) — they need no changes

## Rollback

If anything looks off after deploy: `git revert` the implementation commit. Revert is clean — purely additive (3 new files), one page replaced, two files deleted, seven small surgical edits to existing files. The redirect rule even guarantees no broken inbound links during a partial revert window.
