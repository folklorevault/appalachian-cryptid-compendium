import Link from "next/link";
import type { ReactNode } from "react";

// The About page has a built-in turn: Directive 001 is the Bureau talking, on
// the ink plate (Anomalies Desk / specimen-report stock), and "Off the Record"
// is the creator, on plain light paper in ordinary type. The layout carries
// the change of voice.

const ROUTING = [
  { label: "To", value: "All Readers, Field Personnel, and the Generally Curious" },
  { label: "From", value: "The Bureau" },
  { label: "Re", value: "What this is, who made it, and the rules we keep" },
] as const;

const TERRAIN = [
  {
    label: "The Hollers",
    body: "Steep ground, scattered houses, and sounds that carry farther than their source can be seen.",
  },
  {
    label: "The Coalfields",
    body: "Working towns, abandoned mine entrances, and places where the industrial history has remained unusually active.",
  },
  {
    label: "The Creek Beds and River Bottoms",
    body: "Waterways connecting woods, fields, and the occasional chicken yard. Useful routes for things with little regard for property lines.",
  },
  {
    label: "The Back Roads",
    body: "Where people encounter their unusual neighbors while trying to get home. Bridges, curves, and familiar stretches that become considerably less familiar after dark.",
  },
] as const;

const PROTOCOLS = [
  {
    label: "Origins and Citations",
    body: "These stories come from particular people and places. The Bureau credits the nations, communities, and storytellers they belong to, and notes how each telling reached us. A familiar story has often traveled a long way from the people who first told it.",
  },
  {
    label: "The Uncle Factor",
    body: "What your uncle saw on a back road one October is the good stuff. Family stories, local lore, and things people mention only after somebody else brings them up are the heart of the Bureau’s work. Academic folklore helps trace their history and connections.",
  },
  {
    label: "High Strangeness",
    body: "Some stories refuse to make sense. The Bureau leaves their peculiarities intact. A detail that seems out of place may be the reason the story has lasted.",
  },
  {
    label: "Restricted Circulation",
    body: "Some traditions carry limits on who shares them, when, and with whom. The Bureau respects those limits. For example, skinwalker traditions belong to the Diné (Navajo), and we leave their telling to Diné voices. They will not receive a Bureau creature entry. Hearing a story does not automatically make it ours to publish.",
  },
] as const;

const DESKS = [
  {
    desk: "Desk 01 // Biological",
    name: "Cryptids",
    href: "/",
    body: "Entities that leave footprints, keep a hunting pattern, and behave like animals nobody has gotten around to cataloguing.",
  },
  {
    desk: "Desk 02 // Environmental",
    name: "Anomalies",
    href: "/anomalies",
    body: "Events where the landscape itself malfunctions: lights that shouldn’t exist, sounds without a source, and roads that don’t go where they went yesterday.",
  },
] as const;

const bodyText = "mb-4 text-base leading-relaxed text-bureau-manila-light/90";
const typedLine = "font-typewriter text-sm tracking-type text-bureau-paper";

// One numbered article of the directive: rust number and filing label in the
// left column (sticky on wide screens), the statement and body on the right.
function Article({
  id,
  num,
  label,
  heading,
  children,
}: {
  id: string;
  num: string;
  label: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="grid scroll-mt-24 gap-x-14 gap-y-4 border-b border-bureau-manila-light/15 py-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-12"
    >
      <p className="flex items-baseline gap-3 lg:sticky lg:top-24 lg:flex-col lg:gap-2 lg:self-start">
        <span className="font-display text-title font-bold leading-none text-bureau-rust tabular-nums">
          {num}
        </span>
        <span className="font-typewriter text-xs uppercase tracking-eyebrow text-bureau-rust-ink">
          {label}
        </span>
      </p>
      <div className="max-w-2xl">
        <h2
          id={`${id}-heading`}
          className="mb-5 font-display text-xl font-bold leading-tight text-bureau-paper"
        >
          {heading}
        </h2>
        {children}
      </div>
    </section>
  );
}

// Bold-label entries (terrain, protocols) as a ruled two-up register.
function Register({ items }: { items: ReadonlyArray<{ label: string; body: string }> }) {
  return (
    <dl className="grid gap-x-8 border-t border-bureau-manila-light/15 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="border-b border-bureau-manila-light/15 py-4">
          <dt className="mb-1 text-base font-semibold text-bureau-paper">{item.label}</dt>
          <dd className="text-sm leading-relaxed text-bureau-manila-light/85">{item.body}</dd>
        </div>
      ))}
    </dl>
  );
}

export function AboutDirective() {
  return (
    <>
      {/* ── Directive 001: the Bureau speaking, on the ink ───────────── */}
      <section
        className="plate-stock plate-ink relative border-b border-border bg-bureau-ink text-bureau-manila-light paper-texture"
        aria-labelledby="about-heading"
      >
        <div className="relative z-2 mx-auto max-w-6xl px-6 pt-12 pb-16 lg:px-8 lg:pt-16">
          <header className="grid grid-cols-1 gap-10 pb-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end lg:gap-14">
            <div>
              <p className="mb-2 flex items-center gap-3.5 font-typewriter text-xs uppercase tracking-eyebrow text-bureau-rust-ink">
                <span className="block h-px w-10 bg-current opacity-70" aria-hidden="true" />
                Appalachian Cryptid Compendium
              </p>
              <p className="mb-5 font-typewriter text-xs tracking-type text-bureau-manila-light/80">
                Operational Directive 001 (Rev. 11/2026)
              </p>
              <h1
                id="about-heading"
                className="mb-6 text-balance font-display text-hero font-bold leading-[1.08] tracking-tight text-bureau-paper"
              >
                About the Bureau
              </h1>
              <p className="max-w-[54ch] text-base leading-relaxed text-bureau-manila-light/90">
                What we file, where we work, and the rules we keep while we do it.
              </p>
            </div>

            <dl className="border-t border-bureau-manila-light/60">
              {ROUTING.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[4rem_minmax(0,1fr)] gap-3.5 border-b border-bureau-manila-light/15 py-2.5"
                >
                  <dt className="pt-0.5 font-typewriter text-caption uppercase tracking-label text-bureau-manila-light/75">
                    {row.label}
                  </dt>
                  <dd className="text-sm leading-relaxed text-bureau-paper">{row.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <div className="border-t border-bureau-manila-light/60">
            <Article id="mandate" num="01" label="Mandate" heading="The porches are quieting.">
              <p className={bodyText}>
                The best stories in these mountains were never written down. They were told on
                porches, at the local co-op, and on long drives home after dark, usually by
                somebody’s strange uncle and usually with the porch light off.
              </p>
              <p className={bodyText}>
                That kind of thing isn’t printed, it’s told. And tellers pass on. Forum threads go
                dark. Small-town papers fold and take their archives with them.
              </p>
              <p className={`${bodyText} mb-0`}>
                The Bureau was made to get these stories into a file before they go. Each entry is
                documented, cross-referenced, and filed, with the same care whether the subject is
                a tall shape in the woods or a light that keeps showing up over the same field.
              </p>
            </Article>

            <Article id="terrain" num="02" label="Terrain" heading="Geography sets the rules here.">
              <Register items={TERRAIN} />
              <div className="mt-8 border-l-2 border-bureau-rust-ink pl-5">
                <p className="mb-1.5 font-typewriter text-tag uppercase tracking-label text-bureau-rust-ink">
                  Field Advisory: Boundaries
                </p>
                <p className="text-sm leading-relaxed text-bureau-paper">
                  Many of these places sit on private land. Locations in Bureau files are given to
                  the nearest public landmark. Purple paint means no trespassing. The Bureau honors
                  it, and so should you.
                </p>
              </div>
            </Article>

            <Article id="protocols" num="03" label="Protocols" heading="A few working rules.">
              <Register items={PROTOCOLS} />
            </Article>

            <Article
              id="classification"
              num="04"
              label="Classification"
              heading="Two desks: things that leave tracks, and things that don’t."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {DESKS.map((d) => (
                  <div key={d.name} className="border border-bureau-manila-light/25 p-5">
                    <p className="mb-2 font-typewriter text-tag uppercase tracking-label text-bureau-rust-ink">
                      {d.desk}
                    </p>
                    <h3 className="mb-2 font-display text-xl font-bold leading-tight text-bureau-paper">
                      <Link
                        href={d.href}
                        className="border-b border-dotted border-bureau-manila-light/45 hover:border-solid"
                      >
                        {d.name}
                      </Link>
                    </h3>
                    <p className="text-sm leading-relaxed text-bureau-manila-light/85">{d.body}</p>
                  </div>
                ))}
              </div>
            </Article>

            <Article id="witness-security" num="05" label="Witness Security" heading="We protect our sources.">
              <p className={bodyText}>
                Reports can be filed anonymously. Only what you saw is required. Name and email are
                optional. If you give your name, only your initials appear with your report, and
                your email is never published. Every report is read, and most are published in the
                witness reports on the matching cryptid or anomaly page.
              </p>
              <p className={`${typedLine} mb-7`}>
                We’re not here to question your sanity. We’re here to record your data.
              </p>
              <Link
                href="/report"
                className="inline-flex min-h-11 items-center border border-bureau-rust-ink px-5 font-typewriter text-xs uppercase tracking-label text-bureau-paper transition-colors hover:bg-bureau-rust-ink hover:text-bureau-ink"
              >
                File a Report
                <span aria-hidden="true">{" →"}</span>
              </Link>
            </Article>

            <Article id="disclosure" num="06" label="Disclosure" heading="A note on what you are reading.">
              <dl className="mb-6 grid grid-cols-[8rem_minmax(0,1fr)] gap-3.5 border-y border-bureau-manila-light/15 py-2.5">
                <dt className="pt-0.5 font-typewriter text-caption uppercase tracking-label text-bureau-manila-light/75">
                  Classification
                </dt>
                <dd className="font-typewriter text-sm uppercase tracking-type text-bureau-rust-ink">
                  Folklore / Entertainment
                </dd>
              </dl>
              <p className={bodyText}>
                The Bureau is not a government agency. It has no budget, no badges, and no field
                office beyond a desk in East Tennessee.
              </p>
              <p className={bodyText}>
                The stories are real stories. People told them, believed them, and passed them
                down, and many have a documented history the Bureau sources as carefully as it
                can. Whether the creatures in them are real is a question the Bureau leaves to you.
              </p>
              <p className={bodyText}>
                Everything else, the memos, the stamps, the forms in triplicate, is for fun. This
                site is folklore-based entertainment. Read it the way you’d listen to a good story
                on a dark porch: seriously enough to enjoy it.
              </p>
              <p className={typedLine}>
                The Bureau regrets any confusion. The Bureau does not regret the forms.
              </p>
            </Article>
          </div>

          <p className="mt-14 flex items-center gap-4 font-typewriter text-tag uppercase tracking-eyebrow text-bureau-manila-light/70">
            <span className="h-px flex-1 bg-bureau-manila-light/30" aria-hidden="true" />
            End of Directive 001
            <span className="h-px flex-1 bg-bureau-manila-light/30" aria-hidden="true" />
          </p>
        </div>
      </section>

      {/* ── Off the Record: the creator, in plain type on the light ──── */}
      <section aria-labelledby="off-the-record-heading" className="bg-background">
        <div className="mx-auto grid max-w-6xl gap-x-14 px-6 py-16 lg:grid-cols-[12rem_minmax(0,1fr)] lg:px-8 lg:py-20">
          <div className="max-w-2xl lg:col-start-2">
            <h2
              id="off-the-record-heading"
              className="font-display text-xl font-bold leading-tight text-foreground"
            >
              Off the Record
            </h2>
            <p className="mt-1 mb-8 text-sm italic text-muted-foreground">
              The following is not an official Bureau document.
            </p>

            <div className="space-y-5 text-base leading-relaxed text-foreground">
              <p>Hey. I’m Katy, and I am the creator of the Appalachian Cryptid Compendium.</p>
              <p>
                I was raised in the Appalachian Mountains, just like my family was, at least as far
                back as I have traced. I come from a long line of storytellers, writers, and
                creators. I also come from a long line of endlessly curious people who wondered
                what was out there. I have a lifelong interest in the stranger corners of people
                and places.
              </p>
              <p>
                I started this for a simpler reason than monsters. I wanted to make something
                joyful, something that would bring happiness to others, and that honored where
                I’m from.
              </p>
              <p>
                I use AI as a collaborator in the research, writing, image generation, and
                development of the site.
              </p>
              <p>
                The Bureau voice is meant to be funny. The care I put into this is not. I check
                sources, I credit the people and nations these stories come from, and when I can’t
                verify something, I say so. Please{" "}
                <Link href="/contact" className="text-primary underline underline-offset-2">
                  reach out
                </Link>{" "}
                with comments or questions, or if you’d like to collaborate.
              </p>
              <p>
                If you have a story, I want it.{" "}
                <Link href="/report" className="text-primary underline underline-offset-2">
                  File a report
                </Link>
                , and it goes in the folder with the rest. I do read them all. Even the one where
                the Grafton Monster farted on that one person and it, allegedly, stank.
              </p>
            </div>

            <p className="mt-10 font-display text-xl font-bold text-foreground">Katy</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Appalachian Archivist and Unusual Woman With Several Legitimate Operations
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
