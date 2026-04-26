---
name: deploy-check
description: Pre-deployment checklist — runs lint, build, and checks for common issues before deploying to Vercel.
disable-model-invocation: true
---

# Deploy Check

Run a pre-deployment checklist to catch issues before they hit Vercel.

## Usage

`/deploy-check`

## Checklist

Run each check sequentially. Stop and report if any critical check fails.

### 1. Lint

```bash
npm run lint
```

If there are errors (not warnings), report them and stop.

### 2. TypeScript type check

```bash
npx tsc --noEmit
```

Report any type errors found.

### 3. Production build

```bash
npm run build
```

This is the most important check — it catches:
- Broken imports
- SSG/ISR errors
- Missing environment variables referenced at build time
- Invalid metadata exports

If the build fails, report the error and suggest a fix.

### 4. Environment variable check

Verify that required env vars are referenced correctly:

```bash
# Check that NEXT_PUBLIC_ vars are used client-side and server vars are server-only
grep -r "process.env.SANITY_API_TOKEN" src/app --include="*.tsx" --include="*.ts" -l
grep -r "process.env.SANITY_WEBHOOK_SECRET" src/app --include="*.tsx" --include="*.ts" -l
grep -r "process.env.LOOPS_API_KEY" src/app --include="*.tsx" --include="*.ts" -l
```

Server-only vars (`SANITY_API_TOKEN`, `SANITY_WEBHOOK_SECRET`, `LOOPS_API_KEY`) should only appear in:
- `src/app/api/` route handlers
- Server Components (not files with `"use client"`)

Flag if any server secrets are referenced in client components.

### 5. Security headers check

Verify CSP in `next.config.ts` hasn't been accidentally loosened:
- No `unsafe-eval` in production script-src
- No wildcard `*` in connect-src or img-src
- `frame-ancestors 'none'` is still present

### 6. Report

Summarize results:
- **Pass**: All checks passed, safe to deploy
- **Warnings**: Non-blocking issues found (list them)
- **Fail**: Blocking issues found (list them with fixes)
