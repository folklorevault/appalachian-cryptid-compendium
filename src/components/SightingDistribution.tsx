import { MapPin } from "lucide-react";
import type { SanitySighting } from "@/types/sanity";
import { formatSightingDate } from "@/lib/utils";

/**
 * Server-rendered, always-visible chronological list of structured sightings.
 * This is the SEO-bearing surface for "[name] sightings"; the interactive map
 * (Phase 4) slots in beneath the records, reading the same `sightings` array.
 */
export function SightingDistribution({
  cryptidName,
  sightings,
}: {
  cryptidName: string;
  sightings?: SanitySighting[];
}) {
  if (!sightings || sightings.length === 0) return null;

  // Chronological; undated records sink to the end but still list.
  const ordered = [...sightings].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });

  return (
    <section aria-labelledby="sightings-heading" className="mb-10">
      <div className="relative rounded-sm border-2 border-bureau-border/60 bg-bureau-manila-light shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.1)]">
        {/* Header strip — matches the File Abstract / Case File Section chrome */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-2.5 border-b-2 border-bureau-border/40 bg-bureau-manila">
          <h2
            id="sightings-heading"
            className="font-display text-lg font-bold text-foreground leading-tight"
          >
            {`${cryptidName} Sightings`}
          </h2>
          <span
            className="flex-1 min-w-4 border-t border-dashed border-bureau-border/40"
            aria-hidden="true"
          />
          <span className="font-typewriter text-[0.65rem] tracking-eyebrow uppercase text-bureau-ink-muted">
            {`${ordered.length} Logged ${ordered.length === 1 ? "Record" : "Records"}`}
          </span>
        </div>

        {/* Records */}
        <div className="bg-bureau-paper shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]">
          <ol className="divide-y divide-dashed divide-bureau-border/30">
            {ordered.map((s, i) => {
              const date = formatSightingDate(s.date);
              return (
                <li key={s._key} className="px-5 py-4">
                  <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-typewriter text-[0.7rem] tracking-eyebrow uppercase text-bureau-ink-muted tabular-nums">
                      No. {String(i + 1).padStart(2, "0")}
                    </span>
                    {date && (
                      <span className="font-display font-bold text-foreground">
                        {date}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-sm text-bureau-ink">
                      <MapPin
                        className="h-3.5 w-3.5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      {s.location}
                    </span>
                  </div>
                  {s.witness && (
                    <p className="mb-1 text-sm text-bureau-ink">
                      <span className="font-typewriter text-xs uppercase tracking-wider text-muted-foreground">
                        Witness:
                      </span>{" "}
                      {s.witness}
                    </p>
                  )}
                  {s.account && (
                    <p className="text-[0.95rem] leading-relaxed text-bureau-ink">
                      {s.account}
                    </p>
                  )}
                  {s.source && (
                    <p className="mt-1.5 text-xs italic text-bureau-ink-muted">
                      Source: {s.source}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
