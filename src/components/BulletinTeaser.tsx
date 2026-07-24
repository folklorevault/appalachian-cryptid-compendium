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
  return (
    <span
      className="font-typewriter font-bold uppercase tracking-[0.14em] text-[10px] shrink-0"
      style={{ color: `hsl(var(${cat.cssVar}))` }}
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
    <div className="h-full rotate-[0.4deg]">
      <div className="memo-paper memo-flat relative h-full flex flex-col border border-border/60 rounded-[2px] pt-5 pb-4 pl-10 pr-[22px]">
        {/* Hole punches along the left edge */}
        <div className="hole-punch" style={{ top: "26px" }} aria-hidden="true" />
        <div
          className="hole-punch"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          aria-hidden="true"
        />
        <div className="hole-punch" style={{ bottom: "26px" }} aria-hidden="true" />

        {/* Form reference */}
        <div
          className="memo-form-ref absolute top-2.5 right-3.5 text-right"
          aria-hidden="true"
        >
          Index No. ACB-B
          <br />
          Rev. 03/1974
        </div>

        {/* Letterhead */}
        <div className="memo-header relative z-[2]">
          <div className="memo-letterhead max-w-[56%] mx-auto pt-3.5" aria-hidden="true">
            Appalachian Cryptid Division
            <br />
            Department of Unexplained Phenomena
          </div>
          <div className="memo-title mt-3 mb-0">
            Bulletin Index — Recent Dispatches
          </div>
        </div>

        {/* Body */}
        <div className="relative z-[2] flex-1 flex flex-col">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="font-typewriter text-xs text-muted-foreground uppercase tracking-widest">
                No bulletins on file
              </p>
            </div>
          ) : (
            <ul className="flex-1 divide-y divide-dotted divide-foreground/25">
              {items.map((bulletin) => (
                <li key={bulletin._id}>
                  <Link
                    href={`/bulletin/${bulletin.slug.current}`}
                    className="group block py-2.5 px-0.5"
                  >
                    {/* Meta row */}
                    <div className="flex items-baseline gap-2 mb-1 font-typewriter text-[10px] tracking-type text-bureau-ink-muted dark:text-muted-foreground">
                      <span className="font-bold text-bureau-ink dark:text-foreground">
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
          <div className="mt-3 pt-2 border-t border-dashed border-foreground/25 flex items-baseline justify-between gap-3">
            <span className="memo-footer" aria-hidden="true">
              For Official Use Only
            </span>
            <Link
              href="/bulletins"
              className="font-typewriter text-xs text-primary tracking-type border-b border-dotted border-primary/60 hover:border-solid"
            >
              All Bulletins →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
