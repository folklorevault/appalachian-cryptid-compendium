// Event status and calendar grouping for the events directory. Status is
// worked out from an event's editions every time a page renders, never stored,
// so nothing can sit on "Confirmed" after the weekend has passed. Pages using
// this should revalidate daily (`export const revalidate = 86400`), because
// the answer changes with the date even when Sanity doesn't.

import type { SanityEvent, SanityEventEdition } from "@/types/sanity";

export type EventStatus =
  /** Dates announced for an edition that hasn't finished yet. */
  | { kind: "confirmed"; edition: SanityEventEdition }
  /** Ran recently (or has no history on file); next dates not out yet. */
  | { kind: "expected"; lastHeld?: SanityEventEdition }
  /** Hasn't run in over a year. */
  | { kind: "lapsed"; lastHeld: SanityEventEdition };

export interface DatedEvent {
  event: SanityEvent;
  status: EventStatus;
}

export interface EventMonth {
  /** 1–12 */
  month: number;
  entries: DatedEvent[];
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTH_ABBR = MONTH_NAMES.map((m) => m.slice(0, 3));

/**
 * Today as YYYY-MM-DD in Eastern time, where nearly every listed event is.
 * Using UTC would flip an event to "past" on its last evening.
 */
export function todayISO(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

const endOf = (e: SanityEventEdition) => e.endDate ?? e.startDate;

export function eventStatus(event: SanityEvent, today = todayISO()): EventStatus {
  const editions = event.editions ?? [];
  const currentYear = Number(today.slice(0, 4));

  // ISO dates compare correctly as strings.
  const upcoming = editions
    .filter((e) => e.startDate && endOf(e)! >= today)
    .sort((a, b) => a.startDate!.localeCompare(b.startDate!));
  if (upcoming.length > 0) return { kind: "confirmed", edition: upcoming[0] };

  const past = editions
    .filter((e) => (e.startDate ? endOf(e)! < today : e.year < currentYear))
    .sort((a, b) => b.year - a.year || (b.startDate ?? "").localeCompare(a.startDate ?? ""));
  const lastHeld = past[0];

  if (lastHeld && lastHeld.year < currentYear - 1) return { kind: "lapsed", lastHeld };
  return { kind: "expected", lastHeld };
}

/** The month an event files under: its confirmed start month, else its usual month. */
export function eventMonth(event: SanityEvent, status: EventStatus): number {
  return status.kind === "confirmed"
    ? Number(status.edition.startDate!.slice(5, 7))
    : event.usualMonth;
}

const STATUS_ORDER: Record<EventStatus["kind"], number> = {
  confirmed: 0,
  expected: 1,
  lapsed: 2,
};

/**
 * Groups events into a rolling calendar that starts at the current month, so
 * what's coming up is always at the top. Within a month: confirmed events by
 * date, then expected, then lapsed, each alphabetical.
 */
export function groupEventsByMonth(events: SanityEvent[], today = todayISO()): EventMonth[] {
  const thisMonth = Number(today.slice(5, 7));
  const byMonth = new Map<number, DatedEvent[]>();

  for (const event of events) {
    const status = eventStatus(event, today);
    const month = eventMonth(event, status);
    byMonth.set(month, [...(byMonth.get(month) ?? []), { event, status }]);
  }

  return [...byMonth.entries()]
    .sort(([a], [b]) => ((a - thisMonth + 12) % 12) - ((b - thisMonth + 12) % 12))
    .map(([month, entries]) => ({
      month,
      entries: entries.sort(
        (a, b) =>
          STATUS_ORDER[a.status.kind] - STATUS_ORDER[b.status.kind] ||
          (a.status.kind === "confirmed" && b.status.kind === "confirmed"
            ? a.status.edition.startDate!.localeCompare(b.status.edition.startDate!)
            : 0) ||
          a.event.name.localeCompare(b.event.name)
      ),
    }));
}

const parts = (iso: string) => ({
  year: Number(iso.slice(0, 4)),
  month: Number(iso.slice(5, 7)),
  day: Number(iso.slice(8, 10)),
});

/**
 * "Mar 6–7, 2027", "Sep 30 – Oct 2, 2027", "May 2, 2026", or just the year when
 * a past edition has no dates on file.
 */
export function formatEditionDates(edition: SanityEventEdition): string {
  if (!edition.startDate) return String(edition.year);
  const s = parts(edition.startDate);
  const startLabel = `${MONTH_ABBR[s.month - 1]} ${s.day}`;
  if (!edition.endDate || edition.endDate === edition.startDate) {
    return `${startLabel}, ${s.year}`;
  }
  const e = parts(edition.endDate);
  if (e.year !== s.year) {
    return `${startLabel}, ${s.year} – ${MONTH_ABBR[e.month - 1]} ${e.day}, ${e.year}`;
  }
  if (e.month !== s.month) {
    return `${startLabel} – ${MONTH_ABBR[e.month - 1]} ${e.day}, ${s.year}`;
  }
  return `${startLabel}–${e.day}, ${s.year}`;
}
