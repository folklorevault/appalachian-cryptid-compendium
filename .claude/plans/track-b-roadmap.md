# Track B Roadmap — Major Version Upgrades

## Overview

5 upgrades over ~5 weeks, ordered by dependency chain. Each week is self-contained and can be merged independently.

---

## Week 1 — React 18 → 19 (Root App Only)

**Effort: 3–6 hours** | **Prerequisite: Node 20.9+**

The Sanity Studio already runs React 19. Only the root Next.js app needs updating.

**Steps:**
1. `npm install react@latest react-dom@latest @types/react@latest @types/react-dom@latest`
2. May need `--legacy-peer-deps` if Radix UI packages haven't updated their peerDeps metadata yet
3. `npm run build` — verify no errors
4. Check browser console for React deprecation warnings

**Risk:** Low. This codebase has zero `forwardRef` calls in custom components (all delegated to Radix). No legacy Context patterns. No `ReactDOM.render()`.

---

## Week 2 — Next.js 15 → 16

**Effort: 6–10 hours** | **Prerequisite: React 19 (Week 1)**

**Steps:**
1. Run official codemod: `npx @next/codemod@canary upgrade latest`
2. **Async params** — the main manual work. All `params` and `searchParams` are now Promises:
   - `src/app/cryptid/[slug]/page.tsx` — `await props.params`
   - `src/app/anomaly/[slug]/page.tsx` — `await props.params`
   - `src/app/bulletin/[slug]/page.tsx` — `await props.params`
   - Also update corresponding `generateMetadata` functions
3. Codemod auto-migrates `"lint": "next lint"` → `"lint": "eslint ."` in package.json
4. Replace `FlatCompat` bridge in `eslint.config.js` with native flat config imports from `eslint-config-next`
5. Verify Node version ≥ 20.9 (Vercel project settings too)

**Key changes (no action needed):**
- Turbopack is now default for dev (no custom webpack config in this project)
- Image cache TTL default increased from 60s to 4hrs (fine for Sanity CDN images)
- `revalidateTag` gains optional second arg — existing calls unchanged

---

## Week 3 — ESLint 9 → 10 + @sanity/eslint-config-studio 5 → 6

**Effort: 2–4 hours** | **Prerequisite: Next.js 16 ESLint wiring (Week 2)**

**Root app:**
```bash
npm install -D eslint@latest eslint-config-next@latest
```
- Remove `@eslint/eslintrc` dependency (no longer need `FlatCompat`)
- Flat config already in place — main change is cleanup

**Sanity Studio:**
```bash
cd sanity/appalachian-cryptid
npm install -D @sanity/eslint-config-studio@latest eslint@latest
```
- Studio's `eslint.config.mjs` needs no changes

**Note:** ESLint 10 requires Node 20.19+ specifically (tighter than Next.js 16's 20.9+ requirement).

---

## Week 4 — Tailwind CSS 3 → 4 + tailwind-merge 2 → 3

**Effort: 8–16 hours** | **Prerequisite: React 19 stable (Week 1)**

This is the largest change. Do it on an isolated branch with visual QA.

**Steps:**
1. Run codemod: `npx @tailwindcss/upgrade`
   - Converts `tailwind.config.ts` → CSS `@theme` directives
   - Rewrites PostCSS config (removes `autoprefixer`)
   - Renames deprecated utility classes across all files
2. `npm install tailwind-merge@latest` — **must** co-upgrade (v2 doesn't understand v4 classes)
3. `npm install @tailwindcss/typography@latest`
4. Check `tailwindcss-animate` compatibility (used by shadcn/ui)

**Class renames to watch in `src/components/ui/`:**

| v3 | v4 |
|---|---|
| `shadow-xs` | `shadow-2xs` |
| `shadow-sm` | `shadow-xs` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `outline-hidden` | `outline-hidden` |
| `ring-3` | `ring-3` |
| `shrink-0` | `shrink-0` |

**Behavior change:** `hover:` now only applies on hover-capable devices (`@media (hover: hover)`). Review interactive components for touch-device UX.

**Visual QA checklist:**
- [ ] Homepage card grid + filters
- [ ] Cryptid/Anomaly/Bulletin detail pages
- [ ] Map page
- [ ] Report form
- [ ] Shop page
- [ ] About page
- [ ] 404 page

---

## Week 5 — lucide-react 0.462 → 0.577

**Effort: 1–2 hours** | **Can overlap with Week 4**

**Steps:**
1. `npm install lucide-react@latest`
2. Fix deprecated brand icons in share buttons — replace `Twitter` and `Facebook` imports with inline SVGs or `@icons-pack/react-simple-icons`
3. All other 32+ icons in use are stable and not deprecated

**Recommended approach** (inline SVG, zero new deps):
```tsx
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
  </svg>
);
```

---

## Quick Reference

| Week | Upgrade | Effort | Key Risk |
|---|---|---|---|
| 1 | React 18 → 19 | Low | Radix peerDep warnings (cosmetic) |
| 2 | Next.js 15 → 16 | Medium | Async params in 3 dynamic routes |
| 3 | ESLint 9 → 10 | Low | Node must be ≥20.19 |
| 4 | Tailwind 3 → 4 | **High** | Class renames + visual QA across all pages |
| 5 | lucide-react | Low | 2 icon replacements |

---

## Files Affected Per Week

**Week 1:** `package.json`, `package-lock.json`
**Week 2:** `package.json`, `src/app/cryptid/[slug]/page.tsx`, `src/app/anomaly/[slug]/page.tsx`, `src/app/bulletin/[slug]/page.tsx`, `eslint.config.js` → `eslint.config.mjs`, `next.config.ts` (review only)
**Week 3:** `package.json` (both root + studio), `eslint.config.mjs`
**Week 4:** `package.json`, `postcss.config.*`, `tailwind.config.ts` (removed), `src/app/globals.css`, all files with Tailwind classes
**Week 5:** `package.json`, share button component(s)
