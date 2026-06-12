# Appalachian Cryptid Compendium

A field guide to Appalachian cryptids, styled as a forgotten government bureau's archive.

🌐 **Live site:** [appalachiancryptid.com](https://appalachiancryptid.com)
📖 **Sanity Studio:** [appalachian-cryptid.sanity.studio](https://appalachian-cryptid.sanity.studio)

![Appalachian Cryptid Compendium](public/og-image.jpg)

> Ranks #3 organically on Google for "appalachian cryptid," "appalachian cryptids list," and "appalachian dogman" — plus top-10 results on a dozen-plus related terms. Built, designed, written, and operated solo.

## What this is

A Next.js site cataloging the cryptids, anomalies, and unexplained phenomena of Appalachia — Mothman, the Flatwoods Monster, Sheepsquatch, and dozens of lesser-known regional sightings — presented as if you'd stumbled onto a half-declassified field manual from a defunct federal bureau. The chrome (manila tabs, ruled labels, typewriter bulletins) is part of the storytelling; the content is original writing and research.

Beyond the directory, the site has:

- **Bureau bulletins** — long-form articles on regional folklore.
- **Sighting map** — interactive Mapbox map of recorded sightings.
- **Public report form** — visitors can submit their own cryptid encounters (stored in Sanity, reviewed before publishing).

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui, self-hosted display fonts (Work Sans, Rokkitt, Special Elite)
- **CMS:** Sanity (project `8thljucm`, deployed studio)
- **Map:** Mapbox GL JS
- **Hosting:** Vercel
- **Tooling:** pnpm 11 + mise (pinned Node 24)
- **Form protection:** Vercel BotID
- **Analytics:** [Rybbit](https://rybbit.io) (self-hosted)
- **Dependency management:** Renovate with a 3-day `minimumReleaseAge` supply-chain policy

## Architecture highlights

- **Dual data mode.** Server fetchers in [`src/lib/sanity/fetchers.ts`](src/lib/sanity/fetchers.ts) try Sanity first and fall back to static data in [`src/data/`](src/data/). This means the site keeps working in dev without Sanity credentials, and content authors can edit in the CMS without a redeploy.
- **Tag-based ISR.** Every fetch sets a `next: { tags: [...] }` cache tag. A Sanity webhook hits [`/api/revalidate`](src/app/api/revalidate/route.ts) on content changes and calls `revalidateTag()` for just the affected slugs — no full rebuild needed.
- **SSG for detail pages.** Cryptid, anomaly, and bulletin pages use `generateStaticParams` + `generateMetadata` for fast loads and per-page SEO.
- **Mapbox SSR escape hatch.** Mapbox v3's pre-built worker bundle breaks under Turbopack's module processing, so production builds use webpack with `config.module.noParse` for the mapbox-gl bundle (see [`next.config.ts`](next.config.ts)).
- **CSP-managed security headers.** All security headers, including a strict Content Security Policy, are defined in [`next.config.ts`](next.config.ts).

## Running it locally

This project uses [mise](https://mise.jdx.dev) to pin Node 24 + pnpm 11 and drive tasks.

```bash
# 1. Install pinned toolchain (one-time on fresh checkout)
mise install

# 2. Install dependencies
pnpm install

# 3. Copy env template and fill in (Mapbox token required; Sanity optional — falls back to static data)
cp .env.example .env.local

# 4. Start dev server at http://localhost:3000
mise dev
```

Useful tasks:

```bash
mise build              # Production build
mise typecheck          # tsc --noEmit
mise lint               # ESLint
mise studio:dev         # Run Sanity studio locally
mise studio:deploy      # Deploy Sanity studio
mise borders:generate   # Re-run Appalachian state-borders generator
mise tasks ls           # List all tasks
```

See [`CLAUDE.md`](CLAUDE.md) for a deeper architecture tour aimed at AI assistants and human contributors alike.

## Project history

This started in late 2025 as a Lovable.dev (`gpt-engineer-app[bot]`) Vite + React scaffold and grew from there:

1. **Vite era** — UI built out via Lovable, content modeled as static TypeScript.
2. **Next.js migration** — moved to Next.js App Router for SSG, SEO control, and a real server runtime for the sighting-report API.
3. **Sanity integration** — added a deployed studio with on-demand ISR so content edits go live without a deploy.
4. **Tooling cleanup** — npm → pnpm 11, pinned the toolchain with mise, added Renovate with a supply-chain release-age policy after a pnpm/Vercel install-time mismatch caused a deploy outage.

The `gpt-engineer-app[bot]` and `renovate[bot]` commits in `git log` are a real part of that history; I've kept them rather than rewriting.

## Content

The cryptid lore, bureau bulletin copy, and field-guide framing are all original writing by [Katy Welborn](mailto:katy@purpleglittermuse.net). Static seed data lives in [`src/data/`](src/data/); the authoritative source for published content is the Sanity dataset.

## Security

See [`SECURITY.md`](SECURITY.md) for the disclosure policy.

## License

[MIT](LICENSE) — see the license file for the full text. The cryptid lore and original writing are released under the same terms as the code; if you reuse the content, an attribution link back to this repo or [appalachiancryptid.com](https://appalachiancryptid.com) is appreciated.
