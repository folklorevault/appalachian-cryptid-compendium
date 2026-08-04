"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { SanitySighting } from "@/types/sanity";
import { formatSightingDate } from "@/lib/utils";
import { SightingMap } from "@/components/SightingMap";

const COMPACT_LAYOUT_QUERY = "(max-width: 63.999rem)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Always-visible chronological list of a cryptid's structured sightings, paired
 * with an interactive map. The list and the map share one `selectedKey`, so
 * clicking a record flies the map to its pin and clicking a pin highlights the
 * record. Desktop keeps the chronological side panel; compact layouts use the
 * numbered index to reveal one record at a time without reserving the height of
 * the longest account.
 *
 * A client component, but its record markup is still server-rendered on first
 * load (App Router SSR), so the "[name] sightings" text stays indexable; only
 * the mapbox-gl bundle is deferred (see SightingMap).
 */
export function SightingDistribution({
  cryptidName,
  sightings,
  showMap = true,
}: {
  cryptidName: string;
  sightings?: SanitySighting[];
  /**
   * When false, renders the record list only and never mounts the embedded
   * map (so mapbox-gl is never loaded). Used by anomaly pages, whose geo lives
   * solely as pins on /map.
   */
  showMap?: boolean;
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

  // Keep the selected record visible without moving the entire page away from
  // the sticky map on compact layouts.
  useEffect(() => {
    if (!selectedKey) return;
    const record = recordRefs.current[selectedKey];
    if (!record) return;

    const behavior = window.matchMedia(REDUCED_MOTION_QUERY).matches
      ? "auto"
      : "smooth";
    if (window.matchMedia(COMPACT_LAYOUT_QUERY).matches) {
      return;
    }

    record.scrollIntoView({
      behavior,
      block: "nearest",
    });
  }, [selectedKey]);

  if (ordered.length === 0) return null;

  const hasMap = showMap && mappable.length > 0;
  const selectedSighting = selectedKey
    ? ordered.find((sighting) => sighting._key === selectedKey)
    : null;
  const compactVisibleKey = selectedKey ?? ordered[0]._key;

  const recordList = (
    <ol className="lg:block lg:h-full lg:overflow-y-auto lg:divide-y lg:divide-dashed lg:divide-bureau-border/30">
      {ordered.map((s) => {
        const date = formatSightingDate(s.date);
        const num = String(numberByKey[s._key]).padStart(2, "0");
        const active = s._key === selectedKey;
        const visibleOnCompact = s._key === compactVisibleKey;
        return (
          <li
            key={s._key}
            className={visibleOnCompact ? "block" : "hidden lg:block"}
            ref={(el) => {
              recordRefs.current[s._key] = el;
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedKey(s._key)}
              aria-pressed={active}
              className={`block w-full cursor-pointer p-0 text-left transition-colors lg:h-full ${
                active
                  ? "bg-bureau-manila/60 ring-1 ring-inset ring-primary/60"
                  : "hover:bg-bureau-manila/30"
              }`}
            >
              <div
                className={`border-b border-dashed border-bureau-border/50 px-4 py-3 lg:px-5 ${
                  active
                    ? "bg-bureau-manila/80"
                    : "bg-bureau-manila-light/50"
                }`}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-typewriter text-xs tracking-eyebrow uppercase text-bureau-ink-muted tabular-nums">
                    No. {num}
                  </span>
                  {date && (
                    <span className="font-display font-bold text-foreground">
                      {date}
                    </span>
                  )}
                </div>
                <p className="mt-1 inline-flex items-start gap-1.5 text-sm text-bureau-ink">
                  <MapPin
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>{s.location}</span>
                </p>
                {s.witness && (
                  <p className="mt-1 text-sm text-bureau-ink">
                    <span className="font-typewriter text-xs uppercase tracking-wider text-muted-foreground">
                      Witness:
                    </span>{" "}
                    {s.witness}
                  </p>
                )}
              </div>
              {(s.account || s.source) && (
                <div className="space-y-2 px-4 py-3 lg:px-5">
                  {s.account && (
                    <p className="text-base leading-relaxed text-bureau-ink">
                      {s.account}
                    </p>
                  )}
                  {s.source && (
                    <p className="text-xs italic text-bureau-ink-muted">
                      Source: {s.source}
                    </p>
                  )}
                </div>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );

  return (
    <section aria-labelledby="sightings-heading" className="mb-10">
      <div className="relative rounded-sm border-2 border-bureau-border/60 bg-bureau-manila-light shadow-[0_1px_2px_hsl(var(--bureau-ink)/0.06),0_1px_3px_hsl(var(--bureau-ink)/0.1)]">
        {/* Header strip — matches the File Abstract / Case File Section chrome */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-2.5 border-b-2 border-bureau-border/40 bg-bureau-manila">
          <h2
            id="sightings-heading"
            className="scroll-mt-20 font-display text-lg font-bold text-foreground leading-tight"
          >
            {`${cryptidName} Sightings`}
          </h2>
          <span
            className="flex-1 min-w-4 border-t border-dashed border-bureau-border/40"
            aria-hidden="true"
          />
          <span className="font-typewriter text-xs tracking-eyebrow uppercase text-bureau-ink-muted">
            {`${ordered.length} Logged ${
              ordered.length === 1 ? "Record" : "Records"
            }`}
          </span>
        </div>

        {/* Body — records + map share one selection */}
        <div className="bg-bureau-paper shadow-[inset_0_2px_4px_hsl(var(--bureau-ink)/0.04)]">
          {hasMap ? (
            <div className="grid gap-4 p-4 lg:h-[460px] lg:grid-cols-[1fr_minmax(300px,46%)]">
              <div className="order-2 min-w-0 overflow-hidden rounded-sm border border-dashed border-bureau-border/30 bg-bureau-paper lg:order-1 lg:min-h-0">
                <div className="border-b border-dashed border-bureau-border/40 p-1.5 lg:hidden">
                  <p className="mb-1 font-typewriter text-xs uppercase tracking-eyebrow text-bureau-ink-muted">
                    Choose a numbered record
                  </p>
                  <div
                    className="scrollbar-hidden flex gap-2 overflow-x-auto pb-1"
                    role="group"
                    aria-label="Select a sighting record"
                  >
                    {ordered.map((sighting) => {
                      const active = sighting._key === selectedKey;
                      const num = String(
                        numberByKey[sighting._key]
                      ).padStart(2, "0");
                      return (
                        <button
                          key={sighting._key}
                          type="button"
                          onClick={() => setSelectedKey(sighting._key)}
                          aria-pressed={active}
                          aria-label={`Record ${num}: ${sighting.location}`}
                          className={`size-11 shrink-0 rounded-sm border font-typewriter text-xs font-bold transition-colors ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-bureau-border bg-bureau-manila-light text-bureau-ink hover:border-primary hover:text-primary"
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {recordList}
              </div>
              <div className="sticky top-20 z-20 order-1 min-h-64 self-start bg-bureau-paper lg:static lg:z-auto lg:order-2 lg:min-h-0">
                <SightingMap
                  sightings={mappable}
                  numberByKey={numberByKey}
                  selectedKey={selectedKey}
                  onSelect={setSelectedKey}
                />
              </div>
              <p className="sr-only" role="status" aria-live="polite">
                {selectedSighting
                  ? `${selectedSighting.location} selected.${
                      selectedSighting.coordinates
                        ? " The map has centered on this sighting."
                        : " No coordinates are recorded for this sighting."
                    }`
                  : "No sighting selected."}
              </p>
            </div>
          ) : (
            recordList
          )}

          {/* Footer — cross-link to the site-wide map */}
          {hasMap && (
            <div className="flex items-center justify-between gap-3 border-t border-dashed border-bureau-border/40 px-5 py-2.5">
              <span className="font-typewriter text-xs tracking-eyebrow uppercase text-bureau-ink-muted">
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
