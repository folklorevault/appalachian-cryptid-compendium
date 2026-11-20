import type { Metadata } from "next";
import Link from "next/link";
import { fetchEventBySlug } from "@/lib/sanity/fetchers";
import { Footer } from "@/components/Footer";
import { EventSubmitForm, type EventPrefill } from "./EventSubmitForm";

export const metadata: Metadata = {
  title: "Send an Event Update",
  description:
    "Running a cryptid festival, or spotted a date change? Tell the Bureau and the listing gets checked and updated.",
  alternates: { canonical: "/events/submit" },
  // A form isn't something to rank for; the calendar is.
  robots: { index: false, follow: true },
};

export default async function SubmitEventPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const { event: slug } = await searchParams;
  const event = slug ? await fetchEventBySlug(slug) : null;
  const prefill: EventPrefill | undefined = event
    ? { slug: event.slug.current, name: event.name, town: event.town, state: event.state }
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        <section
          className="plate-stock plate-green relative overflow-hidden border-b border-border bg-primary text-bureau-manila-light paper-texture"
          aria-labelledby="submit-heading"
        >
          <div className="relative z-[2] max-w-6xl mx-auto px-6 lg:px-8 pt-10 pb-12 lg:pt-14 lg:pb-14">
            <Link
              href={prefill ? `/events/${prefill.slug}` : "/events"}
              className="inline-block mb-8 font-typewriter text-xs tracking-type text-bureau-manila-light border-b border-dotted border-bureau-manila-light/60 hover:border-solid"
            >
              ← {prefill ? prefill.name : "All cryptid events"}
            </Link>
            <p className="flex items-center gap-3.5 mb-4.5 font-typewriter text-xs tracking-eyebrow uppercase text-bureau-green-pale">
              <span className="block w-10 h-px bg-current opacity-70" aria-hidden="true" />
              Bureau Field Calendar
            </p>
            <h1
              id="submit-heading"
              className="font-display font-bold text-hero leading-none tracking-tight text-bureau-paper text-balance max-w-[16ch] mb-5"
            >
              {prefill ? "Update this listing" : "Tell the Bureau"}
            </h1>
            <p className="font-sans text-base leading-relaxed text-bureau-manila-light max-w-[54ch]">
              {prefill
                ? `New dates, a changed link, or a correction for ${prefill.name}. The Bureau checks it against the source before the listing changes.`
                : "Run an event, or know of one the calendar is missing? Send it in. The Bureau checks every update against the source before the listing changes."}
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-10 pb-16">
          <EventSubmitForm prefill={prefill} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
