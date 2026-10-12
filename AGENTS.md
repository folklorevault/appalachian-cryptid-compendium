# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

The Appalachian Cryptid Compendium is a Next.js web application for cataloging cryptid sightings in the Appalachian region. Built with a "forgotten bureau field guide" aesthetic.

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 (CSS-first — tokens live in `@theme` in `src/app/globals.css`, no `tailwind.config`) + shadcn/ui
- **CMS**: Sanity CMS (project ID: `8thljucm`, dataset: `production`)
- **Hosting**: Vercel
- **Map**: Mapbox GL JS for interactive sighting maps
- **Analytics**: Rybbit (self-hosted at `rybbit.folklorevault.com`)

## Development Commands

This project uses [mise](https://mise.jdx.dev) to pin Node + pnpm and drive tasks. `mise.toml` at the repo root declares the toolchain (Node 24, pnpm 11) and tasks. Prefer `mise <task>` over running binaries directly so the right Node version and `.env.local` are always loaded.

```bash
mise install          # Install pinned Node + pnpm versions (one-time, on fresh checkout)
pnpm install          # Install dependencies
mise dev              # Start the Next.js dev server (http://localhost:3000)
mise build            # Production build
mise start            # Serve the production build
mise lint             # ESLint
mise typecheck        # tsc --noEmit
mise check:csp        # Verify the CSP still allows BotID's challenge (add --url <url> for live)
mise borders:generate # Re-run the Appalachian state-borders generator
mise studio:dev       # Run the Sanity studio locally
mise studio:deploy    # Deploy the Sanity studio
mise tasks ls         # List all tasks
```

The project uses **pnpm** as its package manager. Lockfiles are `pnpm-lock.yaml` at both the root and inside `sanity/appalachian-cryptid/`. pnpm settings (overrides, allowed build scripts) live in `pnpm-workspace.yaml` files alongside each `package.json`.

## Architecture

### App Router Structure

Pages live in `src/app/` using Next.js file-based routing:

- `page.tsx` — Homepage (cryptid directory with filters)
- `cryptid/[slug]/page.tsx` — Cryptid detail (SSG with `generateStaticParams`)
- `anomalies/page.tsx` — Anomalies directory
- `anomaly/[slug]/page.tsx` — Anomaly detail (SSG)
- `bulletins/page.tsx` — Bureau bulletins listing
- `bulletin/[slug]/page.tsx` — Bulletin detail (SSG)
- `map/page.tsx` — Interactive Mapbox sighting map
- `report/page.tsx` — Public sighting report form
- `about/page.tsx` — About page
- `shop/page.tsx` — Field supply shop
- `links/page.tsx` — Link-in-bio dossier (hidden from nav)
- `bureau/which-cryptid-are-you/` — Cryptid affinity quiz (ACD-41)
- `bureau/form-acd-27b/page.tsx` — Hidden mad-lib witness form
- `contact/`, `privacy/`, `terms/`, `newsletter-success/`, `newsletter-error/` — Utility pages
- `rss.xml/` — Bulletins RSS feed
- `sitemap.ts`, `robots.ts` — Dynamic sitemap and robots generation
- `not-found.tsx` — 404 page

### API Routes

- `api/sightings/route.ts` — `POST` sighting reports (writes to Sanity as `sightingReport` documents)
- `api/newsletter/route.ts` — `POST` newsletter signups (forwards to Loops.so)
- `api/revalidate/route.ts` — `POST` Sanity webhook handler (on-demand ISR via `revalidateTag`)

### Sanity CMS Integration

- **Sanity Studio**: `sanity/appalachian-cryptid/` — **this is the deployed studio**
  - Studio URL: `appalachian-cryptid.sanity.studio`
  - Schemas: `sanity/appalachian-cryptid/schemaTypes/` — `cryptid`, `anomaly`, `bulletin`, `sighting`, `sightingReport`, `caseFileSection`, `homepageAnomaliesDesk` (singleton), `linkInBio`
- **Client**: `src/lib/sanity/client.ts` — Sanity client config
- **Image helper**: `src/lib/sanity/image.ts` — `urlFor()` image URL builder
- **GROQ queries**: `src/lib/sanity/queries.ts`
- **Data fetchers**: `src/lib/sanity/fetchers.ts` — Server-side fetchers with static fallback
- **Legacy re-export**: `src/lib/sanity.ts` — Shim re-exporting from `src/lib/sanity/`

Schema changes go in `sanity/appalachian-cryptid/` and only take effect after `mise studio:deploy`.

### Dual Data Mode (Sanity + Static Fallback)

The fetchers in `src/lib/sanity/fetchers.ts` try Sanity first and fall back to static data from:
- `src/data/cryptids.ts` — Static cryptid data
- `src/data/bulletins.ts` — Static bulletin data

This allows development without a configured Sanity project.

### Revalidation Strategy

- Fetches use Next.js `next: { tags: [...] }` for tag-based caching
- Sanity webhook calls `/api/revalidate` to invalidate specific tags on content changes
- Tags: `"cryptids"`, `"cryptid-{slug}"`, `"anomalies"`, `"anomaly-{slug}"`, `"bulletins"`, `"bulletin-{slug}"`

### Frontend Patterns

- **shadcn/ui components** in `src/components/ui/` (do not modify directly)
- **Custom components** in `src/components/`
- **Path alias**: `@/` maps to `src/`
- **Fonts**: Self-hosted in `public/fonts/` — Work Sans (`font-sans`, body), Rokkitt (`font-display`, headings and numerals), Special Elite (`font-typewriter`, labels and UI text)
- **Dark mode** ("Night Shift"): class-based (`.dark` on `<html>`), driven by `src/lib/theme.ts` + `ThemeToggle`. Colors invert through the HSL tokens in `globals.css`, so use tokens and check both themes
- **Metadata**: Root layout sets `metadataBase` and default OG/Twitter tags; pages override via `export const metadata` or `generateMetadata()`

### Design Consistency

Every type size, tracking value and color should trace back to a named token in `src/app/globals.css`. Do not introduce arbitrary values (`text-[28px]`, `tracking-[0.18em]`, raw hex/HSL); if no token fits, add a named one to `@theme` with a comment saying what it is for.

**Type scale** — the same role gets the same size on every page:

| Role | Class | Size |
|---|---|---|
| Index-page H1 (homepage, `/anomalies`, `/bulletins`, `/shop`, quiz) and anomaly detail H1 | `text-hero` + `font-display font-bold` | clamp, 64px max |
| Homepage Anomalies Desk band headline only | `text-plate` | clamp, 76px max |
| Cryptid detail H1 | `text-title` | 28px |
| Section H2, card and ledger-row titles | `text-xl` | 20px |
| Hero lede, long-form body | `text-base leading-relaxed` | 16px |
| Card descriptions, secondary copy | `text-sm` | 14px |
| Typewriter eyebrows, notes, chips, meta | `text-xs` | 12px |
| Catalog rows, inline marks | `text-caption` | 11px |
| Uppercase bureau labels, table heads (the floor — nothing functional goes smaller) | `text-tag` | 10px |

**Typewriter tracking**: `tracking-eyebrow` (0.2em, prominent uppercase kickers), `tracking-label` (0.15em, sub-labels, table heads), `tracking-type` (0.05em, running typewriter text).

**Color**: use the semantic (`foreground`, `muted-foreground`, `primary`, `border`) and `bureau-*` tokens. Dark "ink plate" sections use `bg-bureau-ink` with `text-bureau-paper` / `text-bureau-manila-light` and `bureau-rust` accents.

**Deliberate exceptions — do not "fix" these:**
- Anomaly file numbers (`006` in the ledger at `text-4xl`/`text-5xl`; `text-7xl`/`text-8xl` on the detail page) are a signature device.
- Marker and legend hex values in `CryptidMap` are intentional.

When a new page or component copies an existing pattern (hero, ledger row, card, section head), copy its type classes too rather than re-choosing sizes. After a redesign of one section, compare its H1, lede and row titles against the homepage before shipping.

### Security Headers

CSP and security headers are configured in `next.config.ts` via the `headers()` function. When adding new external resources, update the CSP directives there.

### Environment Variables

**Next.js public (available client-side):**
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity project ID (defaults to `8thljucm`)
- `NEXT_PUBLIC_SANITY_DATASET` — Sanity dataset (defaults to `production`)
- `NEXT_PUBLIC_MAPBOX_TOKEN` — Mapbox GL JS token

**Server-only (set in Vercel dashboard):**
- `SANITY_API_TOKEN` — Write token for sighting report submissions
- `SANITY_WEBHOOK_SECRET` — Webhook verification secret
- `LOOPS_API_KEY` — Loops.so newsletter API key

## Sanity Studio Setup

```bash
cd sanity/appalachian-cryptid && pnpm install   # one-time
mise studio:dev       # Local studio
mise studio:deploy    # Deploy to sanity.studio
```

## Security Practices

When generating or modifying code:
- Run security scans on new first-party code
- Address security issues found in newly introduced code or dependencies
- Rescan after fixes to ensure issues are resolved
- When adding external resources, update the CSP in `next.config.ts`

## Important Notes

- When adding new routes, create a new directory in `src/app/` with a `page.tsx`
- Dynamic routes use `generateStaticParams` for SSG and `generateMetadata` for per-page SEO
- The `.env` file still has `VITE_` prefixed vars from the old Vite setup — the app uses `NEXT_PUBLIC_` prefixes now
- The `scripts/` directory contains one-off migration scripts plus `check-csp.mjs` (the CSP guard run in CI); none are part of the running app
- `AGENTS.md` mirrors this file for other agents — apply the same edit to both. `next dev` appends its own `nextjs-agent-rules` block to `AGENTS.md`; leave that block in place
- `src/lib/sanity-queries.ts` and `src/lib/sanity-provider.ts` are legacy files from the Vite era — active code uses `src/lib/sanity/`

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
