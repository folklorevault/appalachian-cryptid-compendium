"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { SanitySighting } from "@/types/sanity";
import { formatSightingDate } from "@/lib/utils";
import { SightingMap } from "@/components/SightingMap";

/**
 * Always-visible chronological list of a cryptid's structured sightings, paired
 * with an interactive map. The list and the map share one `selectedKey`, so
 * clicking a record flies the map to its pin and clicking a pin highlights the
 * record — the records ARE the map's side panel (no duplicated detail card).
 *
 * A client component, but its record markup is still server-rendered on first
 * load (App Router SSR), so the "[name] sightings" text stays indexable; only
 * the mapbox-gl bundle is deferred (see SightingMap).
 */
export function SightingDistribution({
  cryptidName,
  sightings,
}: {
  cryptidName: string;
  sightings?: SanitySighting[];
}) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const recordRefs = useRef<Record<string, HTMLLIElement | null>>({});

  // Chronological; undated records sink to the end but still list.
  const ordered = useMemo(() => {
    if (!sightings) return [];
    return [...sightings].sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
  }, [sightings]);

  // Record numbers keyed by _key, shared between the list and the map pins.
  const numberByKey = useMemo(() => {
    const map: Record<string, number> = {};
    ordered.forEach((s, i) => (map[s._key] = i + 1));
    return map;
  }, [ordered]);

  const mappable = useMemo(
    () => ordered.filter((s) => s.coordinates),
    [ordered]
  );

  // When selection changes, bring the active record into view (minimally).
  useEffect(() => {
    if (!selectedKey) return;
    recordRefs.current[selectedKey]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selectedKey]);

  if (ordered.length === 0) return null;

  const hasMap = mappable.length > 0;

  const recordList = (
    <ol className="divide-y divide-dashed divide-bureau-border/30 lg:h-full lg:overflow-y-auto">
      {ordered.map((s) => {
        const date = formatSightingDate(s.date);
        const num = String(numberByKey[s._key]).padStart(2, "0");
        const active = s._key === selectedKey;
        return (
          <li
            key={s._key}
            ref={(el) => {
              recordRefs.current[s._key] = el;
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedKey(s._key)}
              aria-pressed={active}
              className={`block w-full cursor-pointer px-5 py-4 text-left transition-colors ${
                active
                  ? "bg-bureau-manila/60 ring-1 ring-inset ring-primary/60"
                  : "hover:bg-bureau-manila/30"
              }`}
            >
              <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-typewriter text-[0.7rem] tracking-eyebrow uppercase text-bureau-ink-muted tabular-nums">
                  No. {num}
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
            </button>
          </li>
        );
      })}
    </ol>
  );

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
            {`${ordered.length} Logged ${
              ordered.length === 1 ? "Record" : "Records"
            }`}
          </span>
        </div>

        {/* Body — records + map share one selection */}
        <div className="bg-bureau-paper shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]">
          {hasMap ? (
            <div className="grid gap-4 p-4 lg:h-[460px] lg:grid-cols-[1fr_minmax(300px,46%)]">
              <div className="min-w-0 overflow-hidden rounded-sm border border-dashed border-bureau-border/30 bg-bureau-paper lg:min-h-0">
                {recordList}
              </div>
              <div className="min-h-[320px] lg:min-h-0">
                <SightingMap
                  sightings={mappable}
                  numberByKey={numberByKey}
                  selectedKey={selectedKey}
                  onSelect={setSelectedKey}
                />
              </div>
            </div>
          ) : (
            recordList
          )}

          {/* Footer — cross-link to the site-wide map */}
          {hasMap && (
            <div className="flex items-center justify-between gap-3 border-t border-dashed border-bureau-border/40 px-5 py-2.5">
              <span className="font-typewriter text-[0.65rem] tracking-eyebrow uppercase text-bureau-ink-muted">
                {mappable.length} of {ordered.length} plotted
              </span>
              <Link
                href="/map"
                className="inline-flex items-center gap-1 font-typewriter text-xs uppercase tracking-wider text-primary hover:underline"
              >
                View full Sightings Map
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
