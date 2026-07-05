import type { BulletinCategory, SanityBulletinListItem } from "@/types/sanity";

// Shared category metadata for bulletins. Single source of truth for the
// label, ledger abbreviation, and the CSS color variable each category maps to.
export const BULLETIN_CATEGORIES: Record<
  BulletinCategory,
  { label: string; abbr: string; cssVar: string }
> = {
  "field-terminology": {
    label: "Field Terminology",
    abbr: "FLD-TERM",
    cssVar: "--bulletin-field-terminology",
  },
  "regional-analysis": {
    label: "Regional Analysis",
    abbr: "REG-ANLS",
    cssVar: "--bulletin-regional-analysis",
  },
  "cultural-brief": {
    label: "Cultural Brief",
    abbr: "CULT-BRF",
    cssVar: "--bulletin-cultural-brief",
  },
  "operational-notice": {
    label: "Operational Notice",
    abbr: "OPS-NTCE",
    cssVar: "--bulletin-operational-notice",
  },
};

// The "State Files: <state>" bulletins share this slug prefix and form a series.
const STATE_FILE_PREFIX = "state-files-";

/**
 * Pick related bulletins for a given bulletin, automatically.
 * - "State Files" series bulletins relate to the other State Files.
 * - Otherwise, relate by shared category.
 * - Backfill with the most-recent remaining bulletins so the section is
 *   never a dead-end (important for crawlability / internal linking).
 *
 * `all` is expected newest-first (as fetchBulletins returns).
 */
export function pickRelatedBulletins(
  all: SanityBulletinListItem[],
  current: Pick<SanityBulletinListItem, "slug" | "category">,
  limit = 4
): SanityBulletinListItem[] {
  const currentSlug = current.slug.current;
  const pool = all.filter((b) => b.slug.current !== currentSlug);

  const isStateFile = currentSlug.startsWith(STATE_FILE_PREFIX);
  const primary = isStateFile
    ? pool.filter((b) => b.slug.current.startsWith(STATE_FILE_PREFIX))
    : pool.filter((b) => b.category === current.category);

  if (primary.length >= limit) return primary.slice(0, limit);

  // Backfill with the newest remaining bulletins not already included.
  const chosen = new Set(primary.map((b) => b._id));
  const backfill = pool.filter((b) => !chosen.has(b._id));
  return [...primary, ...backfill].slice(0, limit);
}
