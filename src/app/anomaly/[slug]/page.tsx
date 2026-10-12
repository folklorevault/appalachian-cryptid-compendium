import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { truncateMeta, toParagraphs } from "@/lib/utils";
import { IncidentLog } from "@/components/IncidentLog";
import { SightingDistribution } from "@/components/SightingDistribution";
import { ShareButtons } from "@/components/ShareButtons";
import { BackToTop } from "@/components/BackToTop";
import {
  Clock,
  Zap,
  Ghost,
  Skull,
  Eye,
  Volume2,
  Cloud,
  MapPinned,
} from "lucide-react";
import {
  StructuredData,
  createAnomalyArticleSchema,
  createBreadcrumbSchema,
  createFAQPageSchema,
  createSightingListSchema,
} from "@/components/StructuredData";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { DeferredMount } from "@/components/DeferredMount";
import { Footer } from "@/components/Footer";
import {
  fetchAnomalyBySlug,
  fetchAnomalySlugs,
  fetchRelatedAnomalies,
  fetchBulletinsReferencing,
} from "@/lib/sanity/fetchers";
import { urlFor } from "@/lib/sanity/image";
import {
  formatFileNo,
  ledgerDate,
  parseTitledBlocks,
  parseWitness,
  splitLines,
} from "@/lib/anomalyFile";
import { stateName } from "@/lib/states";
import { BULLETIN_CATEGORIES } from "@/lib/bulletins";
import { formatLedgerDate } from "@/lib/utils";
import type { AnomalyType, SanityAnomalyListItem, SanityBulletinListItem } from "@/types/sanity";

// Icon mapping for anomaly types
const typeIcons: Record<AnomalyType, typeof Zap> = {
  Lights: Zap,
  Hauntings: Ghost,
  Curses: Skull,
  "Omen Events": Eye,
  "Sounds/Calls": Volume2,
  "Weather Oddities": Cloud,
  "Time Weirdness": Clock,
  Places: MapPinned,
};

// ── Static params ────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await fetchAnomalySlugs();
  return slugs.map((slug) => ({ slug }));
}

// ── SEO metadata ─────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string } & Record<string, string | string[]>>;
}): Promise<Metadata> {
  const { slug } = await params;
  const anomaly = await fetchAnomalyBySlug(slug);

  if (!anomaly) {
    return { title: "Case File Not Found" };
  }

  // Hand-authored metaTitle is used verbatim (title.absolute skips the root
  // "| Appalachian Cryptids List" template); the fallback keeps it.
  const title = anomaly.metaTitle
    ? { absolute: anomaly.metaTitle }
    : anomaly.name;

  // Prefer editor-authored meta description. Else build a fallback from
  // subhead/description + location.
  const rawDesc = anomaly.subhead || anomaly.description || `Learn about ${anomaly.name}`;
  const withLocation = `${rawDesc} Reported near ${anomaly.location}.`;
  const description = anomaly.metaDescription || truncateMeta(withLocation);

  const ogImageUrl = anomaly.image
    ? urlFor(anomaly.image)
        .width(1200)
        .height(630)
        .fit("crop")
        .quality(80)
        .auto("format")
        .url()
    : "https://appalachiancryptid.com/og-image.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: `/anomaly/${slug}`,
    },
    openGraph: {
      title: `${anomaly.name} - Anomalies Desk`,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: "article",
      url: `https://appalachiancryptid.com/anomaly/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${anomaly.name} - Anomalies Desk`,
      description,
      images: [ogImageUrl],
    },
  };
}

// ── Page ─────────────────────────────────────────────────

export default async function AnomalyDetailPage({
  params,
}: {
  params: Promise<{ slug: string } & Record<string, string | string[]>>;
}) {
  const { slug } = await params;
  const anomaly = await fetchAnomalyBySlug(slug);

  if (!anomaly) {
    notFound();
  }

  const [relatedAnomalies, referencingBulletins] = await Promise.all([
    fetchRelatedAnomalies(
      anomaly.slug?.current,
      anomaly.anomalyType,
      anomaly.region
    ),
    fetchBulletinsReferencing(anomaly._id),
  ]);

  const imageUrl = anomaly.image
    ? urlFor(anomaly.image)
        .width(800)
        .height(1200)
        .fit("crop")
        .quality(70)
        .auto("format")
        .url()
    : "";



  const fileNo = anomaly.fileNumber ? formatFileNo(anomaly.fileNumber) : null;
  // IncidentLog prints this on the transmission slip; match the ledger's numbering.
  const caseNumber = fileNo ? `AD-${fileNo}` : "AD-PENDING";

  const TypeIcon = typeIcons[anomaly.anomalyType] || Zap;
  const firstDocumented = ledgerDate(anomaly);

  const theories = anomaly.theories ? parseTitledBlocks(anomaly.theories) : [];
  const places = anomaly.relatedLocations ? parseTitledBlocks(anomaly.relatedLocations) : [];
  const hasBriefings = Boolean(anomaly.declassifiedBriefings?.length);
  const hasWitnesses = Boolean(anomaly.witnesses?.length);
  const hasDeskNotes = Boolean(anomaly.noteOnRecord || anomaly.bureauNotes);
  const phenomenon = anomaly.phenomenon ? splitLines(anomaly.phenomenon) : [];

  // "In this file" index — only sections this file actually has, in page order.
  const contents = [
    anomaly.fileAbstract && { id: "file-abstract", label: "File abstract" },
    ...(anomaly.caseFileSections ?? []).map((section) => ({
      id: `cfs-${section._key}`,
      label: section.heading,
    })),
    anomaly.sightings?.length && { id: "sightings-heading", label: "Sightings" },
    anomaly.phenomenon && { id: "the-phenomenon", label: "The phenomenon" },
    hasWitnesses && { id: "witness-accounts", label: "Witness accounts" },
    (theories.length > 0 || places.length > 0) && { id: "on-file", label: "On file" },
    hasBriefings && { id: "transmissions-received", label: "Transmissions received" },
    hasDeskNotes && { id: "from-the-desk", label: "From the desk" },
  ].filter((item): item is { id: string; label: string } => Boolean(item));

  return (
    <div className="min-h-screen bg-background paper-texture">
      <StructuredData
        type="article"
        data={createAnomalyArticleSchema({
          name: anomaly.name,
          description: anomaly.subhead || anomaly.description || "",
          image: imageUrl,
          slug: anomaly.slug?.current,
          tags: anomaly.tags,
          location: anomaly.location,
        })}
      />
      <StructuredData
        type="breadcrumb"
        data={createBreadcrumbSchema([
          { name: "Directory", url: "/" },
          { name: "Anomalies Desk", url: "/anomalies" },
          { name: anomaly.name },
        ])}
      />
      {anomaly.declassifiedBriefings &&
        anomaly.declassifiedBriefings.length > 0 && (
          <StructuredData
            type="faq"
            data={createFAQPageSchema(anomaly.declassifiedBriefings)}
          />
        )}
      {anomaly.sightings && anomaly.sightings.length > 0 && (
        <StructuredData
          type="itemList"
          data={createSightingListSchema(anomaly.name, anomaly.sightings)}
        />
      )}

      <main id="main-content">
        {/* ── Cover: ink plate, same stock as the desk ledger ────────── */}
        <section
          className="plate-stock plate-ink relative border-b border-border bg-bureau-ink text-bureau-manila-light paper-texture"
          aria-labelledby="anomaly-heading"
        >
          <div className="relative z-2 max-w-6xl mx-auto px-6 lg:px-8">
            <Breadcrumb className="pt-4">
              <BreadcrumbList className="font-typewriter uppercase tracking-label text-xs text-bureau-manila-light/80">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="hover:text-bureau-paper">
                    <Link href="/">Directory</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="hover:text-bureau-paper">
                    <Link href="/anomalies">Anomalies Desk</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-bureau-paper">{anomaly.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid gap-8 pt-10 pb-12 md:grid-cols-[minmax(0,1fr)_240px] md:items-end md:gap-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:pt-12 lg:pb-14">
              <div className="min-w-0">
                {fileNo && (
                  <p className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1 mb-3">
                    <span className="font-display font-bold text-7xl lg:text-8xl leading-none text-bureau-rust tabular-nums">
                      {fileNo}
                    </span>
                    <span className="font-typewriter text-xs tracking-eyebrow uppercase text-bureau-rust-ink">
                      Anomaly file AD-{fileNo}
                    </span>
                  </p>
                )}
                <h1
                  id="anomaly-heading"
                  className="font-display font-bold text-hero leading-[1.08] tracking-tight text-bureau-paper text-balance mb-5"
                >
                  {anomaly.name}
                </h1>
                {anomaly.subhead && (
                  <p className="font-sans text-base leading-relaxed text-bureau-manila-light/90 max-w-[56ch] mb-6">
                    {anomaly.subhead}
                  </p>
                )}

                <dl className="grid grid-cols-2 gap-x-6 gap-y-3.5 max-w-2xl pt-4 border-t border-dashed border-bureau-manila-light/30 font-typewriter text-sm tracking-type sm:grid-cols-4">
                  <CoverFact label="Type">
                    <span className="uppercase text-bureau-rust-ink">
                      {anomaly.anomalyType.replace("/", " / ")}
                    </span>
                  </CoverFact>
                  <CoverFact label="Status">{anomaly.status}</CoverFact>
                  {firstDocumented && (
                    <CoverFact label="First documented">{firstDocumented}</CoverFact>
                  )}
                  {anomaly.region && (
                    <CoverFact label="Region">{stateName(anomaly.region)}</CoverFact>
                  )}
                  {anomaly.location && (
                    <CoverFact label="Location" wide>
                      {anomaly.location}
                    </CoverFact>
                  )}
                  {anomaly.frequency && (
                    <CoverFact label="Frequency" wide>
                      {anomaly.frequency}
                    </CoverFact>
                  )}
                </dl>
              </div>

              <div className="w-full max-w-[220px] md:max-w-none">
                <div className="aspect-3/4 max-w-full border border-bureau-manila-light/35 p-1.5">
                  <div className="relative h-full w-full overflow-hidden bg-bureau-ink-dark">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={
                          (anomaly.imageAlt || anomaly.name).length > 125
                            ? (anomaly.imageAlt || anomaly.name).slice(0, 122) + "..."
                            : anomaly.imageAlt || anomaly.name
                        }
                        fill
                        priority
                        sizes="(max-width: 768px) 220px, (max-width: 1024px) 240px, 280px"
                        className="object-cover object-top sepia-light"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <TypeIcon className="h-16 w-16 text-bureau-manila-light/30" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── The file: paper reading body ──────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
            {contents.length >= 3 && (
              <nav aria-label="In this file" className="hidden lg:block">
                <div className="sticky top-24">
                  <p className="font-typewriter text-tag tracking-label uppercase text-muted-foreground">
                    In this file
                  </p>
                  <ol className="mt-2 border-t border-border">
                    {contents.map((item, i) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="flex gap-2.5 py-2 border-b border-border font-typewriter text-xs tracking-type text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <span className="min-w-4 text-bureau-stamp-ink tabular-nums">{i + 1}</span>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </nav>
            )}

            <div className="min-w-0 max-w-3xl">
              {/* File Abstract — always-visible summary of record, entity-first for search snippets */}
              {anomaly.fileAbstract && (
                <FileSection id="file-abstract" kicker="Summary of record" title="File Abstract">
                  {toParagraphs(anomaly.fileAbstract).map((p, i) => (
                    <p key={i}>
                      {p}
                    </p>
                  ))}
                </FileSection>
              )}

              {/* Case File Sections — always visible (not togglable) so headings carry the search query */}
              {anomaly.caseFileSections?.map((section) => (
                <FileSection
                  key={section._key}
                  id={`cfs-${section._key}`}
                  kicker={section.label}
                  title={section.heading}
                >
                  {toParagraphs(section.body).map((p, i) => (
                    <p key={i} className="whitespace-pre-line">
                      {p}
                    </p>
                  ))}
                </FileSection>
              ))}

              {/* Occurrence Distribution — structured record list (SEO target for "[name] sightings") */}
              <SightingDistribution
                cryptidName={anomaly.name}
                sightings={anomaly.sightings}
                showMap={false}
                variant="file"
              />

              {/* The story reads open: phenomenon first, then the people who heard it */}
              {phenomenon.length > 0 && (
                <FileSection id="the-phenomenon" title="The Phenomenon">
                  {phenomenon.map((p, i) => (
                    <p key={i}>
                      {p}
                    </p>
                  ))}
                </FileSection>
              )}

              {/* Witness Accounts — archive metadata left, testimony right */}
              {hasWitnesses && (
                <FileBlock>
                  <SectionTitle id="witness-accounts">Witness Accounts</SectionTitle>
                  <ol className="mt-5 border-t border-border">
                    {anomaly.witnesses!.map((witness, index) => {
                      const who = parseWitness(witness.witness);
                      return (
                        <li
                          key={witness._key}
                          className="grid gap-4 py-7 border-b border-border last:border-b-0 last:pb-0 sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-8"
                        >
                          <dl className="space-y-3 font-typewriter text-xs tracking-type text-muted-foreground">
                            <div>
                              <dt className="sr-only">Addendum</dt>
                              <dd className="text-tag tracking-label uppercase text-bureau-stamp-ink">
                                Addendum {String.fromCharCode(65 + index)}
                              </dd>
                            </div>
                            <div>
                              <dt className="sr-only">Witness</dt>
                              <dd className="text-sm text-foreground">{who.name}</dd>
                              {who.role && <dd className="mt-0.5">{who.role}</dd>}
                            </div>
                            {who.location && (
                              <div>
                                <dt className="text-tag tracking-label uppercase">Location</dt>
                                <dd className="text-foreground/85">{who.location}</dd>
                              </div>
                            )}
                            {witness.date && (
                              <div>
                                <dt className="text-tag tracking-label uppercase">Date</dt>
                                <dd className="text-foreground/85">{witness.date}</dd>
                              </div>
                            )}
                          </dl>
                          <div className="space-y-3.5 font-sans text-base leading-relaxed text-foreground/90">
                            {toParagraphs(witness.account).map((p, i) => (
                              <p key={i} className="whitespace-pre-line">
                                {i === 0 && (
                                  <span
                                    className="mr-1 font-display font-bold text-2xl leading-none text-bureau-stamp-ink/60"
                                    aria-hidden="true"
                                  >
                                    &ldquo;
                                  </span>
                                )}
                                {p}
                              </p>
                            ))}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </FileBlock>
              )}

              {/* Reference material, filed as rows that open in place */}
              {(theories.length > 0 || places.length > 0) && (
                <FileSection id="on-file" title="On file">
                  <div className={`grid gap-9 ${theories.length > 0 && places.length > 0 ? "md:grid-cols-2" : ""}`}>
                    {theories.length > 0 && (
                      <div>
                        <FiledHeading count={theories.filter((t) => t.title).length || theories.length}>Theories &amp; explanations</FiledHeading>
                        <FiledRows items={theories} numbered />
                      </div>
                    )}
                    {places.length > 0 && (
                      <div>
                        <FiledHeading count={places.filter((p) => p.title).length || places.length}>Where it&rsquo;s reported</FiledHeading>
                        <FiledRows items={places} variant="place" />
                      </div>
                    )}
                  </div>
                </FileSection>
              )}

              {hasBriefings && (
                <FileSection id="transmissions-received" title="Transmissions Received">
                  <FiledRows
                    items={anomaly.declassifiedBriefings!.map((b) => ({
                      title: b.question,
                      body: b.answer,
                    }))}
                  />
                </FileSection>
              )}
            </div>
          </div>
        </div>

        {/* ── From the desk: the Bureau's note, then the full transmission strip ── */}
        {hasDeskNotes && (
          <section
            id="from-the-desk"
            aria-labelledby="from-the-desk-heading"
            className="scroll-mt-28 border-t border-border bg-card/50"
          >
            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-14">
              <h2
                id="from-the-desk-heading"
                className="flex items-center gap-3.5 mb-8 font-typewriter text-xs tracking-eyebrow uppercase text-bureau-stamp-ink"
              >
                From the desk
                <span className="flex-1 border-t border-dashed border-border" aria-hidden="true" />
              </h2>

              {anomaly.noteOnRecord && (
                <article
                  aria-labelledby="note-on-record"
                  className="memo-paper memo-flat relative rounded-sm border border-border/60 px-6 pt-6 pb-5 rotate-[-0.2deg] sm:px-8 lg:px-10"
                >
                  <div className="memo-header">
                    <div className="memo-letterhead">
                      Appalachian Cryptid Division
                      <br />
                      Anomalies Desk
                    </div>
                    <h3 id="note-on-record" className="memo-title mt-2.5">
                      Note on the Record
                    </h3>
                    <div className="memo-meta-line">
                      <span className="memo-meta-label">Re:</span>
                      <span className="memo-meta-value">
                        {anomaly.name} ({caseNumber})
                      </span>
                    </div>
                    <div className="memo-meta-line">
                      <span className="memo-meta-label">From:</span>
                      <span className="memo-meta-value">Field Office No. 7</span>
                    </div>
                  </div>
                  {/* Full-width sheet; on wide screens the note flows into two
                      typed columns so lines stay a readable length. */}
                  <div className="relative z-2 font-typewriter text-sm tracking-type leading-loose text-foreground/90 lg:columns-2 lg:gap-12">
                    {splitLines(anomaly.noteOnRecord).map((p, i) => (
                      <p key={i} className="mb-4">
                        {p}
                      </p>
                    ))}
                  </div>
                  <p className="relative z-2 mt-1 text-right font-typewriter text-xs tracking-type text-bureau-stamp-ink">
                    Filed by the Anomalies Desk
                  </p>
                </article>
              )}

              {anomaly.bureauNotes && (
                <div className={anomaly.noteOnRecord ? "mt-12" : undefined}>
                  <h3 className="sr-only">Field Transmission</h3>
                  <IncidentLog
                    content={anomaly.bureauNotes}
                    anomalyName={anomaly.name}
                    caseNumber={caseNumber}
                    station={
                      anomaly.subRegion
                        ? `${anomaly.subRegion.toUpperCase()} OUTPOST`
                        : `${stateName(anomaly.region)} FIELD STATION`
                    }
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── More from the desk: related files + the bulletins citing this one ── */}
        {(relatedAnomalies.length > 0 || referencingBulletins.length > 0) && (
          <MoreFromTheDesk related={relatedAnomalies} bulletins={referencingBulletins} />
        )}

        <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-8 pb-8">
          {/* Share */}
          <div className="mb-8 pt-6">
            <DeferredMount minHeight={56}>
              <ShareButtons title={anomaly.name} />
            </DeferredMount>
          </div>

          {/* Newsletter */}
          <div className="mb-8 border-t border-border pt-8">
            <DeferredMount minHeight={140}>
              <NewsletterSignup variant="compact" />
            </DeferredMount>
          </div>
        </div>
      </main>

      <BackToTop />
      <Footer />
    </div>
  );
}

// ── Page pieces ──────────────────────────────────────────

function FiledHeading({ count, children }: { count: number; children: React.ReactNode }) {
  return (
    <h3 className="mb-2 flex justify-between gap-3 font-typewriter text-tag tracking-label uppercase text-muted-foreground">
      <span>{children}</span>
      <span className="tabular-nums">{count}</span>
    </h3>
  );
}

/** Title rows that open in place — the desk's version of a drawer. */
function FiledRows({
  items,
  numbered = false,
  variant = "default",
}: {
  items: { title?: string; body: string }[];
  numbered?: boolean;
  variant?: "default" | "place";
}) {
  return (
    <div className="border-t border-border">
      {items.map((item, i) =>
        item.title ? (
          // Number titled rows only, so intro/closing prose doesn't skip a count
          <details key={i} className="group border-b border-border">
            <summary className="flex cursor-pointer list-none items-baseline gap-2.5 py-3 [&::-webkit-details-marker]:hidden">
              {numbered && (
                <span className="w-6 shrink-0 font-display font-bold text-lg leading-none text-bureau-stamp-ink tabular-nums">
                  {items.slice(0, i + 1).filter((it) => it.title).length}
                </span>
              )}
              <span
                className={`flex-1 decoration-dotted underline-offset-4 group-hover:underline ${
                  variant === "place"
                    ? "font-typewriter text-sm tracking-type uppercase text-bureau-stamp-ink"
                    : "font-display font-bold text-lg leading-snug text-foreground"
                }`}
              >
                {item.title}
              </span>
              <span
                className="font-typewriter text-muted-foreground transition-transform group-open:rotate-45 motion-reduce:transition-none"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <div className={`space-y-3 pb-4 text-base leading-relaxed text-foreground/90 ${numbered ? "pl-8.5" : ""}`}>
              {toParagraphs(item.body).map((p, j) => (
                <p key={j} className="whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          </details>
        ) : (
          <p key={i} className="py-3 border-b border-border">
            {item.body}
          </p>
        )
      )}
    </div>
  );
}

function CoverFact({
  label,
  wide = false,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? "col-span-full" : undefined}>
      <dt className="mb-1 text-tag tracking-label uppercase text-bureau-manila-light/70">
        {label}
      </dt>
      <dd className={wide ? "text-xs leading-relaxed text-bureau-manila-light/85" : undefined}>
        {children}
      </dd>
    </div>
  );
}

function SectionTitle({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className={`scroll-mt-28 font-display font-bold text-xl leading-tight text-foreground ${className ?? ""}`}
    >
      {children}
    </h2>
  );
}

/** One block of the file, separated from the next by a thin rule. */
function FileBlock({ children }: { children: React.ReactNode }) {
  return <div className="mb-10 pb-10 border-b border-border last:mb-0 last:pb-0 last:border-0">{children}</div>;
}

function FileSection({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mb-10 pb-10 border-b border-border last:mb-0 last:pb-0 last:border-0">
      {kicker && (
        <p className="mb-1.5 font-typewriter text-xs tracking-eyebrow uppercase text-bureau-stamp-ink">
          {kicker}
        </p>
      )}
      <SectionTitle id={id} className="mb-5">
        {title}
      </SectionTitle>
      <div className="space-y-4 font-sans text-base leading-relaxed text-foreground/90">
        {children}
      </div>
    </section>
  );
}

/** Shared row grid so file rows and bulletin rows line up column for column. */
const DESK_ROW =
  "group grid grid-cols-[64px_minmax(0,1fr)] gap-x-4 gap-y-1 py-4.5 md:grid-cols-[80px_minmax(0,1fr)_160px_120px] md:items-center md:gap-5";

function DeskNumber({ prefix, number }: { prefix: string; number: string }) {
  return (
    <span className="row-span-3 font-display font-bold text-4xl leading-none text-bureau-rust tabular-nums md:row-span-1 md:text-5xl">
      <span className="block mb-1 font-typewriter font-normal text-tag tracking-label text-bureau-manila-light/70">
        {prefix}
      </span>
      {number}
    </span>
  );
}

function DeskGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="pb-2 font-typewriter text-tag tracking-label uppercase text-bureau-manila-light/70">
      {children}
    </h3>
  );
}

function MoreFromTheDesk({
  related,
  bulletins,
}: {
  related: SanityAnomalyListItem[];
  bulletins: SanityBulletinListItem[];
}) {
  return (
    <section
      className="plate-stock plate-ink relative bg-bureau-ink text-bureau-manila-light paper-texture"
      aria-labelledby="more-from-desk-heading"
    >
      <div className="relative z-2 max-w-6xl mx-auto px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
          <h2
            id="more-from-desk-heading"
            className="font-display font-bold text-xl text-bureau-paper"
          >
            More from the desk
          </h2>
          <Link
            href="/anomalies"
            className="font-typewriter text-sm tracking-type border-b border-dotted border-bureau-manila-light/70 hover:border-solid"
          >
            All anomalies →
          </Link>
        </div>

        {related.length > 0 && (
          <div>
            <DeskGroupLabel>Related files</DeskGroupLabel>
            <ul role="list">
              {related.map((r) => (
                <li key={r._id} className="border-t border-bureau-manila-light/15">
                  <Link href={`/anomaly/${r.slug.current}`} className={DESK_ROW}>
                    <DeskNumber prefix="AD" number={r.fileNumber ? formatFileNo(r.fileNumber) : "—"} />
                    <span className="font-display font-bold text-xl leading-tight text-bureau-paper transition-colors group-hover:text-bureau-rust">
                      {r.name}
                    </span>
                    <span className="col-start-2 font-typewriter text-xs tracking-type uppercase text-bureau-rust-ink md:col-start-auto">
                      {r.anomalyType.replace("/", " / ")}
                    </span>
                    <span className="col-start-2 font-typewriter text-xs tracking-type text-bureau-manila-light/85 md:col-start-auto">
                      {r.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {bulletins.length > 0 && (
          <div className={related.length > 0 ? "mt-10" : undefined}>
            <DeskGroupLabel>In the bulletins</DeskGroupLabel>
            <ul role="list">
              {bulletins.map((b) => {
                // "BUR-013" → small "BUR" over a big "013", matching AD-### above
                const [prefix, number] = b.bulletinNumber.includes("-")
                  ? [b.bulletinNumber.split("-")[0], b.bulletinNumber.split("-").slice(1).join("-")]
                  : ["BUR", b.bulletinNumber];
                return (
                  <li key={b._id} className="border-t border-bureau-manila-light/15">
                    <Link href={`/bulletin/${b.slug.current}`} className={DESK_ROW}>
                      <DeskNumber prefix={prefix} number={number} />
                      <span className="min-w-0">
                        <span className="block font-display font-bold text-xl leading-tight text-bureau-paper transition-colors group-hover:text-bureau-rust">
                          {b.title}
                        </span>
                        {b.summary && (
                          <span className="mt-1 font-sans text-sm leading-relaxed text-bureau-manila-light/80 line-clamp-2">
                            {b.summary}
                          </span>
                        )}
                      </span>
                      <span className="col-start-2 font-typewriter text-xs tracking-type uppercase text-bureau-rust-ink md:col-start-auto">
                        {BULLETIN_CATEGORIES[b.category]?.label ?? "Bulletin"}
                      </span>
                      <span className="col-start-2 font-typewriter text-xs tracking-type text-bureau-manila-light/85 md:col-start-auto">
                        Filed {formatLedgerDate(b.date)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/bulletins"
              className="mt-5 inline-block font-typewriter text-sm tracking-type border-b border-dotted border-bureau-manila-light/70 hover:border-solid"
            >
              All bulletins →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
