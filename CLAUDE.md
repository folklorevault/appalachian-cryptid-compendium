# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Appalachian Cryptid Compendium is a Next.js web application for cataloging cryptid sightings in the Appalachian region. Built with a "forgotten bureau field guide" aesthetic.

- **Framework**: Next.js 15 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **CMS**: Sanity CMS (project ID: `8thljucm`, dataset: `production`)
- **Hosting**: Vercel
- **Map**: Mapbox GL JS for interactive sighting maps
- **Analytics**: Rybbit (self-hosted at `rybbit.folklorevault.com`)

## Development Commands

This project uses [mise](https://mise.jdx.dev) to pin Node and drive tasks. `mise.toml` at the repo root declares the toolchain (Node 22) and tasks. Prefer `mise <task>` over `npm run` so the right Node version and `.env.local` are always loaded.

```bash
mise install          # Install pinned Node version (one-time, on fresh checkout)
mise dev              # Start the Next.js dev server (http://localhost:3000)
mise build            # Production build
mise start            # Serve the production build
mise lint             # ESLint
mise typecheck        # tsc --noEmit
mise borders:generate # Re-run the Appalachian state-borders generator
mise studio:dev       # Run the Sanity studio locally
mise studio:deploy    # Deploy the Sanity studio
mise tasks ls         # List all tasks
```

The underlying npm scripts (`npm run dev`, etc.) still work, but `mise` activation handles Node version + env file loading automatically when you `cd` into the directory.

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
- `sitemap.ts` — Dynamic sitemap generation
- `not-found.tsx` — 404 page

### API Routes

- `api/sightings/route.ts` — `POST` sighting reports (writes to Sanity as `sightingReport` documents)
- `api/newsletter/route.ts` — `POST` newsletter signups (forwards to Loops.so)
- `api/revalidate/route.ts` — `POST` Sanity webhook handler (on-demand ISR via `revalidateTag`)

### Sanity CMS Integration

- **Sanity Studio**: `sanity/appalachian-cryptid/` — **this is the deployed studio**
  - Studio URL: `appalachian-cryptid.sanity.studio`
  - Schema: `sanity/appalachian-cryptid/schemaTypes/cryptid.ts`
- **Client**: `src/lib/sanity/client.ts` — Sanity client config
- **Image helper**: `src/lib/sanity/image.ts` — `urlFor()` image URL builder
- **GROQ queries**: `src/lib/sanity/queries.ts`
- **Data fetchers**: `src/lib/sanity/fetchers.ts` — Server-side fetchers with static fallback
- **Legacy re-export**: `src/lib/sanity.ts` — Shim re-exporting from `src/lib/sanity/`

**IMPORTANT**: There are two Sanity folders — always use `sanity/appalachian-cryptid/` for schema changes:
- `sanity/` — Legacy/partial setup (do not use)
- `sanity/appalachian-cryptid/` — **Active studio that deploys**

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
- **Fonts**: Self-hosted in `public/fonts/` — Work Sans, Rokkitt, Special Elite
- **Metadata**: Root layout sets `metadataBase` and default OG/Twitter tags; pages override via `export const metadata` or `generateMetadata()`

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
cd sanity/appalachian-cryptid && npm install
npm run dev       # Local studio
npm run deploy    # Deploy to sanity.studio
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
- The `scripts/` directory contains one-off migration scripts (not part of the running app)
- `src/lib/sanity-queries.ts` and `src/lib/sanity-provider.ts` are legacy files from the Vite era — active code uses `src/lib/sanity/`
