# Plan: React 18→19 + Next.js 15→16 Upgrade

## Key Finding

The codebase is **already prepared** for both upgrades. Dynamic route params are already async (`Promise<{ slug: string }>`), no `searchParams` usage, no `forwardRef` in custom components, ESLint flat config already in place. This is primarily a dependency bump with minor cleanup.

---

## Step 1: React 18 → 19

1. Install React 19 + types:
   ```bash
   npm install react@latest react-dom@latest @types/react@latest @types/react-dom@latest
   ```
   - May need `--legacy-peer-deps` if Radix packages lag on peerDep metadata
2. `npm run build` — verify no type errors
3. `npm run dev` — check browser console for deprecation warnings

**Files modified:** `package.json`, `package-lock.json`
**No source code changes needed** — zero custom `forwardRef`, no legacy context patterns, no `ReactDOM.render()`

---

## Step 2: Next.js 15 → 16

1. Run the official codemod:
   ```bash
   npx @next/codemod@canary upgrade latest
   ```
   This handles:
   - Bumping `next` to 16.x
   - Bumping `eslint-config-next` to match
   - Updating lint script if needed

2. **Async params** — already done! All 3 dynamic routes already use `Promise<{ slug: string }>` and `await params`. No changes needed:
   - `src/app/cryptid/[slug]/page.tsx` ✅
   - `src/app/anomaly/[slug]/page.tsx` ✅
   - `src/app/bulletin/[slug]/page.tsx` ✅

3. **ESLint config cleanup** — `eslint.config.js` currently uses `FlatCompat` from `@eslint/eslintrc` to bridge `next/core-web-vitals`. After Next.js 16, `eslint-config-next` supports native flat config. Update to:
   ```js
   import { nextConfig } from "eslint-config-next";
   export default [
     ...nextConfig({ rootDir: import.meta.dirname }),
     { rules: { /* existing overrides */ } },
     { ignores: ["functions/", "sanity/", "dist/", "_pages_old/"] },
   ];
   ```
   Then remove `@eslint/eslintrc` from devDependencies.

4. Rename `eslint.config.js` → `eslint.config.mjs` (ESM module)

5. `npm run build` — verify clean build
6. `npm run dev` — smoke test all pages

**Files modified:** `package.json`, `package-lock.json`, `eslint.config.js` → `eslint.config.mjs`

---

## Step 3: Verification

- [ ] `npm run build` — clean, no errors
- [ ] `npm run lint` — passes
- [ ] `npm run dev` — smoke test:
  - Homepage (cryptid directory + filters)
  - Cryptid detail page (`/cryptid/mothman` or similar)
  - Anomaly detail page
  - Bulletin detail page
  - Map page (Mapbox loads)
  - Report form (client component works)
  - About page
- [ ] Browser console — no React deprecation warnings
- [ ] Turbopack dev server works (default in Next.js 16)

---

## Risk Assessment

| Item | Risk | Notes |
|------|------|-------|
| React 19 types | Low | `@types/react` 19 changes some generic defaults; build will catch issues |
| Radix peerDeps | Low | May warn but still work; `--legacy-peer-deps` if needed |
| Async params | None | Already migrated |
| ESLint config | Low | Straightforward rewrite of ~15 lines |
| Turbopack default | Low | No custom webpack config in this project |
| shadcn/ui components | Low | 11 files use `forwardRef` but React 19 still supports it (just deprecated) |

## Critical Files

- `package.json` — dependency versions
- `eslint.config.js` → `eslint.config.mjs` — ESLint flat config migration
- `src/app/cryptid/[slug]/page.tsx` — verify only (already async)
- `src/app/anomaly/[slug]/page.tsx` — verify only (already async)
- `src/app/bulletin/[slug]/page.tsx` — verify only (already async)
- `next.config.ts` — review only (no changes expected)
