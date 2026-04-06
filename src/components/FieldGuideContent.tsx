"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Stamp } from "@/components/Stamp";
import { urlFor } from "@/lib/sanity/image";
import type { SanityCryptidListItem, SanityAnomalyListItem } from "@/types/sanity";
import { MapPin, AlertTriangle, BookOpen, Zap, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

// Group cryptids alphabetically for the TOC
function groupByFirstLetter(
  cryptids: SanityCryptidListItem[]
): Record<string, SanityCryptidListItem[]> {
  return cryptids.reduce((acc, cryptid) => {
    const letter = cryptid.name.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(cryptid);
    return acc;
  }, {} as Record<string, SanityCryptidListItem[]>);
}

// Group cryptids by region
function groupByRegion(
  cryptids: SanityCryptidListItem[]
): Record<string, SanityCryptidListItem[]> {
  return cryptids.reduce((acc, cryptid) => {
    const region = cryptid.region || "Unknown";
    if (!acc[region]) acc[region] = [];
    acc[region].push(cryptid);
    return acc;
  }, {} as Record<string, SanityCryptidListItem[]>);
}

// Group anomalies by type
function groupAnomaliesByType(
  anomalies: SanityAnomalyListItem[]
): Record<string, SanityAnomalyListItem[]> {
  return anomalies.reduce((acc, anomaly) => {
    const type = anomaly.anomalyType || "Unknown";
    if (!acc[type]) acc[type] = [];
    acc[type].push(anomaly);
    return acc;
  }, {} as Record<string, SanityAnomalyListItem[]>);
}

// Danger level badge colors
const dangerColors: Record<string, string> = {
  Low: "bg-primary/15 text-primary border-primary/20",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-destructive/15 text-destructive border-destructive/20",
};

// Anomaly status badge colors
const statusColors: Record<string, string> = {
  "Open File": "bg-blue-50 text-blue-700 border-blue-200",
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cold: "bg-slate-50 text-slate-500 border-slate-200",
  Seasonal: "bg-purple-50 text-purple-700 border-purple-200",
};

// Field Guide Entry Component (Cryptids) - Index card style
const FieldGuideEntry = ({
  cryptid,
  index,
}: {
  cryptid: SanityCryptidListItem;
  index: number;
}) => {
  const imageSource = cryptid.gridImage || cryptid.image;
  const imageUrl = imageSource
    ? urlFor(imageSource).width(200).height(200).fit("crop").quality(75).auto("format").url()
    : null;

  return (
    <article
      id={`entry-${cryptid.slug?.current}`}
      className="relative scroll-mt-24 py-4 px-3 bg-card/30 rounded-sm"
      style={{
        backgroundImage: `repeating-linear-gradient(
          transparent,
          transparent 22px,
          hsl(40 20% 70% / 0.08) 22px,
          hsl(40 20% 70% / 0.08) 23px
        )`,
        backgroundPosition: "0 4px",
      }}
    >
      {/* Entry number in margin */}
      <div className="absolute -left-6 top-4 hidden lg:block">
        <span className="text-xs font-typewriter text-muted-foreground/40">
          {String(index + 1).padStart(3, "0")}
        </span>
      </div>

      <div className="flex gap-4 sm:gap-5">
        {imageUrl && (
          <div className="shrink-0">
            <a href={`/cryptid/${cryptid.slug?.current}`}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden bg-muted border border-border/50">
                <img
                  src={imageUrl}
                  alt={cryptid.imageAlt || cryptid.name}
                  className="w-full h-full object-cover object-top sepia-light hover:sepia-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            </a>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
            <div>
              <a
                href={`/cryptid/${cryptid.slug?.current}`}
                className="group inline-flex items-baseline gap-2"
              >
                <h3 className="text-base sm:text-lg font-display font-bold text-foreground group-hover:text-primary transition-colors">
                  {cryptid.name}
                </h3>
              </a>
              {cryptid.scientificName && (
                <p className="text-xs font-typewriter italic text-muted-foreground mt-0.5">
                  {cryptid.scientificName}
                </p>
              )}
            </div>

            <span
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium border rounded",
                dangerColors[cryptid.dangerLevel] || dangerColors.Low
              )}
            >
              <AlertTriangle className="w-2.5 h-2.5" />
              {cryptid.dangerLevel}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mb-1.5">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" />
              {cryptid.location}
            </span>
            <span className="font-typewriter">
              {cryptid.region}
            </span>
          </div>

          {cryptid.description && (
            <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">
              {cryptid.description}
            </p>
          )}

          {cryptid.tags && cryptid.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {cryptid.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-1 py-0.5 text-xs font-typewriter uppercase tracking-wide text-muted-foreground/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <a
            href={`/cryptid/${cryptid.slug?.current}`}
            className="inline-flex items-center gap-1 mt-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <BookOpen className="w-2.5 h-2.5" />
            Full case file
          </a>
        </div>
      </div>
    </article>
  );
};

// Anomaly Entry Component - Index card style
const AnomalyEntry = ({
  anomaly,
  index,
}: {
  anomaly: SanityAnomalyListItem;
  index: number;
}) => {
  const imageSource = anomaly.gridImage || anomaly.image;
  const imageUrl = imageSource
    ? urlFor(imageSource).width(200).height(200).fit("crop").quality(75).auto("format").url()
    : null;

  return (
    <article
      id={`anomaly-${anomaly.slug?.current}`}
      className="relative scroll-mt-24 py-4 px-3 bg-card/30 rounded-sm"
      style={{
        backgroundImage: `repeating-linear-gradient(
          transparent,
          transparent 22px,
          hsl(40 20% 70% / 0.08) 22px,
          hsl(40 20% 70% / 0.08) 23px
        )`,
        backgroundPosition: "0 4px",
      }}
    >
      <div className="absolute -left-6 top-4 hidden lg:block">
        <span className="text-xs font-typewriter text-muted-foreground/40">
          A{String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex gap-4 sm:gap-5">
        {imageUrl && (
          <div className="shrink-0">
            <a href={`/anomaly/${anomaly.slug?.current}`}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden bg-muted border border-border/50">
                <img
                  src={imageUrl}
                  alt={anomaly.imageAlt || anomaly.name}
                  className="w-full h-full object-cover object-top sepia-light hover:sepia-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            </a>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
            <div>
              <a
                href={`/anomaly/${anomaly.slug?.current}`}
                className="group inline-flex items-baseline gap-2"
              >
                <h3 className="text-base sm:text-lg font-display font-bold text-foreground group-hover:text-accent transition-colors">
                  {anomaly.name}
                </h3>
              </a>
              {anomaly.subhead && (
                <p className="text-xs font-typewriter italic text-muted-foreground mt-0.5">
                  {anomaly.subhead}
                </p>
              )}
            </div>

            <span
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium border rounded",
                statusColors[anomaly.status] || statusColors["Open File"]
              )}
            >
              <Radio className="w-2.5 h-2.5" />
              {anomaly.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mb-1.5">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" />
              {anomaly.location}
            </span>
            <span className="font-typewriter">
              {anomaly.anomalyType}
            </span>
          </div>

          {anomaly.description && (
            <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">
              {anomaly.description}
            </p>
          )}

          {anomaly.tags && anomaly.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {anomaly.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-1 py-0.5 text-xs font-typewriter uppercase tracking-wide text-muted-foreground/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <a
            href={`/anomaly/${anomaly.slug?.current}`}
            className="inline-flex items-center gap-1 mt-1.5 text-xs text-accent hover:text-accent/80 font-medium transition-colors"
          >
            <BookOpen className="w-2.5 h-2.5" />
            View anomaly file
          </a>
        </div>
      </div>
    </article>
  );
};

// Subtle divider between entries
const JournalDivider = () => (
  <div className="flex items-center gap-2 my-3 px-3">
    <div className="flex-1 h-px bg-border/30" />
    <div className="text-muted-foreground/20 text-xs">&#8226;</div>
    <div className="flex-1 h-px bg-border/30" />
  </div>
);

// Section divider between cryptids and anomalies
const SectionDivider = ({ title }: { title: string }) => (
  <div className="relative py-10">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-dashed border-border/50" />
    </div>
    <div className="relative flex justify-center">
      <div className="bg-background px-4 py-1.5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Zap className="w-4 h-4 text-accent/60" />
          <span className="text-sm font-typewriter uppercase tracking-wider">
            {title}
          </span>
          <Zap className="w-4 h-4 text-accent/60" />
        </div>
      </div>
    </div>
  </div>
);

// Table of Contents Component
const TableOfContents = ({
  letters,
  activeId,
  groupBy,
  onGroupByChange,
  regionNames,
  anomalyTypes,
  hasAnomalies,
}: {
  letters: string[];
  activeId: string | null;
  groupBy: "alpha" | "region";
  onGroupByChange: (value: "alpha" | "region") => void;
  regionNames: string[];
  anomalyTypes: string[];
  hasAnomalies: boolean;
}) => {
  return (
    <nav className="space-y-3">
      <div className="font-typewriter text-xs uppercase tracking-widest text-muted-foreground/70">
        Index
      </div>

      {/* Group by toggle */}
      <div className="flex gap-1 p-0.5 bg-muted/30 rounded text-xs">
        <button
          onClick={() => onGroupByChange("alpha")}
          className={cn(
            "flex-1 px-2 py-1 rounded transition-colors",
            groupBy === "alpha"
              ? "bg-card text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          A-Z
        </button>
        <button
          onClick={() => onGroupByChange("region")}
          className={cn(
            "flex-1 px-2 py-1 rounded transition-colors",
            groupBy === "region"
              ? "bg-card text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Region
        </button>
      </div>

      {/* Cryptids section */}
      <div className="text-xs font-typewriter uppercase tracking-wider text-primary/60 pt-1">
        Cryptids
      </div>

      {groupBy === "alpha" ? (
        <div className="flex flex-wrap gap-0.5">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#section-${letter}`}
              className={cn(
                "w-6 h-6 flex items-center justify-center text-xs font-display rounded transition-colors",
                activeId === letter
                  ? "bg-primary/80 text-primary-foreground"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {letter}
            </a>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {regionNames.map((region) => (
            <a
              key={region}
              href={`#section-${region}`}
              className={cn(
                "px-2 py-1 text-xs rounded transition-colors",
                activeId === region
                  ? "bg-primary/80 text-primary-foreground"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {region}
            </a>
          ))}
        </div>
      )}

      {/* Anomalies section */}
      {hasAnomalies && (
        <>
          <div className="text-xs font-typewriter uppercase tracking-wider text-accent/60 pt-3 border-t border-border/30">
            Anomalies
          </div>
          <div className="flex flex-col gap-0.5">
            {anomalyTypes.map((type) => (
              <a
                key={type}
                href={`#anomaly-type-${type.replace(/\s+/g, "-")}`}
                className={cn(
                  "px-2 py-1 text-xs rounded transition-colors",
                  activeId === type
                    ? "bg-accent/80 text-accent-foreground"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                )}
              >
                {type}
              </a>
            ))}
          </div>
        </>
      )}
    </nav>
  );
};

// Main Field Guide Content Component
export function FieldGuideContent({
  cryptids = [],
  anomalies = [],
}: {
  cryptids: SanityCryptidListItem[];
  anomalies: SanityAnomalyListItem[];
}) {
  const [groupBy, setGroupBy] = useState<"alpha" | "region">("alpha");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Sort cryptids alphabetically by name
  const sortedCryptids = useMemo(
    () => [...cryptids].sort((a, b) => a.name.localeCompare(b.name)),
    [cryptids]
  );

  // Sort anomalies alphabetically by name
  const sortedAnomalies = useMemo(
    () => [...anomalies].sort((a, b) => a.name.localeCompare(b.name)),
    [anomalies]
  );

  // Group data
  const groupedByLetter = useMemo(
    () => groupByFirstLetter(sortedCryptids),
    [sortedCryptids]
  );
  const groupedByRegion = useMemo(
    () => groupByRegion(sortedCryptids),
    [sortedCryptids]
  );
  const groupedAnomaliesByType = useMemo(
    () => groupAnomaliesByType(sortedAnomalies),
    [sortedAnomalies]
  );

  const letters = Object.keys(groupedByLetter).sort();
  const regionNames = Object.keys(groupedByRegion).sort();
  const anomalyTypes = Object.keys(groupedAnomaliesByType).sort();

  // Intersection observer for TOC highlighting
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id
              .replace("section-", "")
              .replace("anomaly-type-", "")
              .replace(/-/g, " ");
            setActiveSection(id);
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    const sections = document.querySelectorAll("[data-toc-section]");
    sections.forEach((section) => observerRef.current?.observe(section));

    return () => observerRef.current?.disconnect();
  }, [cryptids, anomalies, groupBy]);

  // Total entry counts
  const totalCryptids = cryptids.length;
  const totalAnomalies = anomalies.length;

  return (
    <>
      {/* Field Journal Cover Header - Bureau Memo Style */}
      <section className="relative py-8 sm:py-12 px-4 border-b border-border">
        <div className="container mx-auto max-w-3xl">
          {/* Memo block with rotation */}
          <div className="relative" style={{ transform: "rotate(-0.5deg)" }}>
            {/* Paper Clip */}
            <div className="paper-clip" aria-hidden="true" />

            {/* Memo Paper */}
            <div className="memo-paper border border-border/40 rounded-sm p-6 pt-8 pl-10 relative overflow-hidden">
              {/* Three-hole punch marks */}
              <div className="hole-punch" style={{ top: "30px" }} aria-hidden="true" />
              <div className="hole-punch" style={{ top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
              <div className="hole-punch" style={{ bottom: "30px" }} aria-hidden="true" />

              {/* Form Reference Number */}
              <div className="memo-form-ref absolute top-3 right-4 text-right">
                Form No. FG-001<br />
                Rev. 01/2026
              </div>

              {/* Reference Stamp */}
              <div className="absolute -top-3 right-12 z-20 hidden sm:block">
                <Stamp
                  text="Reference"
                  variant="muted"
                  rotation={-8}
                  className="text-xs px-3 py-1 opacity-60 border-2"
                />
              </div>

              {/* Memo Header */}
              <div className="memo-header">
                <div className="memo-letterhead">
                  Appalachian Cryptid Division<br />
                  Department of Unexplained Phenomena
                </div>
                <div className="memo-title">
                  Field Reference
                </div>
                <div className="space-y-1">
                  <div className="memo-meta-line">
                    <span className="memo-meta-label">To:</span>
                    <span className="memo-meta-value">Field Research Personnel</span>
                  </div>
                  <div className="memo-meta-line">
                    <span className="memo-meta-label">From:</span>
                    <span className="memo-meta-value">Records Division</span>
                  </div>
                  <div className="memo-meta-line">
                    <span className="memo-meta-label">Date:</span>
                    <span className="memo-meta-value">[Ongoing]</span>
                  </div>
                  <div className="memo-meta-line">
                    <span className="memo-meta-label">Re:</span>
                    <span className="memo-meta-value">Cryptid & Anomaly Documentation</span>
                  </div>
                </div>
              </div>

              {/* Main Title */}
              <div className="mt-4 mb-2">
                <h1 className="text-[28px] font-bold text-foreground font-display">
                  Field Guide: Complete Reference
                </h1>
              </div>

              {/* Entry counts - integrated into memo */}
              <div className="flex gap-6 mt-4 pt-3 border-t border-dashed border-border/30">
                <div className="memo-meta-line flex-1">
                  <span className="memo-meta-label">Entries:</span>
                  <span className="memo-meta-value">
                    {totalCryptids} Cryptid{totalCryptids !== 1 ? "s" : ""}
                    {totalAnomalies > 0 && `, ${totalAnomalies} Anomal${totalAnomalies !== 1 ? "ies" : "y"}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-6 sm:py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sticky TOC - Mobile (top) */}
            <div className="lg:hidden sticky top-16 z-30 -mx-4 px-4 py-2.5 bg-background/95 backdrop-blur-sm border-b border-border/50">
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-hide">
                <span className="text-xs font-typewriter text-muted-foreground/70 whitespace-nowrap">
                  Jump:
                </span>
                <div className="flex gap-0.5 p-0.5 bg-muted/30 rounded">
                  <button
                    onClick={() => setGroupBy("alpha")}
                    className={cn(
                      "px-2 py-0.5 text-xs rounded",
                      groupBy === "alpha"
                        ? "bg-card"
                        : "text-muted-foreground"
                    )}
                  >
                    A-Z
                  </button>
                  <button
                    onClick={() => setGroupBy("region")}
                    className={cn(
                      "px-2 py-0.5 text-xs rounded",
                      groupBy === "region"
                        ? "bg-card"
                        : "text-muted-foreground"
                    )}
                  >
                    Region
                  </button>
                </div>
                {groupBy === "alpha"
                  ? letters.map((letter) => (
                      <a
                        key={letter}
                        href={`#section-${letter}`}
                        className={cn(
                          "w-5 h-5 shrink-0 flex items-center justify-center text-xs font-display rounded",
                          activeSection === letter
                            ? "bg-primary/80 text-primary-foreground"
                            : "bg-muted/30 hover:bg-muted/50"
                        )}
                      >
                        {letter}
                      </a>
                    ))
                  : regionNames.map((region) => (
                      <a
                        key={region}
                        href={`#section-${region}`}
                        className={cn(
                          "px-1.5 py-0.5 shrink-0 text-xs rounded whitespace-nowrap",
                          activeSection === region
                            ? "bg-primary/80 text-primary-foreground"
                            : "bg-muted/30 hover:bg-muted/50"
                        )}
                      >
                        {region}
                      </a>
                    ))}
                {anomalies.length > 0 && (
                  <a
                    href="#anomalies-section"
                    className="px-1.5 py-0.5 shrink-0 text-xs rounded whitespace-nowrap bg-accent/15 text-accent hover:bg-accent/25"
                  >
                    Anomalies
                  </a>
                )}
              </div>
            </div>

            {/* Sticky TOC - Desktop (sidebar) */}
            <aside className="hidden lg:block w-44 shrink-0">
              <div className="sticky top-24">
                <div className="bg-card/50 p-3 rounded border border-border/30">
                  <TableOfContents
                    letters={letters}
                    activeId={activeSection}
                    groupBy={groupBy}
                    onGroupByChange={setGroupBy}
                    regionNames={regionNames}
                    anomalyTypes={anomalyTypes}
                    hasAnomalies={anomalies.length > 0}
                  />
                </div>

                {/* Field notes quote */}
                <div className="mt-4 p-2.5 bg-amber-50/30 border border-amber-200/30 rounded text-xs text-amber-900/50 italic">
                  <p>
                    "The mountains keep their secrets."
                  </p>
                  <p className="mt-1 text-right font-typewriter not-italic text-xs">
                    — Field Notes, 1947
                  </p>
                </div>
              </div>
            </aside>

            {/* Main entries with hole punches */}
            <main className="flex-1 min-w-0 relative">
              {/* Hole punch marks for desktop */}
              <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-6 pointer-events-none">
                <div className="sticky top-28 flex flex-col gap-[200px]">
                  <div className="w-3 h-3 rounded-full bg-muted/50 border border-border/30" />
                  <div className="w-3 h-3 rounded-full bg-muted/50 border border-border/30" />
                  <div className="w-3 h-3 rounded-full bg-muted/50 border border-border/30" />
                </div>
              </div>

              <div className="lg:pl-6">
                {/* Empty State */}
                {totalCryptids === 0 && totalAnomalies === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground font-typewriter text-sm">
                      No entries documented yet.
                    </p>
                  </div>
                )}

                {/* CRYPTIDS SECTION */}
                {cryptids.length > 0 && (
                  <>
                    {/* Content - Grouped by Letter */}
                    {groupBy === "alpha" && (
                      <div className="space-y-6">
                        {letters.map((letter) => (
                          <section key={letter}>
                            <div
                              id={`section-${letter}`}
                              data-toc-section
                              className="scroll-mt-24 mb-3"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-display font-bold text-primary/15">
                                  {letter}
                                </span>
                                <div className="flex-1 h-px bg-border/30" />
                                <span className="text-xs font-typewriter text-muted-foreground/50">
                                  {groupedByLetter[letter].length}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1 border-l border-border/20 ml-1">
                              {groupedByLetter[letter].map((cryptid, idx) => (
                                <div key={cryptid._id}>
                                  <FieldGuideEntry
                                    cryptid={cryptid}
                                    index={
                                      sortedCryptids.findIndex(
                                        (c) => c._id === cryptid._id
                                      ) || idx
                                    }
                                  />
                                  {idx < groupedByLetter[letter].length - 1 && (
                                    <JournalDivider />
                                  )}
                                </div>
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>
                    )}

                    {/* Content - Grouped by Region */}
                    {groupBy === "region" && (
                      <div className="space-y-8">
                        {regionNames.map((region) => (
                          <section key={region}>
                            <div
                              id={`section-${region}`}
                              data-toc-section
                              className="scroll-mt-24 mb-3"
                            >
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary/30" />
                                <span className="text-lg font-display font-bold text-foreground/80">
                                  {region}
                                </span>
                                <div className="flex-1 h-px bg-border/30" />
                                <span className="text-xs font-typewriter text-muted-foreground/50">
                                  {groupedByRegion[region].length}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1 border-l border-border/20 ml-1">
                              {groupedByRegion[region]
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((cryptid, idx) => (
                                  <div key={cryptid._id}>
                                    <FieldGuideEntry
                                      cryptid={cryptid}
                                      index={
                                        sortedCryptids.findIndex(
                                          (c) => c._id === cryptid._id
                                        ) || idx
                                      }
                                    />
                                    {idx < groupedByRegion[region].length - 1 && (
                                      <JournalDivider />
                                    )}
                                  </div>
                                ))}
                            </div>
                          </section>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* ANOMALIES SECTION */}
                {anomalies.length > 0 && (
                  <div id="anomalies-section">
                    <SectionDivider title="Anomalies" />

                    <div className="space-y-8">
                      {anomalyTypes.map((type) => (
                        <section key={type}>
                          <div
                            id={`anomaly-type-${type.replace(/\s+/g, "-")}`}
                            data-toc-section
                            className="scroll-mt-24 mb-3"
                          >
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-accent/30" />
                              <span className="text-lg font-display font-bold text-foreground/80">
                                {type}
                              </span>
                              <div className="flex-1 h-px bg-border/30" />
                              <span className="text-xs font-typewriter text-muted-foreground/50">
                                {groupedAnomaliesByType[type].length}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1 border-l border-accent/20 ml-1">
                            {groupedAnomaliesByType[type]
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((anomaly, idx) => (
                                <div key={anomaly._id}>
                                  <AnomalyEntry
                                    anomaly={anomaly}
                                    index={
                                      sortedAnomalies.findIndex(
                                        (a) => a._id === anomaly._id
                                      ) || idx
                                    }
                                  />
                                  {idx <
                                    groupedAnomaliesByType[type].length - 1 && (
                                    <JournalDivider />
                                  )}
                                </div>
                              ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  </div>
                )}

                {/* End of guide marker */}
                {(totalCryptids > 0 || totalAnomalies > 0) && (
                  <div className="mt-12 pt-6 border-t border-dashed border-border/30 text-center">
                    <div className="font-typewriter text-xs text-muted-foreground/40 tracking-wider">
                      — END OF FIELD GUIDE —
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </section>

    </>
  );
}
