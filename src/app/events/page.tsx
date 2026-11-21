import type { Metadata } from "next";
import Link from "next/link";
import { fetchEvents } from "@/lib/sanity/fetchers";
import { EventsDirectory } from "@/components/EventsDirectory";
import { Footer } from "@/components/Footer";
import { StructuredData, createBreadcrumbSchema } from "@/components/StructuredData";
import {
  dateBlock,
  groupEventsByMonth,
  seasonYear,
  todayISO,
} from "@/lib/events";
import { stateName } from "@/lib/states";
import { SHARE_IMAGE } from "@/lib/share-image";

// Status ("Confirmed", "Dates not announced") depends on today's date, not
// just on Sanity, so rebuild daily even when no webhook fires.
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const year = seasonYear();
  const title = `The Appalachian and Greater South Cryptid Events Directory (${year})`;
  const description =
    "A checked calendar of cryptid festivals and conferences across Appalachia and the South, from Mothman to Bigfoot to the Woodbooger, with dates and whether they're confirmed.";
  return {
    title,
    description,
    alternates: { canonical: "/events" },
    openGraph: {
      title,
      description,
      url: "https://appalachiancryptid.com/events",
      images: [SHARE_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE] },
  };
}

export default async function EventsPage() {
  const today = todayISO();
  const year = seasonYear(today);
  const events = await fetchEvents();
  const months = groupEventsByMonth(events, today);

  const entries = months.flatMap((m) => m.entries);
  const confirmedCount = entries.filter((e) => e.status.kind === "confirmed").length;
  const nextUp = entries.filter((e) => e.status.kind !== "lapsed").slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <StructuredData
        type="breadcrumb"
        data={createBreadcrumbSchema([
          { name: "Field Guide", url: "/" },
          { name: "Cryptid Events" },
        ])}
      />
      <main id="main-content">
        <EventsDirectory
          months={months}
          intro={
            <>
              <p className="flex items-center gap-3.5 mb-4.5 font-typewriter text-xs tracking-eyebrow uppercase text-bureau-green-pale">
                <span className="block w-10 h-px bg-current opacity-70" aria-hidden="true" />
                Bureau Field Calendar · {year} Season
              </p>
              <h1
                id="events-heading"
                className="font-display font-bold text-hero leading-none tracking-tight text-bureau-paper text-balance max-w-4xl mb-6"
              >
                The Appalachian and Greater South Cryptid Events Directory
              </h1>
              <p className="font-sans text-base leading-relaxed text-bureau-manila-light max-w-[54ch] mb-3.5">
                Every town that throws a party for its monster, checked against its source before it
                goes in the book. Grouped by month, filed by state.
              </p>
              {entries.length > 0 && (
                <p className="mt-5 mb-5.5 pt-3.5 max-w-[54ch] text-pretty border-t border-dashed border-bureau-manila-light/35 font-typewriter text-sm tracking-type text-bureau-paper">
                  <span className="font-display font-bold text-2xl mr-1 tabular-nums">
                    {entries.length}
                  </span>{" "}
                  events on the calendar.{" "}
                  <span className="text-bureau-manila-light">
                    {confirmedCount === 0
                      ? `No ${year} dates announced yet.`
                      : `${confirmedCount} with dates announced so far.`}
                  </span>
                </p>
              )}
            </>
          }
          nextUp={
            nextUp.length > 0 ? (
              <nav aria-label="Next on the calendar">
                <p className="font-typewriter text-tag tracking-label uppercase text-bureau-green-pale mb-2">
                  Next on the calendar
                </p>
                <ul className="border-t border-bureau-manila-light/30">
                  {nextUp.map(({ event, status }) => {
                    const block = dateBlock(event, status);
                    return (
                      <li
                        key={event._id}
                        className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3.5 items-baseline py-3 border-b border-bureau-manila-light/25"
                      >
                        <span aria-hidden="true" className="font-display font-bold text-xl leading-none text-bureau-paper tabular-nums">
                          {status.kind === "confirmed" ? block.main : block.month}
                          <span className="block mt-1 font-typewriter font-normal text-tag tracking-label uppercase text-bureau-green-pale">
                            {status.kind === "confirmed" ? block.month : "Usually"}
                          </span>
                        </span>
                        <span className="min-w-0">
                          <Link
                            href={`/events/${event.slug.current}`}
                            className="font-typewriter text-sm tracking-type text-bureau-paper hover:underline underline-offset-4"
                          >
                            {event.name}
                          </Link>
                          <span className="block text-xs text-bureau-manila-light">
                            {event.town}, {stateName(event.state)} · {block.label}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ) : null
          }
        />
      </main>
      <Footer />
    </div>
  );
}
