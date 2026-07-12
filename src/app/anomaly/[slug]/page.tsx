import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Stamp } from "@/components/Stamp";
import { IncidentLog } from "@/components/IncidentLog";
import { ShareButtons } from "@/components/ShareButtons";
import { BackToTop } from "@/components/BackToTop";
import {
  FilingCabinet,
  FilingDrawer,
  FilingCabinetControls,
} from "@/components/FilingDrawer";
import {
  MapPin,
  Calendar,
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
import { BulletinRefList } from "@/components/BulletinRefList";
import { Footer } from "@/components/Footer";
import {
  fetchAnomalyBySlug,
  fetchAnomalySlugs,
  fetchRelatedAnomalies,
  fetchBulletinsReferencing,
} from "@/lib/sanity/fetchers";
import { urlFor } from "@/lib/sanity/image";
import { getAnomalyStatusColor } from "@/lib/caseUtils";
import type { AnomalyType } from "@/types/sanity";

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

  // Prefer editor-authored SEO title, else the anomaly name alone.
  const title = anomaly.metaTitle || anomaly.name;

  // Prefer editor-authored meta description. Else build a fallback from
  // subhead/description + location.
  const rawDesc = anomaly.subhead || anomaly.description || `Learn about ${anomaly.name}`;
  const withLocation = `${rawDesc} Reported near ${anomaly.location}.`;
  const derived = withLocation.length > 160
    ? rawDesc.slice(0, 157) + '...'
    : withLocation;
  const description = anomaly.metaDescription || derived;

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



  const caseNumber = `${(anomaly.slug?.current ?? "UNK").toUpperCase().slice(0, 3)}-${(anomaly.slug?.current?.length ?? 0).toString().padStart(3, "0")}`;

  const TypeIcon = typeIcons[anomaly.anomalyType] || Zap;

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

      <main id="main-content">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Breadcrumb>
            <BreadcrumbList className="font-typewriter uppercase tracking-widest text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Directory</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/anomalies">Anomalies Desk</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{anomaly.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          {/* Cover Sheet — photo clipped to left, identifying info on right */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-10 items-start">
            <div className="relative shrink-0 w-[220px] sm:w-[280px] lg:w-[320px]">
              <div className="relative aspect-3/4 overflow-hidden rounded-sm border-2 border-bureau-border shadow-[3px_3px_8px_rgba(42,42,42,0.15)]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={
                      (anomaly.imageAlt || anomaly.name).length > 125
                        ? (anomaly.imageAlt || anomaly.name).slice(0, 122) + '...'
                        : (anomaly.imageAlt || anomaly.name)
                    }
                    fill
                    priority
                    sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 320px"
                    className="object-cover object-top sepia-light"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <TypeIcon className="h-24 w-24 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2">
                <Stamp text="Anomaly" variant="primary" rotation={-8} className="text-xs px-2 py-0.5" />
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <div className="text-xs uppercase tracking-eyebrow text-muted-foreground font-typewriter mb-2">
                Case File #{caseNumber}
              </div>
              <h1 className="text-title font-bold text-foreground font-display mb-2 leading-tight">
                {anomaly.name}
              </h1>
              {anomaly.subhead && (
                <p className="text-sm text-foreground/80 leading-relaxed mb-3 max-w-lg">
                  {anomaly.subhead}
                </p>
              )}

              <div className="space-y-2 pt-3 border-t border-dashed border-[hsl(var(--bureau-border)/0.5)]">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-typewriter w-20 shrink-0">Location</span>
                  <span className="text-foreground">{anomaly.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TypeIcon className="h-4 w-4 text-accent shrink-0" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-typewriter w-20 shrink-0">Type</span>
                  <span className="text-foreground">{anomaly.anomalyType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-4 w-4 shrink-0" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-typewriter w-20 shrink-0">Status</span>
                  <Badge className={`${getAnomalyStatusColor(anomaly.status)} text-xs px-1.5 py-0`}>
                    {anomaly.status}
                  </Badge>
                </div>
                {anomaly.firstDocumented && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-typewriter w-20 shrink-0">First Doc.</span>
                    <span className="text-foreground">{anomaly.firstDocumented}</span>
                  </div>
                )}
                {anomaly.frequency && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-typewriter w-20 shrink-0">Frequency</span>
                    <span className="text-foreground">{anomaly.frequency}</span>
                  </div>
                )}
                {anomaly.region && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-4 w-4 shrink-0" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-typewriter w-20 shrink-0">Region</span>
                    <span className="text-foreground">{anomaly.region}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filing Cabinet Sections */}
          {(anomaly.phenomenon ||
            anomaly.theories ||
            anomaly.relatedLocations) && (
            <div className="mb-8">
              <FilingCabinet
                defaultOpen={anomaly.phenomenon ? ["phenomenon"] : []}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground font-display">
                    Case Sections
                  </h2>
                  <FilingCabinetControls />
                </div>
                {anomaly.phenomenon && (
                  <FilingDrawer
                    value="phenomenon"
                    label="Phenomenon Description"
                  >
                    <p className="whitespace-pre-line">{anomaly.phenomenon}</p>
                  </FilingDrawer>
                )}
                {anomaly.theories && (
                  <FilingDrawer
                    value="theories"
                    label="Theories & Explanations"
                  >
                    <p className="whitespace-pre-line">{anomaly.theories}</p>
                  </FilingDrawer>
                )}
                {anomaly.relatedLocations && (
                  <FilingDrawer value="locations" label="Related Locations">
                    <p className="whitespace-pre-line">
                      {anomaly.relatedLocations}
                    </p>
                  </FilingDrawer>
                )}
              </FilingCabinet>
            </div>
          )}

          {/* Declassified Briefings */}
          {anomaly.declassifiedBriefings &&
            anomaly.declassifiedBriefings.length > 0 && (
              <div className="mb-8">
                <FilingCabinet defaultOpen={[]}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground font-display">
                      Transmissions Received
                    </h2>
                    <FilingCabinetControls />
                  </div>
                  {anomaly.declassifiedBriefings.map((briefing) => (
                    <FilingDrawer
                      key={briefing._key}
                      value={briefing._key}
                      label={briefing.question}
                    >
                      <p className="whitespace-pre-line">{briefing.answer}</p>
                    </FilingDrawer>
                  ))}
                </FilingCabinet>
              </div>
            )}

          {/* Witness Accounts */}
          {anomaly.witnesses && anomaly.witnesses.length > 0 && (
            <div className="mb-8">
              <FilingCabinet defaultOpen={["addendum-0"]}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground font-display">
                    Witness Accounts
                  </h2>
                  <FilingCabinetControls />
                </div>
                {anomaly.witnesses.map((witness, index) => {
                  const addendumLetter = String.fromCharCode(65 + index);
                  return (
                    <FilingDrawer
                      key={witness._key}
                      value={`addendum-${index}`}
                      label={`Addendum ${addendumLetter}`}
                    >
                      <div className="flex flex-wrap gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Witness:
                          </span>{" "}
                          <span className="text-foreground font-medium">
                            {witness.witness}
                          </span>
                        </div>
                        {witness.date && (
                          <div>
                            <span className="text-muted-foreground">
                              Date:
                            </span>{" "}
                            <span className="text-foreground">
                              {witness.date}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-foreground/80 leading-relaxed italic border-l-2 border-primary pl-4">
                        &ldquo;{witness.account}&rdquo;
                      </p>
                    </FilingDrawer>
                  );
                })}
              </FilingCabinet>
            </div>
          )}

          {/* Note on the Record */}
          {anomaly.noteOnRecord && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground font-display mb-4">
                Note on the Record
              </h2>
              <Card className="border-2 border-dashed border-[hsl(var(--bureau-border)/0.5)]">
                <CardContent className="p-5">
                  <p className="whitespace-pre-line text-foreground/80 leading-relaxed italic">
                    {anomaly.noteOnRecord}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Incident Log */}
          {anomaly.bureauNotes && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground font-display mb-6">
                Field Transmission
              </h2>
              <IncidentLog
                content={anomaly.bureauNotes}
                anomalyName={anomaly.name}
                caseNumber={caseNumber}
                station={
                  anomaly.subRegion
                    ? `${anomaly.subRegion.toUpperCase()} OUTPOST`
                    : `${anomaly.region} FIELD STATION`
                }
              />
            </div>
          )}

          {/* Related Anomalies */}
          {relatedAnomalies.filter((r) => r.gridImage).length > 0 && (
            <div className="mb-8 border-t border-border pt-8">
              <h2 className="text-xl font-bold text-foreground font-display mb-6">
                Related Case Files
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedAnomalies
                  .filter((related) => related.gridImage)
                  .map((related) => {
                    const relatedImageUrl = urlFor(related.gridImage!)
                      .width(400)
                      .height(400)
                      .auto("format")
                      .url();
                    const RelatedIcon =
                      typeIcons[related.anomalyType] || Zap;
                    return (
                      <Link
                        key={related._id}
                        href={`/anomaly/${related.slug?.current}`}
                        className="group"
                      >
                        <Card className="border-2 border-border hover:border-bureau-border hover:-translate-y-[3px] hover:shadow-[0_6px_20px_rgba(42,42,42,0.12)] transition-all duration-200 ease-out overflow-hidden">
                          <div className="relative aspect-square overflow-hidden">
                            <Image
                              src={relatedImageUrl}
                              alt={related.name}
                              fill
                              sizes="(max-width: 640px) 50vw, 200px"
                              className="object-cover object-top transition-transform group-hover:scale-105 sepia-light"
                            />
                            <div className="absolute bottom-2 left-2">
                              <Badge
                                variant="outline"
                                className="bg-background/80 backdrop-blur-xs text-xs"
                              >
                                <RelatedIcon className="h-3 w-3 mr-1" />
                                {related.anomalyType}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                              {related.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {related.location}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Bulletins that reference this case file */}
          <BulletinRefList
            heading="Referenced in Bureau Bulletins"
            bulletins={referencingBulletins}
          />

          {/* Share */}
          <div className="mb-8 border-t border-border pt-6">
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
