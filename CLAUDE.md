# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Appalachian Cryptid Compendium is a React-based web application for cataloging cryptid sightings in the Appalachian region. The project uses:

- **Frontend**: React 18 + TypeScript + Vite + shadcn/ui + Tailwind CSS
- **Backend**: Cloudflare Pages Functions + D1 Database
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

# Query the database locally
wrangler d1 execute cryptid-db --local --command="SELECT * FROM cryptids"

# Deploy database to production
wrangler d1 execute cryptid-db --file=./db/schema.sql

# Start local development with D1 binding
wrangler pages dev dist --binding DB=cryptid-db
```

## Architecture

### Dual Data Mode (API + Static Fallback)

The application implements a smart fallback system that allows development without a running backend:

- **data-provider.ts**: Checks API availability and falls back to static data from `src/data/cryptids.ts`
- **API functions** in `src/lib/api.ts`: Direct API client for backend operations
- **Custom hooks** in `src/hooks/`: Use TanStack Query for data fetching with caching

When the backend is unavailable (e.g., during frontend-only development), the app automatically uses static data. This is transparent to components.

### Backend Structure (Cloudflare Pages Functions)

API routes are file-based in the `functions/api/` directory:

- `functions/api/cryptids/index.ts` → `GET /api/cryptids`, `POST /api/cryptids`
- `functions/api/cryptids/[id].ts` → `GET /api/cryptids/:id`, `PUT /api/cryptids/:id`, `DELETE /api/cryptids/:id`
- `functions/api/sightings/index.ts` → `GET /api/sightings`, `POST /api/sightings`
- `functions/api/sightings/[id].ts` → `PUT /api/sightings/:id`, `DELETE /api/sightings/:id`
- `functions/api/auth.ts` → `POST /api/auth` (login), `GET /api/auth` (verify)
- `functions/api/_shared.ts` → Shared utilities, types, and helpers

### Database Schema

The D1 database schema (`db/schema.sql`) includes:

- `cryptids`: Main cryptid records
- `testimonies`: Eyewitness accounts (one-to-many with cryptids)
- `timeline_events`: Historical events (one-to-many with cryptids)
- `sighting_reports`: User-submitted sighting reports (pending admin review)

### Authentication

Admin authentication uses a simple bearer token system:

- `ADMIN_API_KEY` environment variable must be set in Cloudflare dashboard for production
- Frontend stores auth token in localStorage
- All admin operations (POST/PUT/DELETE) require authentication
- Public endpoints (GET cryptids, POST sightings) are unauthenticated

### Frontend Patterns

- **Route structure** defined in `src/App.tsx` using React Router
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
5. **Admin Panel**: Review and manage sighting reports, CRUD operations on cryptids

## Security Practices

This project uses Snyk for security scanning. When generating or modifying code:

- Run security scans on new first-party code
- Address security issues found in newly introduced code or dependencies
- Rescan after fixes to ensure issues are resolved
- Repeat until no new issues are found

## Important Notes

- The app runs on port 8080 (not 5173) due to Vite configuration
- When adding new routes, place them ABOVE the catch-all `*` route in `src/App.tsx`
- Tags in the database are stored as JSON strings and must be parsed/stringified
- The `wrangler.toml` requires a `database_id` to be filled in after creating the D1 database
- For local D1 development, use `database_id = "local"` in the development environment config
