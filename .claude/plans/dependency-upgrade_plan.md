# Dependency Upgrade Plan

## Summary

Two tracks: **Track A** (do now — security fixes + safe semver updates) and **Track B** (defer — major version bumps).

---

## Track A: Do Now

### Phase 1 — Security Fixes

**Root (1 HIGH vulnerability):**
- `flatted <3.4.0` — DoS via unbounded recursion

**Sanity Studio (4 vulnerabilities):**
- `flatted <3.4.0` — DoS (HIGH)
- `tar <=7.5.10` — path traversal (HIGH)
- `undici <=6.23.0` — WebSocket/HTTP smuggling (HIGH x5)
- `dompurify 3.1.3-3.3.1` — XSS (MODERATE)

Note: The Sanity Studio vulns (`tar`, `undici`, `dompurify`) are inside `@sanity/cli` (dev tooling), not runtime code.

**Steps:**
1. `npm audit fix` in root
2. `cd sanity/appalachian-cryptid && npm audit fix`
3. Verify: `npm audit` shows 0 vulnerabilities in both locations

---

### Phase 2 — Safe Semver Updates: Root

Run `npm update` in root. Key updates:

| Package | From | To | Risk |
|---|---|---|---|
| `@sanity/client` | 7.13.1 | 7.17.0 | Low — client API stable across 7.x |
| `@sanity/image-url` | 2.0.2 | 2.0.3 | Patch |
| `mapbox-gl` | 3.16.0 | 3.20.0 | Low — minor |
| `typescript` | 5.8.3 | 5.9.3 | Low — minor |
| 6x `@radix-ui/*` | various | patch bumps | Minimal |
| `postcss`, `autoprefixer`, `@tailwindcss/typography` | various | patches | Minimal |

The `apiVersion: "2024-01-01"` in `src/lib/sanity/client.ts` does NOT need updating — it pins Sanity API behavior, not the client version.

**Verify:**
- `npm run build` — catches type errors
- `npm run lint`
- `npm run dev` — smoke-test homepage, a cryptid detail page, map, /report form

---

### Phase 3 — Safe Semver Updates: Sanity Studio

Run `npm update` in `sanity/appalachian-cryptid/`. Key updates:

| Package | From | To | Notes |
|---|---|---|---|
| `sanity` | 5.12.0 | 5.16.0 | Minor — see breakage analysis below |
| `@sanity/vision` | 5.1.0 | 5.16.0 | Version realignment (not 15 major releases) |
| `styled-components` | 6.1.19 | 6.3.11 | Minor |
| `react`/`react-dom` | 19.2.3 | 19.2.4 | Patch |

**Will the Sanity 5.12→5.16 update break anything?**

**No.** This studio has minimal risk because:
- Only standard plugins (`structureTool`, `visionTool`) with zero customization
- All 4 schema types use only standard field types via `defineType`/`defineField`
- No custom studio components, no custom input components, no custom tools
- Sanity follows strict semver — breaking changes only in major versions

Changes in the 5.13–5.16 range:
- 5.13: Portable text editor toolbar improvements (no schema API changes)
- 5.14: Document store performance improvements (no public API changes)
- 5.15: Form builder internals refactored (only affects custom components — we have none)
- 5.16: Version number realignment for `@sanity/vision`

**Verify:**
- `cd sanity/appalachian-cryptid && npm run dev` — studio loads at localhost:3333, all 4 schema types in sidebar, can edit a document, Vision tab works
- `npm run build` — studio bundle compiles
- Back in root: `npm run dev` — confirm Next.js app still fetches Sanity data correctly
- Optional: `npm run deploy` to push updated studio to appalachian-cryptid.sanity.studio

---

## Track B: Defer (Major Version Bumps)

| Upgrade | Why Defer |
|---|---|
| **Next.js 15→16** | Major release; App Router data fetching patterns need verification against changelog. No security urgency. Wait for a few patch releases. |
| **React 18→19 (root)** | Meaningful migration — ref callback changes, potential shadcn/ui peer dep issues, `@types/react` 18→19 type breaks. Studio already runs React 19 independently; no conflict. |
| **Tailwind 3→4** | Most invasive change — config system completely rewritten (CSS-based), `tailwind-merge` 2.x incompatible, `@tailwindcss/typography` integration changes. Half-day+ migration. |
| **lucide-react 0.462→0.577** | Brand icons (`Twitter`, `Facebook`) removed ~0.470. Will cause build errors. Needs component work to replace icons first. |
| **ESLint 9→10** | Very recent release; wait for ecosystem tooling. |
| **@sanity/eslint-config-studio 5→6** | Outside semver range; requires explicit install. No urgency. |
| **@types/node 22→25** | Can break API route types. `npm update` correctly stays within 22.x. |

---

## Execution Order

```
1. npm audit fix                          (root — fixes flatted)
2. cd sanity/appalachian-cryptid
   npm audit fix                          (studio — fixes flatted, tar, undici, dompurify)
3. cd ../..
   npm update                             (root — all safe semver bumps)
4. npm run build && npm run lint          (root verification)
5. npm run dev                            (root smoke test)
6. cd sanity/appalachian-cryptid
   npm update                             (studio — sanity 5.16, vision 5.16, etc.)
7. npm run dev                            (studio verification at localhost:3333)
8. npm run build                          (studio build verification)
9. cd ../..
   npm run dev                            (final cross-check: Next.js app + Sanity data)
```

## Files Modified

- `package-lock.json` (root) — updated by npm audit fix + npm update
- `sanity/appalachian-cryptid/package-lock.json` — updated by npm audit fix + npm update
- No source code changes required for Track A
