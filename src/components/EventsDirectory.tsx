"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import {
  MONTH_NAMES,
  dateBlock,
  statusLabel,
  statusNote,
  type DatedEvent,
  type EventMonth,
  type EventStatus,
} from "@/lib/events";
import { buildStateChips, matchesStateFilter, stateName } from "@/lib/states";

interface EventsDirectoryProps {
  months: EventMonth[];
  /** Server-rendered plate copy (eyebrow, H1, lede, count) above the chips. */
  intro: ReactNode;
  /** Server-rendered "Next on the calendar" list for the plate's right column. */
  nextUp: ReactNode;
}

const ADMISSION_LABEL = { free: "Free", ticketed: "Ticketed", mixed: "Free entry" } as const;

/**
 * The /events page body: the Filing Green plate with its state filter, then
 * the calendar register grouped by month. Status is worked out on the server
 * and passed in, so this component only filters.
 */
export function EventsDirectory({ months, intro, nextUp }: EventsDirectoryProps) {
  const [selectedState, setSelectedState] = useState("all");
  const [query, setQuery] = useState("");
  const terms = normalize(query).split(" ").filter(Boolean);
  const filtering = selectedState !== "all" || terms.length > 0;

  const all = months.flatMap((m) => m.entries);
  const { chips, singles } = buildStateChips(all.map((e) => ({ states: [e.event.state] })));

  const visible = months
    .map((m) => ({
      ...m,
      entries: m.entries.filter(
        (e) =>
          matchesStateFilter([e.event.state], selectedState, singles) &&
          terms.every((t) => searchText(e).includes(t))
      ),
    }))
    .filter((m) => m.entries.length > 0);
  const visibleCount = visible.reduce((n, m) => n + m.entries.length, 0);

  return (
    <>
      <section
        className="plate-stock plate-green relative overflow-hidden border-b border-border bg-primary text-bureau-manila-light paper-texture"
        aria-labelledby="events-heading"
      >
        <div className="relative z-[2] max-w-6xl mx-auto px-6 lg:px-8 pt-12 pb-12 lg:pt-16 lg:pb-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-14 lg:items-end">
            <div>
              {intro}

              {chips.length > 0 && (
                <div role="group" aria-label="Filter by state" className="flex flex-wrap gap-2 mb-6">
                  {[{ value: "all", label: "All states", count: all.length }, ...chips].map((chip) => {
                    const active = selectedState === chip.value;
                    return (
                      <button
                        key={chip.value}
                        type="button"
                        onClick={() => setSelectedState(chip.value)}
                        aria-pressed={active}
                        aria-label={`${chip.label}, ${chip.count} ${chip.count === 1 ? "event" : "events"}`}
                        className={`relative inline-flex items-baseline gap-1.5 font-typewriter text-xs tracking-type px-2.5 py-1 rounded-sm border transition-colors duration-150 after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-[""] ${
                          active
                            ? "bg-bureau-paper text-primary border-bureau-paper"
                            : "bg-transparent text-bureau-manila-light border-bureau-manila-light/40 hover:border-bureau-manila-light"
                        }`}
                      >
                        {chip.label}
                        <span aria-hidden="true" className="text-tag tabular-nums">
                          {chip.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5">
                <div className="relative w-full max-w-sm">
                  <label htmlFor="event-search" className="sr-only">
                    Search events
                  </label>
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bureau-ink-muted"
                  />
                  <input
                    id="event-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by event, town or creature"
                    autoComplete="off"
                    className="h-11 w-full rounded-sm border border-bureau-paper bg-bureau-paper pl-10 pr-10 font-typewriter text-sm tracking-type text-bureau-ink placeholder:text-bureau-ink-muted [&::-webkit-search-cancel-button]:appearance-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-sm text-bureau-ink-muted hover:text-bureau-ink"
                    >
                      <X aria-hidden="true" className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Link
                  href="/contact"
                  className="font-typewriter text-xs tracking-type text-bureau-manila-light border-b border-dotted border-bureau-manila-light/60 hover:border-solid"
                >
                  Running an event? Tell the Bureau
                </Link>
              </div>
            </div>

            {nextUp}
          </div>
        </div>
      </section>

      <section id="calendar" aria-labelledby="calendar-heading" className="scroll-mt-24 pt-10 pb-16">
        {/* Same container as the plate so the two left edges line up. */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-2">
            <h2 id="calendar-heading" className="font-display font-bold text-xl text-foreground">
              The calendar
            </h2>
            <p className="font-typewriter text-xs tracking-type text-muted-foreground" aria-live="polite">
              {filtering ? `${visibleCount} of ${all.length} events` : `${visibleCount} events`}
            </p>
          </div>
          <p className="font-typewriter text-xs tracking-type text-muted-foreground mb-2">
            A solid box means the dates are confirmed. A dashed box means the event runs every year
            but hasn’t announced dates yet.
          </p>

          {visibleCount === 0 && (
            <p className="mt-8 py-6 border-y border-border text-sm text-muted-foreground">
              No events match{terms.length > 0 && <> “{query.trim()}”</>}
              {selectedState !== "all" && <> in this state</>}.{" "}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedState("all");
                }}
                className="font-typewriter text-xs tracking-type text-primary border-b border-dotted border-primary/60 hover:border-solid"
              >
                Show all events
              </button>
            </p>
          )}

          {visible.map((m) => (
            <section key={m.month} aria-labelledby={`month-${m.month}`} className="mt-8">
              <div className="flex items-baseline justify-between gap-4 pb-2 border-b-2 border-foreground">
                <h3 id={`month-${m.month}`} className="font-display font-bold text-xl text-foreground">
                  {MONTH_NAMES[m.month - 1]}
                </h3>
                <span className="font-typewriter text-tag tracking-label uppercase text-muted-foreground">
                  {m.entries.length} {m.entries.length === 1 ? "event" : "events"}
                </span>
              </div>
              <ul>
                {m.entries.map((entry) => (
                  <EventRow key={entry.event._id} entry={entry} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}

// Lowercase, no accents or apostrophes, so "fayettevilles" finds "Fayetteville's".
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const searchText = ({ event }: DatedEvent) =>
  normalize(
    [
      event.name,
      event.town,
      event.state,
      stateName(event.state),
      event.legend,
      event.organizer ?? "",
      ...(event.subjects ?? []).map((s) => s.name),
    ].join(" ")
  );

const DATE_BLOCK_STYLE: Record<EventStatus["kind"], string> = {
  confirmed: "border-2 border-primary text-primary",
  expected: "border-2 border-dashed border-muted-foreground text-muted-foreground",
  lapsed: "border border-dotted border-border text-muted-foreground",
};

const BADGE_STYLE: Record<EventStatus["kind"], string> = {
  confirmed: "bg-primary text-primary-foreground",
  expected: "border border-dashed border-muted-foreground text-muted-foreground",
  lapsed: "border border-border text-muted-foreground",
};

function EventRow({ entry }: { entry: DatedEvent }) {
  const { event, status } = entry;
  const block = dateBlock(event, status);
  const note = statusNote(event, status);

  return (
    <li className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-start gap-x-5 gap-y-3 py-4.5 border-b border-border md:grid-cols-[5.5rem_minmax(0,1fr)_13rem]">
      <div
        aria-hidden="true"
        className={`grid min-h-15 content-center justify-items-center rounded-sm px-1 pt-2 pb-1.5 text-center ${DATE_BLOCK_STYLE[status.kind]}`}
      >
        <span className="font-typewriter text-tag tracking-label uppercase">{block.month}</span>
        {block.main && (
          <span
            className={`font-display leading-none tabular-nums ${
              block.approx ? "text-base" : "font-bold text-title"
            }`}
          >
            {block.main}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <h4 className="font-display font-bold text-xl leading-tight text-foreground">
          <Link
            href={`/events/${event.slug.current}`}
            className="hover:underline underline-offset-4 decoration-1"
          >
            {event.name}
          </Link>
        </h4>
        <p className="sr-only">{block.label}.</p>
        <p className="mt-0.5 mb-2 text-sm text-muted-foreground">
          {event.town}, {stateName(event.state)}
          {event.organizer && <> · {event.organizer}</>}
        </p>
        <ul className="flex flex-wrap items-center gap-x-2 gap-y-1.5" aria-label="Details">
          {event.subjects?.length ? (
            event.subjects.map((s) => (
              <li key={s._id}>
                <Link
                  href={`/${s._type}/${s.slug.current}`}
                  className="block font-typewriter text-xs tracking-type px-2 py-0.5 rounded-sm border border-current text-primary hover:bg-primary/10"
                >
                  {s.name} · case file
                </Link>
              </li>
            ))
          ) : (
            <Chip>{event.legend}</Chip>
          )}
          <Chip>{event.kind === "conference" ? "Conference" : "Festival"}</Chip>
          {event.admission && <Chip>{ADMISSION_LABEL[event.admission]}</Chip>}
          {event.familyFriendly && <Chip>Family friendly</Chip>}
        </ul>
      </div>

      <div className="col-start-2 grid gap-1.5 justify-items-start md:col-start-3 md:justify-items-end md:text-right">
        <span
          className={`font-typewriter text-tag tracking-label uppercase px-2 py-1 rounded-sm ${BADGE_STYLE[status.kind]}`}
        >
          {statusLabel(status)}
        </span>
        {note && (
          <span className="font-typewriter text-caption tracking-type text-muted-foreground">{note}</span>
        )}
      </div>
    </li>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="font-typewriter text-xs tracking-type px-2 py-0.5 rounded-sm border border-border text-muted-foreground">
      {children}
    </li>
  );
}
