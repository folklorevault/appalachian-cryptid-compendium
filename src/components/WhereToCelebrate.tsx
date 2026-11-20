import Link from "next/link";
import type { SanityEvent } from "@/types/sanity";
import { eventStatus, formatEditionDates, statusLabel, todayISO, usually } from "@/lib/events";
import { stateName } from "@/lib/states";

/**
 * "Where to celebrate" box on cryptid and anomaly case files, listing the
 * events whose `subjects` reference this file. Replaces festival dates typed
 * into FAQ answers, which go stale. Renders nothing when no event lists it.
 * Pages using this should revalidate daily, since status depends on the date.
 */
export function WhereToCelebrate({ events }: { events: SanityEvent[] }) {
  if (events.length === 0) return null;
  const today = todayISO();

  return (
    <section
      aria-labelledby="where-to-celebrate"
      className="mb-10 rounded-sm border border-border border-t-4 border-t-primary bg-card px-5 pt-4 pb-2"
    >
      <h2
        id="where-to-celebrate"
        className="font-typewriter text-tag tracking-label uppercase text-primary mb-1"
      >
        Where to celebrate
      </h2>
      <ul className="divide-y divide-border">
        {events.map((event) => {
          const status = eventStatus(event, today);
          return (
            <li key={event._id} className="py-3">
              <p className="font-display font-bold text-xl leading-tight text-card-foreground">
                {event.name}
              </p>
              <p className="mt-0.5 mb-2.5 text-sm text-muted-foreground">
                {event.town}, {stateName(event.state)} ·{" "}
                {status.kind === "confirmed" ? formatEditionDates(status.edition) : usually(event)}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span
                  className={`font-typewriter text-tag tracking-label uppercase px-2 py-1 rounded-sm ${
                    status.kind === "confirmed"
                      ? "bg-primary text-primary-foreground"
                      : "border border-dashed border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {statusLabel(status)}
                </span>
                <Link
                  href={`/events/${event.slug.current}`}
                  className="font-typewriter text-xs tracking-type text-primary border-b border-dotted border-primary/60 hover:border-solid"
                >
                  {event.kind === "conference" ? "Conference" : "Festival"} listing →
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
