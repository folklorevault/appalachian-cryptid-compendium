#!/usr/bin/env node
/**
 * Build-time SEO data generator
 *
 * Fetches all cryptids and anomalies from Sanity, generates per-path
 * SEO metadata, and writes it to public/seo-data.json.
 *
 * The Cloudflare Pages middleware reads this file at the edge and injects
 * the correct <title>, <meta>, and OG tags into the HTML before it
 * reaches crawlers — fixing the "every page has the same metadata" SPA problem.
 */

const PROJECT_ID = process.env.VITE_SANITY_PROJECT_ID || '8thljucm';
const DATASET = process.env.VITE_SANITY_DATASET || 'production';
const API_VERSION = '2024-01-01';

const SANITY_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`;
const IMAGE_CDN = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}`;

const BASE_URL = 'https://appalachiancryptid.com';
const SITE_NAME = 'Appalachian Cryptids List';

// ── Sanity image ref → CDN URL ──────────────────────────────────────
function sanityImageUrl(imageRef, width = 1200, height = 630) {
  if (!imageRef?.asset?._ref) return `${BASE_URL}/og-image.jpg`;
  // _ref format: "image-<id>-<WxH>-<ext>"
  const ref = imageRef.asset._ref;
  const [, id, dimensions, ext] = ref.split('-');
  return `${IMAGE_CDN}/${id}-${dimensions}.${ext}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
}

// ── Helpers ─────────────────────────────────────────────────────────
function truncate(str, max) {
  if (!str) return '';
  const cleaned = str.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= max) return cleaned;
  return cleaned.slice(0, max - 1).trimEnd() + '\u2026';
}

function buildTitle(name, location, suffix) {
  const full = `${name} - ${location} | ${suffix}`;
  if (full.length <= 60) return full;
  const shorter = `${name} | ${suffix}`;
  if (shorter.length <= 60) return shorter;
  return truncate(name, 60);
}

// ── Fetch from Sanity ───────────────────────────────────────────────
async function sanityFetch(query) {
  const url = `${SANITY_URL}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status} ${res.statusText}`);
  const json = await res.json();
  return json.result;
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log('Generating SEO data from Sanity...');

  const seoData = {};

  // ── Static pages ────────────────────────────────────────────────
  seoData['/'] = {
    title: 'Appalachian Cryptids List | Field Guide to Creatures of the Mountains',
    description: 'A field guide to the creatures that haunt the ridgelines, backroads, and hollers of the Appalachian Mountains and American South.',
    type: 'website',
  };

  seoData['/anomalies'] = {
    title: 'Anomalies Desk | Appalachian Cryptids List',
    description: 'Lights, hauntings, curses, and other unresolved Appalachian incidents, cataloged like field reports.',
    type: 'website',
  };

  seoData['/about'] = {
    title: 'About the Bureau | Appalachian Cryptids List',
    description: 'Operational mandate and archival protocols for documenting unexplained phenomena in the Appalachian region.',
    type: 'website',
  };

  seoData['/map'] = {
    title: 'Sighting Map | Appalachian Cryptids List',
    description: 'Interactive map of cryptid sightings across Appalachia and the American South. Explore reported encounters with Mothman, Wampus Cat, and other creatures.',
    type: 'website',
  };

  seoData['/report'] = {
    title: 'Report a Sighting | Appalachian Cryptids List',
    description: 'Submit your cryptid sighting report to the Appalachian Cryptid Field Guide. Help document unexplained encounters across Appalachia.',
    type: 'website',
  };

  // ── Cryptids from Sanity ────────────────────────────────────────
  try {
    const cryptids = await sanityFetch(`*[_type == "cryptid"] | order(name asc) {
      name, subhead, slug, location, description, image
    }`);

    console.log(`  Found ${cryptids.length} cryptids`);

    for (const c of cryptids) {
      const slug = c.slug?.current;
      if (!slug) continue;

      const path = `/cryptid/${slug}`;
      // Match what useSEO produces in CryptidDetail.tsx:
      // title: `${name} - ${location} Cryptid`  →  displayed as "${title} | Appalachian Cryptids List"
      const title = buildTitle(c.name, `${c.location} Cryptid`, SITE_NAME);
      const descRaw = c.subhead || c.description || `Learn about the ${c.name}`;
      const description = truncate(`${descRaw} Sightings reported near ${c.location}. Part of the Appalachian Cryptid Field Guide.`, 155);

      seoData[path] = {
        title,
        description,
        image: sanityImageUrl(c.image),
        type: 'article',
      };
    }
  } catch (err) {
    console.warn('  Warning: Could not fetch cryptids from Sanity:', err.message);
    console.warn('  Cryptid SEO data will be skipped (static pages still generated)');
  }

  // ── Anomalies from Sanity ───────────────────────────────────────
  try {
    const anomalies = await sanityFetch(`*[_type == "anomaly"] | order(name asc) {
      name, subhead, slug, location, description, image
    }`);

    console.log(`  Found ${anomalies.length} anomalies`);

    for (const a of anomalies) {
      const slug = a.slug?.current;
      if (!slug) continue;

      const path = `/anomaly/${slug}`;
      // Match AnomalyDetail.tsx: title: `${name} - ${location} | Anomalies Desk`
      const title = buildTitle(a.name, `${a.location} | Anomalies Desk`, SITE_NAME);
      const descRaw = a.subhead || a.description || `Learn about ${a.name}`;
      const description = truncate(`${descRaw} Reported near ${a.location}. Part of the Anomalies Desk.`, 155);

      seoData[path] = {
        title,
        description,
        image: sanityImageUrl(a.image),
        type: 'article',
      };
    }
  } catch (err) {
    console.warn('  Warning: Could not fetch anomalies from Sanity:', err.message);
    console.warn('  Anomaly SEO data will be skipped (static pages still generated)');
  }

  // ── Write output ────────────────────────────────────────────────
  const { writeFileSync } = await import('node:fs');
  const { resolve, dirname } = await import('node:path');
  const { fileURLToPath } = await import('node:url');

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outPath = resolve(__dirname, '..', 'public', 'seo-data.json');

  writeFileSync(outPath, JSON.stringify(seoData, null, 2));
  console.log(`  Written ${Object.keys(seoData).length} entries to public/seo-data.json`);
}

main().catch((err) => {
  console.error('SEO data generation failed:', err);
  // Don't fail the build — the site works without SEO data
  process.exit(0);
});
