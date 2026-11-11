import type { Metadata } from "next";
import Link from "next/link";
import { CopyEmailButton, EmailLink } from "@/components/ContactEmail";
import { Footer } from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/contact";
const DESCRIPTION =
  "Featured the Bureau on a podcast or in an article? Get in touch. Press, collaborations, corrections, privacy requests, and shop support.";

export const metadata: Metadata = {
  title: "Contact",
  description: DESCRIPTION,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Appalachian Cryptid Field Guide",
    description: DESCRIPTION,
    url: "https://appalachiancryptid.com/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact | Appalachian Cryptid Field Guide",
    description: DESCRIPTION,
  },
};

const ROUTING = [
  { label: "Address", value: CONTACT_EMAIL },
  { label: "Replies", value: "Within a few business days" },
  { label: "Office", value: "East Tennessee" },
] as const;

// Each reason carries a subject line, so the mailto arrives pre-sorted.
const REASONS: Array<{ title: string; subject: string; body: React.ReactNode }> = [
  {
    title: "Press, podcasts, and articles",
    subject: "Press",
    body: "If the Bureau came up on your show or in your writing, send me the link. I’m glad to answer questions, point you to sources, or talk Appalachian folklore on the record.",
  },
  {
    title: "Collaborations and invitations",
    subject: "Collaboration or invitation",
    body: "Folklorists, local historians, artists, writers, libraries, and fellow keepers of strange stories: if you have an idea, I’d like to hear it. The same goes for invitations to guest on a show, give a talk, or join an event.",
  },
  {
    title: "Corrections",
    subject: "Correction",
    body: "Spotted a wrong date, a missing credit, or a story attributed to the wrong people? Tell me and I’ll fix it.",
  },
  {
    title: "Privacy requests",
    subject: "Privacy request",
    body: (
      <>
        Ask about information you have submitted, or request that personal information be updated
        or removed. See the{" "}
        <Link href="/privacy" className="text-primary underline underline-offset-2">
          Privacy Policy
        </Link>{" "}
        for details.
      </>
    ),
  },
  {
    title: "Shop support",
    subject: "Shop support",
    body: (
      <>
        For a damaged, incorrect, delayed, or missing order, include the email address used at
        checkout and a brief description of what happened. Photos help for damaged or incorrect
        items. See the{" "}
        <Link href="/terms" className="text-primary underline underline-offset-2">
          Terms of Use &amp; Shop Terms
        </Link>
        .
      </>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        {/* ── Ink plate: who to write to and how ─────────────────────── */}
        <section
          className="plate-stock plate-ink relative border-b border-border bg-bureau-ink text-bureau-manila-light paper-texture"
          aria-labelledby="contact-heading"
        >
          <div className="relative z-2 mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pt-12 pb-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end lg:gap-14 lg:px-8 lg:pt-16">
            <div>
              <p className="mb-5 flex items-center gap-3.5 font-typewriter text-xs uppercase tracking-eyebrow text-bureau-rust-ink">
                <span className="block h-px w-10 bg-current opacity-70" aria-hidden="true" />
                Appalachian Cryptid Compendium
              </p>
              <h1
                id="contact-heading"
                className="mb-6 text-balance font-display text-hero font-bold leading-[1.08] tracking-tight text-bureau-paper"
              >
                Contact the Bureau
              </h1>
              <p className="mb-8 max-w-[54ch] text-base leading-relaxed text-bureau-manila-light/90">
                Talked about the Bureau on a podcast or in an article? I’d love to hear about it.
                Everything comes to one inbox, and I read every message myself.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <EmailLink
                  location="contact_hero"
                  className="inline-flex min-h-11 items-center border border-bureau-rust-ink px-5 font-typewriter text-xs uppercase tracking-label text-bureau-paper transition-colors hover:bg-bureau-rust-ink hover:text-bureau-ink"
                >
                  Email the Bureau
                  <span aria-hidden="true">{" →"}</span>
                </EmailLink>
                <CopyEmailButton
                  location="contact_hero"
                  className="inline-flex min-h-11 items-center font-typewriter text-xs uppercase tracking-label text-bureau-manila-light underline decoration-dotted underline-offset-4 hover:decoration-solid"
                />
              </div>
            </div>

            <dl className="border-t border-bureau-manila-light/60">
              {ROUTING.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3.5 border-b border-bureau-manila-light/15 py-2.5"
                >
                  <dt className="pt-0.5 font-typewriter text-caption uppercase tracking-label text-bureau-manila-light/75">
                    {row.label}
                  </dt>
                  <dd className="break-words text-sm leading-relaxed text-bureau-paper">
                    {row.label === "Address" ? (
                      <EmailLink
                        location="contact_address"
                        className="border-b border-dotted border-bureau-manila-light/45 hover:border-solid"
                      >
                        {row.value}
                      </EmailLink>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── What to write about: one row per reason ───────────────── */}
        <section aria-labelledby="reasons-heading" className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-x-14 lg:grid-cols-[12rem_minmax(0,1fr)]">
            <h2
              id="reasons-heading"
              className="mb-6 font-typewriter text-xs font-normal uppercase tracking-eyebrow text-muted-foreground lg:sticky lg:top-24 lg:self-start lg:pt-6"
            >
              What to write about
            </h2>

            <div className="max-w-2xl">
              <ul className="border-t border-border">
                {REASONS.map((r) => (
                  <li key={r.title} className="border-b border-border py-6">
                    <h3 className="mb-2 font-display text-xl font-bold leading-tight text-foreground">
                      {r.title}
                    </h3>
                    <p className="mb-3 text-base leading-relaxed text-foreground">{r.body}</p>
                    <EmailLink
                      location="contact_reason"
                      subject={r.subject}
                      className="inline-flex min-h-6 items-center font-typewriter text-xs tracking-type text-primary underline underline-offset-2 hover:no-underline"
                    >
                      <span className="sr-only">Email the Bureau, </span>
                      Subject: {r.subject}
                      <span aria-hidden="true">{" →"}</span>
                    </EmailLink>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-base leading-relaxed text-foreground">
                Have a sighting or a family story? That goes through the{" "}
                <Link href="/report" className="text-primary underline underline-offset-2">
                  witness report form
                </Link>{" "}
                instead, so it lands in the right folder. You can file anonymously.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
