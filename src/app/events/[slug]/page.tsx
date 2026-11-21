import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchEventBySlug, fetchEventSlugs } from "@/lib/sanity/fetchers";
import { Footer } from "@/components/Footer";
import {
  StructuredData,
  createBreadcrumbSchema,
  createEventSchema,
} from "@/components/StructuredData";
import {
  eventStatus,
  formatDay,
  formatEditionDates,
  seasonYear,
  statusLabel,
  todayISO,
  usually,
  type EventStatus,
} from "@/lib/events";
import { stateName } from "@/lib/states";
import { urlFor } from "@/lib/sanity/image";
import type { SanityEvent } from "@/types/sanity";
import { SHARE_IMAGE } from "@/lib/share-image";

// Status depends on today's date as well as Sanity, so rebuild daily.
export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await fetchEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

/** The year searchers attach to this event: its confirmed edition, else the coming season. */
const pageYear = (status: EventStatus, today: string) =>
  status.kind === "confirmed" ? status.edition.year : seasonYear(today);

/** Plates of the creatures the event celebrates, for Event markup (Google wants a representative image). */
const eventImages = (event: SanityEvent) =>
  (event.subjects ?? [])
    .filter((s) => s.image?.asset)
    .slice(0, 3)
    .map((s) => urlFor(s.image).width(1200).height(630).fit("crop").format("jpg").url());

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);
  if (!event) return {};

  const today = todayISO();
  const status = eventStatus(event, today);
  const year = pageYear(status, today);
  const place = `${event.town}, ${stateName(event.state)}`;
  const title = `${event.name} ${year}`;
  const description =
    event.summary ??
    (status.kind === "confirmed"
      ? `${event.name} ${year}: ${formatEditionDates(status.edition)} in ${place}. Dates checked against the source by the Bureau.`
      : `${event.name} in ${place}. ${usually(event)}; ${year} dates not announced yet. The Bureau lists them as soon as they are.`);

  // The celebrated cryptid's plate when there is one, else the site card.
  const plate = eventImages(event)[0];
  const shareImages = plate
    ? [{ url: plate, width: 1200, height: 630, alt: `${event.name}, ${place}` }]
    : [SHARE_IMAGE];

  return {
    title,
    description,
    alternates: { canonical: `/events/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://appalachiancryptid.com/events/${slug}`,
      images: shareImages,
    },
    twitter: { card: "summary_large_image", title, description, images: shareImages },
  };
}

const ADMISSION_LABEL = {
  free: "Free",
  ticketed: "Ticketed",
  mixed: "Free entry, some paid events",
} as const;

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);
  if (!event) notFound();

  const today = todayISO();
  const status = eventStatus(event, today);
  const year = pageYear(status, today);
  const editions = [...(event.editions ?? [])].sort((a, b) => b.year - a.year);

  return (
    <div className="min-h-screen bg-background">
      {status.kind === "confirmed" && (
        <StructuredData
          type="event"
          data={createEventSchema({
            name: `${event.name} ${status.edition.year}`,
            slug,
            summary: event.summary,
            startDate: status.edition.startDate!,
            endDate: status.edition.endDate,
            town: event.town,
            state: event.state,
            // No organizer on file: the festival's own site stands in for it.
            organizer: event.organizer ?? (event.officialUrl ? event.name : undefined),
            officialUrl: event.officialUrl,
            admission: event.admission,
            images: eventImages(event),
            performers: event.performers,
          })}
        />
      )}
      <StructuredData
        type="breadcrumb"
        data={createBreadcrumbSchema([
          { name: "Field Guide", url: "/" },
          { name: "Cryptid Events", url: "/events" },
          { name: event.name },
        ])}
      />

      <main id="main-content">
        <section
          className="plate-stock plate-green relative overflow-hidden border-b border-border bg-primary text-bureau-manila-light paper-texture"
          aria-labelledby="event-heading"
        >
          <div className="relative z-[2] max-w-6xl mx-auto px-6 lg:px-8 pt-10 pb-12 lg:pt-14 lg:pb-14">
            <Link
              href="/events"
              className="inline-block mb-8 font-typewriter text-xs tracking-type text-bureau-manila-light border-b border-dotted border-bureau-manila-light/60 hover:border-solid"
            >
              ← All cryptid events
            </Link>
            <p className="flex items-center gap-3.5 mb-4.5 font-typewriter text-xs tracking-eyebrow uppercase text-bureau-green-pale">
              <span className="block w-10 h-px bg-current opacity-70" aria-hidden="true" />
              Bureau Field Calendar · {event.kind === "conference" ? "Conference" : "Festival"}
            </p>
            <h1
              id="event-heading"
              className="font-display font-bold text-hero leading-none tracking-tight text-bureau-paper text-balance max-w-[18ch] mb-5"
            >
              {event.name}
            </h1>
            <p className="font-typewriter text-sm tracking-type text-bureau-manila-light mb-6">
              {event.town}, {stateName(event.state)}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-4 border-t border-dashed border-bureau-manila-light/35 max-w-[54ch]">
              <p className="font-display font-bold text-2xl text-bureau-paper">
                {status.kind === "confirmed"
                  ? formatEditionDates(status.edition)
                  : usually(event)}
              </p>
              <span
                className={`font-typewriter text-tag tracking-label uppercase px-2 py-1 rounded-sm ${
                  status.kind === "confirmed"
                    ? "bg-bureau-paper text-primary"
                    : "border border-dashed border-bureau-manila-light/70 text-bureau-manila-light"
                }`}
              >
                {status.kind === "expected" ? `${year} dates not announced` : statusLabel(status)}
              </span>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-10 pb-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-14">
            <div>
              {event.summary && (
                <p className="text-base leading-relaxed text-foreground max-w-[60ch] mb-8">
                  {event.summary}
                </p>
              )}
              <h2 className="font-display font-bold text-xl text-foreground pb-2 border-b-2 border-foreground">
                The record
              </h2>
              <dl>
                <Field label="When">
                  {status.kind === "confirmed" ? (
                    <>
                      {formatEditionDates(status.edition)}
                      <Note>Verified {formatDay(status.edition.verifiedAt)}</Note>
                    </>
                  ) : (
                    <>
                      {usually(event)}
                      <Note>
                        {status.kind === "lapsed"
                          ? `Hasn't run since ${status.lastHeld.year}.`
                          : `${year} dates not announced yet.`}
                      </Note>
                    </>
                  )}
                </Field>
                <Field label="Where">
                  {event.town}, {stateName(event.state)}
                </Field>
                <Field label="Celebrates">
                  {event.subjects?.length ? (
                    <span className="flex flex-wrap gap-x-3 gap-y-1">
                      {event.subjects.map((s) => (
                        <Link
                          key={s._id}
                          href={`/${s._type}/${s.slug.current}`}
                          className="text-primary underline underline-offset-4 decoration-1 hover:decoration-2"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </span>
                  ) : (
                    event.legend
                  )}
                </Field>
                {event.organizer && <Field label="Organizer">{event.organizer}</Field>}
                {event.admission && <Field label="Admission">{ADMISSION_LABEL[event.admission]}</Field>}
                {event.familyFriendly && <Field label="Family friendly">Yes</Field>}
                {event.officialUrl && (
                  <Field label="Official link">
                    <a
                      href={event.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-4 decoration-1 hover:decoration-2 break-all"
                    >
                      {new URL(event.officialUrl).hostname.replace(/^www\./, "")}
                    </a>
                  </Field>
                )}
              </dl>
            </div>

            <aside aria-labelledby="dates-on-file">
              <h2
                id="dates-on-file"
                className="font-display font-bold text-xl text-foreground pb-2 border-b-2 border-foreground"
              >
                Dates on file
              </h2>
              {editions.length > 0 ? (
                <ul>
                  {editions.map((e) => (
                    <li key={e._key} className="py-3 border-b border-border">
                      <p className="text-sm text-foreground">
                        <span className="font-display font-bold text-base mr-2 tabular-nums">{e.year}</span>
                        {e.startDate ? formatEditionDates(e) : "Dates not recorded"}
                      </p>
                      <p className="font-typewriter text-caption tracking-type text-muted-foreground">
                        Verified {formatDay(e.verifiedAt)} ·{" "}
                        <a
                          href={e.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:text-foreground"
                        >
                          source
                        </a>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-3 text-sm text-muted-foreground border-b border-border">
                  No dated years on file yet.
                </p>
              )}
              <p className="mt-6 font-typewriter text-xs tracking-type text-muted-foreground">
                Running this event, or spotted a date change?{" "}
                <Link
                  href={`/events/submit?event=${slug}`}
                  className="text-foreground border-b border-dotted border-foreground/60 hover:border-solid"
                >
                  Tell the Bureau
                </Link>
              </p>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-3 border-b border-border sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
      <dt className="font-typewriter text-tag tracking-label uppercase text-muted-foreground sm:pt-1">
        {label}
      </dt>
      <dd className="text-base text-foreground">{children}</dd>
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <span className="block font-typewriter text-caption tracking-type text-muted-foreground">
      {children}
    </span>
  );
}

