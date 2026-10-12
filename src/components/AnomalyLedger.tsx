"use client";

import { useMemo, useState, useDeferredValue } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";
import type { AnomalyType, SanityAnomalyListItem } from "@/types/sanity";

export interface LedgerEntry {
  anomaly: SanityAnomalyListItem;
  /** Permanent-ish file number from creation order, e.g. "006". */
  fileNo: string;
}

// Short labels for the type tabs; the rows show the full type.
const TYPE_TAB_LABEL: Partial<Record<AnomalyType, string>> = {
  "Sounds/Calls": "Sounds",
  "Omen Events": "Omens",
  "Weather Oddities": "Weather",
  "Time Weirdness": "Time",
};

/** A few words for the ledger column: the short field, else the start of the long one. */
function ledgerDate(a: SanityAnomalyListItem): string {
  if (a.firstDocumentedShort) return a.firstDocumentedShort;
  const head = a.firstDocumented?.split(/\s\(|;|\.\s/)[0]?.trim() ?? "";
  return head.length > 36 ? `${head.slice(0, 34).trimEnd()}…` : head;
}

function typeLabel(t: AnomalyType) {
  return t.replace("/", " / ");
}

export function AnomalyLedger({ entries }: { entries: LedgerEntry[] }) {
  const [type, setType] = useState<AnomalyType | "all">("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const typeCounts = useMemo(() => {
    const counts = new Map<AnomalyType, number>();
    for (const { anomaly } of entries) {
      counts.set(anomaly.anomalyType, (counts.get(anomaly.anomalyType) ?? 0) + 1);
    }
    return [...counts.entries()].sort(
      ([aType, a], [bType, b]) => b - a || aType.localeCompare(bType)
    );
  }, [entries]);

  const visible = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return entries.filter(({ anomaly: a }) => {
      if (type !== "all" && a.anomalyType !== type) return false;
      if (!q) return true;
      return [a.name, a.location, a.subhead, a.description]
        .some((field) => field?.toLowerCase().includes(q));
    });
  }, [entries, type, deferredQuery]);

  const filtered = type !== "all" || query.trim() !== "";

  return (
    <div>
      {/* ── Controls ─────────────────────────────────────────── */}
      <div className="grid gap-4 py-5 border-y border-bureau-manila-light/20 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by type">
          <TypeTab pressed={type === "all"} onClick={() => setType("all")} label="All" count={entries.length} />
          {typeCounts.map(([t, n]) => (
            <TypeTab
              key={t}
              pressed={type === t}
              onClick={() => setType(t)}
              label={TYPE_TAB_LABEL[t] ?? t}
              count={n}
            />
          ))}
        </div>
        <label className="flex items-center gap-2 border-b border-bureau-manila-light/40 py-1.5 focus-within:border-bureau-rust-ink">
          <Search className="h-3.5 w-3.5 shrink-0 text-bureau-manila-light/70" aria-hidden="true" />
          <span className="sr-only">Search the anomalies</span>
          <input
            id="anomaly-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="a name, a county, a sound…"
            className="min-w-0 flex-1 bg-transparent font-typewriter text-sm tracking-type text-bureau-manila-light placeholder:text-bureau-manila-light/70 outline-none"
          />
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        {filtered ? `Showing ${visible.length} of ${entries.length} files` : ""}
      </p>

      {/* ── Column heads (desktop) ───────────────────────────── */}
      <div
        className="hidden lg:grid lg:grid-cols-[80px_minmax(0,1fr)_140px_160px_104px_64px] gap-5 pt-4 pb-2.5 border-b border-bureau-manila-light/30 font-typewriter text-tag tracking-label uppercase text-bureau-manila-light/70"
        aria-hidden="true"
      >
        <span>File</span>
        <span>Anomaly</span>
        <span>Type</span>
        <span>First documented</span>
        <span>Status</span>
        <span />
      </div>

      {visible.length === 0 ? (
        <div role="status" className="py-16 text-center">
          <p className="font-display font-bold text-2xl text-bureau-paper">
            Nothing on the desk matches{deferredQuery ? <> &ldquo;{deferredQuery}&rdquo;</> : " that filter"}.
          </p>
          <p className="mt-2 font-typewriter text-sm tracking-type text-bureau-manila-light/80">
            If nobody has written it down yet, you could be the first witness.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => {
                setType("all");
                setQuery("");
              }}
              className="font-typewriter text-sm tracking-type text-bureau-manila-light border-b border-dotted border-bureau-manila-light/70 hover:border-solid"
            >
              Clear the filters
            </button>
            <Link
              href="/report"
              className="font-typewriter text-sm tracking-type text-bureau-manila-light border-b border-dotted border-bureau-manila-light/70 hover:border-solid"
            >
              File a report
            </Link>
          </div>
        </div>
      ) : (
        <ol className="list-none">
          {visible.map((entry) => (
            <LedgerRow key={entry.anomaly._id} {...entry} />
          ))}
        </ol>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-x-7 gap-y-3 pt-7 pb-12 lg:pb-16">
        <p className="font-typewriter text-sm tracking-type text-bureau-manila-light/70">
          {filtered
            ? `${visible.length} of ${entries.length} files shown`
            : `End of ledger · ${entries.length} ${entries.length === 1 ? "file" : "files"}`}
        </p>
        <Link
          href="/report"
          className="font-typewriter text-sm tracking-type text-bureau-manila-light border-b border-dotted border-bureau-manila-light/70 hover:border-solid focus-visible:outline-bureau-rust-ink"
        >
          Witnessed something? File a report →
        </Link>
      </div>
    </div>
  );
}

function TypeTab({
  pressed,
  onClick,
  label,
  count,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex items-baseline gap-2 rounded-sm border px-3 py-1.5 font-typewriter text-xs tracking-type uppercase transition-colors duration-150 focus-visible:outline-bureau-rust-ink ${
        pressed
          ? "border-bureau-rust-ink bg-bureau-rust-ink/10 text-bureau-rust-ink"
          : "border-bureau-manila-light/30 text-bureau-manila-light/85 hover:border-bureau-manila-light/60 hover:text-bureau-manila-light"
      }`}
    >
      {label}
      <span className={`text-caption ${pressed ? "" : "text-bureau-rust-ink"}`}>{count}</span>
    </button>
  );
}

function LedgerRow({ anomaly: a, fileNo }: LedgerEntry) {
  const source = a.gridImage ?? a.image;
  const thumb = source
    ? urlFor(source).width(128).height(171).fit("crop").quality(60).url()
    : null;
  const date = ledgerDate(a);

  return (
    <li className="border-b border-bureau-manila-light/15">
      <Link
        href={`/anomaly/${a.slug.current}`}
        className="group grid grid-cols-[64px_minmax(0,1fr)] gap-x-4 gap-y-1 py-5.5 focus-visible:outline-bureau-rust-ink lg:grid-cols-[80px_minmax(0,1fr)_140px_160px_104px_64px] lg:items-center lg:gap-5"
      >
        <span className="row-span-2 font-display font-bold text-4xl leading-none text-bureau-rust tabular-nums lg:row-span-1 lg:text-5xl">
          <span className="block mb-1 font-typewriter font-normal text-tag tracking-label text-bureau-manila-light/70">
            AD
          </span>
          {fileNo}
        </span>

        <div className="min-w-0">
          <h2 className="font-display font-bold text-2xl leading-tight text-bureau-paper mb-1 transition-colors group-hover:text-bureau-rust">
            {a.name}
          </h2>
          {(a.subhead || a.description) && (
            <p className="font-sans text-sm leading-relaxed text-bureau-manila-light/80 line-clamp-2">
              {a.subhead || a.description}
            </p>
          )}
        </div>

        {/* Meta: one wrapped line under the name on small screens, own columns on desktop */}
        <div className="col-start-2 mt-2 flex flex-wrap items-center gap-x-4.5 gap-y-2 font-typewriter text-xs tracking-type lg:contents">
          <span className="uppercase text-bureau-rust-ink">{typeLabel(a.anomalyType)}</span>
          <span className="text-bureau-manila-light/85">
            {date && (
              <>
                <span className="lg:hidden text-bureau-manila-light/70">First documented: </span>
                {date}
              </>
            )}
          </span>
          <span className="text-bureau-manila-light/85">
            <span className="lg:hidden text-bureau-manila-light/70">Status: </span>
            {a.status}
          </span>
        </div>

        <span className="hidden lg:block w-16 aspect-3/4 border border-bureau-manila-light/30 p-0.5">
          <span className="relative block h-full w-full overflow-hidden bg-bureau-ink-dark">
            {thumb && (
              <Image
                src={thumb}
                alt=""
                fill
                sizes="64px"
                className="object-cover sepia-light transition-transform duration-300 motion-safe:group-hover:scale-105"
              />
            )}
          </span>
        </span>
      </Link>
    </li>
  );
}
