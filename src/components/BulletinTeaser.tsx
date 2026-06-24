import Link from "next/link";
import type { SanityBulletinListItem, BulletinCategory } from "@/types/sanity";
import { formatLedgerDate } from "@/lib/utils";

const CATEGORIES: Record<
  BulletinCategory,
  { abbr: string; cssVar: string }
> = {
  "field-terminology": {
    abbr: "FLD-TERM",
    cssVar: "--bulletin-field-terminology",
  },
  "regional-analysis": {
    abbr: "REG-ANLS",
    cssVar: "--bulletin-regional-analysis",
  },
  "cultural-brief": {
    abbr: "CULT-BRF",
    cssVar: "--bulletin-cultural-brief",
  },
  "operational-notice": {
    abbr: "OPS-NTCE",
    cssVar: "--bulletin-operational-notice",
  },
};

function CategoryTag({ category }: { category: BulletinCategory }) {
  const cat = CATEGORIES[category];
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

interface BulletinTeaserProps {
  bulletins: SanityBulletinListItem[];
}

export function BulletinTeaser({ bulletins }: BulletinTeaserProps) {
  const items = bulletins.slice(0, 3);

  return (
    <div className="bg-card border-2 border-foreground/70 rounded-sm overflow-hidden h-full flex flex-col shadow-[2px_2px_0_hsl(var(--foreground)/0.15)]">
      {/* Catalog tab */}
      <div className="bg-bureau-manila border-b-2 border-foreground/70 px-4 py-1.5 flex items-baseline justify-between gap-3">
        <span className="font-typewriter text-[10px] tracking-eyebrow uppercase text-bureau-ink">
          Bulletin Index
        </span>
        <span className="font-typewriter text-[10px] tracking-label uppercase text-bureau-ink-muted">
          Recent Dispatches
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-4 pt-2 pb-3">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-typewriter text-xs text-muted-foreground uppercase tracking-widest">
              No bulletins on file
            </p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-dotted divide-foreground/30 border-t border-dotted border-foreground/30">
            {items.map((bulletin) => (
              <li key={bulletin._id}>
                <Link
                  href={`/bulletin/${bulletin.slug.current}`}
                  className="group block py-2.5"
                >
                  {/* Meta row */}
                  <div className="flex items-baseline gap-2 mb-1 font-typewriter text-[10px] tracking-[0.05em] text-bureau-ink-muted">
                    <span className="font-bold text-bureau-ink">
                      {bulletin.bulletinNumber}
                    </span>
                    <span className="text-foreground/30">·</span>
                    <span>Filed {formatLedgerDate(bulletin.date)}</span>
                    <span className="ml-auto">
                      <CategoryTag category={bulletin.category} />
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-[15px] leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {bulletin.title}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-foreground/40 text-right">
          <Link
            href="/bulletins"
            className="font-typewriter text-xs text-primary tracking-wider hover:underline"
          >
            All Bulletins →
          </Link>
        </div>
      </div>
    </div>
  );
}
