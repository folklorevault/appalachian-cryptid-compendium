"use client";

import { useState } from "react";
import Link from "next/link";
import type { SanityBulletinListItem, BulletinCategory } from "@/types/sanity";
import { formatLedgerDate, formatLongDate } from "@/lib/utils";

const CATEGORIES: Record<
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


function CategoryTag({ category }: { category: BulletinCategory }) {
  const cat = CATEGORIES[category];
  return (
    <span
      className="font-typewriter text-xs tracking-widest uppercase pb-px"
      style={{
        color: `hsl(var(${cat.cssVar}))`,
        borderBottom: `1.5px solid hsl(var(${cat.cssVar}) / 0.25)`,
      }}
    >
      {cat.abbr}
    </span>
  );
}

function LedgerRow({
  bulletin,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  bulletin: SanityBulletinListItem;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <tr
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`cursor-pointer transition-colors duration-100 ${
        isHovered ? "bg-muted" : "bg-transparent"
      }`}
    >
      {/* Bulletin number */}
      <td className="py-3 pr-3 align-top whitespace-nowrap border-b border-border/60">
        <Link
          href={`/bulletin/${bulletin.slug.current}`}
          className="font-typewriter text-sm font-bold tracking-[0.05em] text-[hsl(var(--bureau-ink))] no-underline"
        >
          {bulletin.bulletinNumber}
        </Link>
      </td>

      {/* Date */}
      <td className="py-3 pr-4 align-top whitespace-nowrap border-b border-border/60">
        <Link
          href={`/bulletin/${bulletin.slug.current}`}
          className="font-typewriter text-sm tracking-[0.03em] text-[hsl(var(--bureau-ink-muted))] no-underline"
        >
          {formatLedgerDate(bulletin.date)}
        </Link>
      </td>

      {/* Category */}
      <td className="py-3 pr-4 align-top border-b border-border/60">
        <Link
          href={`/bulletin/${bulletin.slug.current}`}
          className="no-underline"
        >
          <CategoryTag category={bulletin.category} />
        </Link>
      </td>

      {/* Title + summary */}
      <td className="py-3 pr-4 align-top border-b border-border/60">
        <Link
          href={`/bulletin/${bulletin.slug.current}`}
          className="no-underline block"
        >
          <div className="font-display text-base font-bold text-foreground leading-snug mb-0.5">
            {bulletin.title}
          </div>
          <div className="font-sans text-sm text-muted-foreground leading-relaxed max-w-[500px]">
            {bulletin.summary}
          </div>
        </Link>
      </td>

      {/* Read time */}
      <td className="py-3 pr-3 align-top text-right border-b border-border/60 whitespace-nowrap">
        <Link
          href={`/bulletin/${bulletin.slug.current}`}
          className="font-typewriter text-sm text-muted-foreground/80 tracking-[0.03em] no-underline"
        >
          {bulletin.readTime}
        </Link>
      </td>
    </tr>
  );
}

function MobileLedgerEntry({
  bulletin,
}: {
  bulletin: SanityBulletinListItem;
}) {
  return (
    <Link
      href={`/bulletin/${bulletin.slug.current}`}
      className="block no-underline py-3.5 border-b border-border/60"
    >
      {/* Top line: ID, date, category */}
      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
        <span className="font-typewriter text-sm font-bold tracking-[0.05em] text-[hsl(var(--bureau-ink))]">
          {bulletin.bulletinNumber}
        </span>
        <span className="font-typewriter text-sm text-[hsl(var(--bureau-ink-muted))]">
          {formatLedgerDate(bulletin.date)}
        </span>
        <CategoryTag category={bulletin.category} />
      </div>

      {/* Title */}
      <div className="font-display text-base font-bold text-foreground leading-snug mb-1">
        {bulletin.title}
      </div>

      {/* Summary */}
      <div className="font-sans text-sm text-muted-foreground leading-relaxed">
        {bulletin.summary}
      </div>

      {/* Read time */}
      <div className="font-typewriter text-sm text-muted-foreground/80 mt-1.5">
        {bulletin.readTime} read
      </div>
    </Link>
  );
}

export function BulletinLedger({
  bulletins,
}: {
  bulletins: SanityBulletinListItem[];
}) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const lastDate =
    bulletins.length > 0
      ? formatLongDate(bulletins[bulletins.length - 1].date)
      : "";

  return (
    <section className="max-w-[960px] mx-auto px-6 pb-20 relative z-2">
      {/* Ledger book binding */}
      <div
        className="bg-card border border-[hsl(var(--bureau-border))] border-t-[3px] border-t-[hsl(var(--bureau-ink-muted))] relative overflow-hidden"
        style={{
          padding: "24px 28px 28px 44px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04), inset 0 0 40px rgba(139,115,85,0.03)",
        }}
      >
        {/* Red margin line */}
        <div
          className="absolute top-0 bottom-0 z-3"
          style={{
            left: "32px",
            width: "1.5px",
            background: `hsl(var(--ledger-margin-line) / 0.15)`,
          }}
          aria-hidden="true"
        />

        {/* Horizontal ruled lines */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `repeating-linear-gradient(transparent, transparent 39px, hsl(var(--ledger-ruled-line) / 0.1) 39px, hsl(var(--ledger-ruled-line) / 0.1) 40px)`,
            backgroundPosition: "0 24px",
          }}
          aria-hidden="true"
        />

        {/* Page number */}
        <div className="absolute top-2 right-4 font-typewriter text-xs text-muted-foreground/60 tracking-[0.08em]">
          PAGE 1 OF 1
        </div>

        {/* ── Desktop table ── */}
        <div className="hidden md:block relative z-2">
          {/* Column headings */}
          <div className="border-b-2 border-[hsl(var(--bureau-ink-muted))] mb-1 pb-1.5">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr>
                  <th className="text-left font-typewriter text-xs font-bold tracking-[0.15em] uppercase text-[hsl(var(--bureau-ink-muted))] pr-3 whitespace-nowrap">
                    No.
                  </th>
                  <th className="text-left font-typewriter text-xs font-bold tracking-[0.15em] uppercase text-[hsl(var(--bureau-ink-muted))] pr-4 whitespace-nowrap">
                    Filed
                  </th>
                  <th className="text-left font-typewriter text-xs font-bold tracking-[0.15em] uppercase text-[hsl(var(--bureau-ink-muted))] pr-4 whitespace-nowrap">
                    Dept.
                  </th>
                  <th className="text-left font-typewriter text-xs font-bold tracking-[0.15em] uppercase text-[hsl(var(--bureau-ink-muted))] pr-4">
                    Subject
                  </th>
                  <th className="text-right font-typewriter text-xs font-bold tracking-[0.15em] uppercase text-[hsl(var(--bureau-ink-muted))] pr-3 whitespace-nowrap">
                    Est. Read
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Rows */}
          <table className="w-full border-collapse table-auto">
            <tbody>
              {bulletins.map((bulletin, i) => (
                <LedgerRow
                  key={bulletin._id}
                  bulletin={bulletin}
                  index={i}
                  isHovered={hoveredRow === bulletin._id}
                  onHover={() => setHoveredRow(bulletin._id)}
                  onLeave={() => setHoveredRow(null)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile stacked entries ── */}
        <div className="md:hidden relative z-2">
          {bulletins.map((bulletin) => (
            <MobileLedgerEntry key={bulletin._id} bulletin={bulletin} />
          ))}
        </div>

        {/* Ledger footer */}
        <div className="relative z-2 border-t-2 border-[hsl(var(--bureau-ink-muted))] mt-4 pt-2.5 flex justify-between items-center flex-wrap gap-2">
          <span className="font-typewriter text-xs text-muted-foreground tracking-[0.08em] uppercase">
            Ledger contains {bulletins.length} entries
          </span>
          {lastDate && (
            <span className="font-typewriter text-xs text-muted-foreground/80 tracking-[0.05em]">
              Last updated: {lastDate}
            </span>
          )}
        </div>
      </div>

      {/* Bottom note — outside ledger */}
      <div className="text-center mt-6 font-typewriter text-xs text-muted-foreground/80 tracking-[0.08em] uppercase">
        Additional entries released on a rolling schedule ◆ Bureau of
        Appalachian Cryptid Documentation
      </div>
    </section>
  );
}
