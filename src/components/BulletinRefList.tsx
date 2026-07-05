import Link from "next/link";
import type { SanityBulletinListItem, BulletinCategory } from "@/types/sanity";
import { BULLETIN_CATEGORIES } from "@/lib/bulletins";
import { formatLedgerDate } from "@/lib/utils";

function CategoryTag({ category }: { category: BulletinCategory }) {
  const cat = BULLETIN_CATEGORIES[category];
  const color = `hsl(var(${cat.cssVar}))`;
  return (
    <span
      className="inline-block px-1.5 py-0.5 border font-typewriter font-bold uppercase tracking-widest text-[9px] shrink-0"
      style={{ color, borderColor: color }}
    >
      {cat.abbr}
    </span>
  );
}

/**
 * A titled, dotted-rule list of bulletin links in the Bureau ledger style.
 * Reused for reciprocal internal linking:
 *  - "Referenced in Bureau Bulletins" on cryptid / anomaly detail pages
 *  - "Related Bulletins" on bulletin detail pages
 * The bulletin title is the link anchor (descriptive anchor text for SEO).
 * Renders nothing when there are no bulletins to show.
 */
export function BulletinRefList({
  heading,
  bulletins,
}: {
  heading: string;
  bulletins: SanityBulletinListItem[];
}) {
  if (!bulletins || bulletins.length === 0) return null;

  return (
    <div className="mb-8 border-t border-border pt-8">
      <h2 className="text-xl font-bold text-foreground font-display mb-4">
        {heading}
      </h2>
      <ul className="max-w-2xl divide-y divide-dotted divide-foreground/30 border-t border-dotted border-foreground/30">
        {bulletins.map((bulletin) => (
          <li key={bulletin._id}>
            <Link
              href={`/bulletin/${bulletin.slug.current}`}
              className="group block py-2.5 no-underline"
            >
              {/* Meta row */}
              <div className="flex items-baseline gap-2 mb-1 font-typewriter text-[10px] tracking-type text-bureau-ink-muted">
                <span className="font-bold text-bureau-ink">
                  {bulletin.bulletinNumber}
                </span>
                <span className="text-foreground/30">·</span>
                <span>Filed {formatLedgerDate(bulletin.date)}</span>
                <span className="ml-auto">
                  <CategoryTag category={bulletin.category} />
                </span>
              </div>

              {/* Title — the anchor text */}
              <h3 className="font-display font-bold text-[15px] leading-snug text-foreground group-hover:text-primary transition-colors">
                {bulletin.title}
              </h3>

              {bulletin.summary && (
                <p className="font-sans text-sm text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
                  {bulletin.summary}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
