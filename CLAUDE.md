# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Appalachian Cryptid Compendium is a React-based web application for cataloging cryptid sightings in the Appalachian region. The project uses:

- **Frontend**: React 18 + TypeScript + Vite + shadcn/ui + Tailwind CSS
- **CMS**: Sanity CMS for cryptid content management
- **Backend**: Cloudflare Pages Functions + D1 Database (for sighting reports)
- **State Management**: TanStack Query for server state
- **Routing**: React Router v6
- **Map**: Mapbox GL JS for interactive sighting maps

## Development Commands

```bash
# Install dependencies
npm i

# Start development server (runs on http://localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development (useful for testing without minification)
npm run build:dev

# Lint code
npm run lint

# Preview production build locally
npm run preview
```

## Cloudflare D1 Database Commands

```bash
# Create the D1 database (first time setup)
wrangler d1 create cryptid-db

# Run database migrations (apply schema)
wrangler d1 execute cryptid-db --local --file=./db/schema.sql

# Run analytics table migration
wrangler d1 execute cryptid-db --local --file=./db/analytics-schema.sql

# Query the database locally
wrangler d1 execute cryptid-db --local --command="SELECT * FROM cryptids"

# Deploy database to production
wrangler d1 execute cryptid-db --file=./db/schema.sql
wrangler d1 execute cryptid-db --file=./db/analytics-schema.sql

# Create R2 bucket for image storage
wrangler r2 bucket create cryptid-images

# Start local development with D1 binding
wrangler pages dev dist --binding DB=cryptid-db
```

## Architecture

### Sanity CMS Integration

Cryptid content is managed via Sanity CMS:

- **Sanity Studio**: Hosted at `appalachian-cryptid.sanity.studio` for content editing
- **Schema**: `sanity/appalachian-cryptid/schemaTypes/cryptid.ts` - **THIS IS THE DEPLOYED SCHEMA** (not `sanity/schemas/`)
- **Client**: `src/lib/sanity.ts` configures the Sanity client with image URL builder
- **Queries**: `src/lib/sanity-queries.ts` contains GROQ queries for fetching data
- **Provider**: `src/lib/sanity-provider.ts` handles data fetching with static fallback
- **Hooks**: `src/hooks/use-sanity-cryptids.ts` provides TanStack Query hooks

**IMPORTANT**: There are two Sanity folders - always use `sanity/appalachian-cryptid/` for schema changes:
- `sanity/` - Legacy/partial setup (do not use)
- `sanity/appalachian-cryptid/` - **Active studio that deploys**

### Dual Data Mode (Sanity + Static Fallback)

The application implements a smart fallback system:

- **sanity-provider.ts**: Checks Sanity availability and falls back to static data from `src/data/cryptids.ts`
- When Sanity is unavailable or not configured, the app automatically uses static data
- This allows development without a configured Sanity project

### Backend Structure (Cloudflare Pages Functions)

API routes for sighting reports are file-based in the `functions/api/` directory:

- `functions/api/sightings/index.ts` → `GET /api/sightings`, `POST /api/sightings`
- `functions/api/sightings/[id].ts` → `PUT /api/sightings/:id`, `DELETE /api/sightings/:id`
- `functions/api/auth.ts` → `POST /api/auth` (login), `GET /api/auth` (verify)
- `functions/api/upload.ts` → `POST /api/upload` (image uploads to R2)
- `functions/api/images/[[path]].ts` → `GET /api/images/*` (serve **optimized** images from R2)
- `functions/api/analytics.ts` → `POST /api/analytics` (track events with dual-write to Analytics Engine + D1), `GET /api/analytics` (info)
- `functions/api/analytics/stats.ts` → `GET /api/analytics/stats` (retrieve dashboard stats from D1, admin-only)
- `functions/api/cache/purge.ts` → `POST /api/cache/purge` (clear cache, admin-only)
- `functions/_middleware.ts` → Global middleware for caching, SEO headers, and edge optimization
- `functions/api/_shared.ts` → Shared utilities, types, and helpers

Note: Cryptid data is now managed via Sanity CMS; the D1 cryptids tables are deprecated.

### Database Schema

The D1 database schema (`db/schema.sql` and `db/analytics-schema.sql`) is used for:

- `sighting_reports`: User-submitted sighting reports (pending admin review)
- `analytics`: Analytics events for admin dashboard (dual-written with Analytics Engine)

### Authentication

Admin authentication uses a simple bearer token system:

- `ADMIN_API_KEY` environment variable must be set in Cloudflare dashboard for production
- Frontend stores auth token in localStorage
- All admin operations (POST/PUT/DELETE) require authentication
- Public endpoints (GET cryptids, POST sightings) are unauthenticated

### Frontend Patterns

- **Route structure** defined in `src/App.tsx` using React Router
- **Lazy loading**: All pages except Index use `React.lazy()` for code splitting - follow this pattern for new pages
- **shadcn/ui components** in `src/components/ui/` (do not modify directly)
- **Custom components** in `src/components/`
- **Pages** in `src/pages/`
- **Hooks** follow the pattern: `use-[resource].ts` for TanStack Query hooks
- **Path alias**: `@/` maps to `src/` (configured in vite.config.ts)

## Key Features

1. **Cryptid Directory**: Browse and filter cryptids by region and danger level
2. **Detail Pages**: View full cryptid information including testimonies and timeline
3. **Interactive Map**: Mapbox-powered map showing sighting locations
4. **Report Sightings**: Public form for submitting new sighting reports
5. **Admin Panel**: Review and moderate user-submitted sighting reports
6. **Sanity Studio**: Full CMS for managing cryptid content with testimonies and timeline events
7. **Image Optimization**: Automatic image resizing, compression, and format conversion via Cloudflare Workers
8. **Analytics**: Privacy-focused analytics tracking page views, cryptid popularity, and user interactions
9. **Edge Caching**: Cloudflare edge caching for fast page loads worldwide

## Security Practices

When generating or modifying code:

- Run security scans on new first-party code
- Address security issues found in newly introduced code or dependencies
- Rescan after fixes to ensure issues are resolved
- Repeat until no new issues are found

## Important Notes

- The app runs on port 8080 (not 5173) due to Vite configuration
- When adding new routes, place them ABOVE the catch-all `*` route in `src/App.tsx`
- The `wrangler.toml` requires a `database_id` to be filled in after creating the D1 database
- For local D1 development, use `database_id = "local"` in the development environment config

## Sanity Setup

To configure Sanity CMS:

1. Create a Sanity project at https://sanity.io/manage
2. Add environment variables:
   - `VITE_SANITY_PROJECT_ID`: Your project ID
   - `VITE_SANITY_DATASET`: Dataset name (usually `production`)
3. Install Studio dependencies: `cd sanity/appalachian-cryptid && npm install`
4. Run Studio locally: `cd sanity/appalachian-cryptid && npm run dev`
5. Deploy Studio: `cd sanity/appalachian-cryptid && npm run deploy`

**IMPORTANT**: Always use `sanity/appalachian-cryptid/` directory for Sanity commands, NOT `sanity/`.

The frontend will fall back to static data if Sanity is not configured.

## Cloudflare Workers Features

This project leverages several Cloudflare Workers features for performance and analytics. See `CLOUDFLARE-FEATURES.md` for full documentation.

### Image Optimization

Images served from `/api/images/*` support automatic optimization via query parameters:

```tsx
// Example: 800x800 WebP at 85% quality
<img src="/api/images/mothman.jpg?w=800&h=800&f=webp&q=85" />
```

**Parameters:**
- `w` - Width in pixels
- `h` - Height in pixels
- `q` - Quality (1-100, default: 85)
- `f` - Format (webp, avif, jpeg, png)

### Analytics

Privacy-focused analytics with **dual-write strategy**:
- **Writes to**: Cloudflare Analytics Engine (long-term, unlimited scale) + D1 (dashboard queries)
- **Page views**: All cryptid detail pages and homepage
- **Search queries**: What users search for (debounced)
- **Filters**: Region and danger level filter usage
- **Sighting submissions**: Successful sighting report submissions

**Access analytics:**
```bash
# Dashboard stats (from D1)
curl -H "Authorization: Bearer YOUR_ADMIN_KEY" \
  https://your-domain.com/api/analytics/stats

# Or use the admin dashboard at /admin/analytics
```

**Client-side usage:**
```tsx
import { analytics } from '@/lib/analytics';

// Track custom event
analytics.trackEvent('button_clicked', { button: 'load_more' });

// Track cryptid view (already integrated in CryptidDetail.tsx)
analytics.trackCryptidView(slug, name);
```

### Edge Caching

Automatic caching is configured via `functions/_middleware.ts`:
- **Homepage**: 30 minutes
- **Cryptid detail pages**: 1 hour
- **Images**: 1 year (immutable)

All responses include an `X-Cache` header (`HIT` or `MISS`).

**Purge cache after content updates:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"path": "/cryptids/mothman"}' \
  https://your-domain.com/api/cache/purge
```

### SEO & Performance

The middleware automatically adds:
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Cache-Control headers for optimal performance
- Edge rendering for faster worldwide delivery

**Best Practices:**
1. Always use optimized images with `?w=&f=webp` parameters
2. Purge cache after publishing new cryptids in Sanity
3. Monitor analytics for popular content
4. Check `X-Cache` headers in Network tab to verify caching

For complete documentation, see `CLOUDFLARE-FEATURES.md`.
