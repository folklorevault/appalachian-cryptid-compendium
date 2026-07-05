import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Stamp } from "@/components/Stamp";
import { BureauMemo } from "@/components/BureauMemo";
import { ShareButtons } from "@/components/ShareButtons";
import { BackToTop } from "@/components/BackToTop";
import {
  FilingCabinet,
  FilingDrawer,
  FilingCabinetControls,
} from "@/components/FilingDrawer";
import { MapPin, Calendar, Globe } from "lucide-react";
import {
  StructuredData,
  createCryptidArticleSchema,
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
import { ReportSightingCTA } from "@/components/ReportSightingCTA";
import { FieldSupplyDrop } from "@/components/FieldSupplyDrop";
import { BulletinRefList } from "@/components/BulletinRefList";
import { Footer } from "@/components/Footer";
import {
  fetchCryptidBySlug,
  fetchCryptidSlugs,
  fetchRelatedCryptids,
  fetchBulletinsReferencing,
} from "@/lib/sanity/fetchers";
import { urlFor } from "@/lib/sanity/image";

// ── Static params for build-time generation ──────────────

export async function generateStaticParams() {
  const slugs = await fetchCryptidSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ── SEO metadata ─────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string } & Record<string, string | string[]>>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cryptid = await fetchCryptidBySlug(slug);

  if (!cryptid) {
    return { title: "Case File Not Found" };
  }

  // Build a CTR-optimized description: name + location + subhead/description
  const detail = cryptid.subhead || cryptid.description || "";
  const firstDoc = cryptid.firstDocumented ? ` First documented ${cryptid.firstDocumented}.` : "";
  const candidate = `${cryptid.name} — ${cryptid.location}.${firstDoc} ${detail}`.trim();
  const description = candidate.length > 160 ? candidate.slice(0, 157) + "..." : candidate;

  return {
    title: `${cryptid.name} | Sightings & Case File`,
    description,
    alternates: {
      canonical: `/cryptid/${slug}`,
    },
    openGraph: {
      title: `${cryptid.name} — Appalachian Cryptid Sightings`,
      description,
      type: "article",
      url: `https://appalachiancryptid.com/cryptid/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${cryptid.name} — Appalachian Cryptid Sightings`,
      description,
    },
  };
}

// ── Page ─────────────────────────────────────────────────

export default async function CryptidDetailPage({
  params,
}: {
  params: Promise<{ slug: string } & Record<string, string | string[]>>;
}) {
  const { slug } = await params;
  const cryptid = await fetchCryptidBySlug(slug);

  if (!cryptid) {
    notFound();
  }

  const [relatedCryptids, referencingBulletins] = await Promise.all([
    fetchRelatedCryptids(
      cryptid.slug?.current,
      cryptid.region,
      cryptid.dangerLevel
    ),
    fetchBulletinsReferencing(cryptid._id),
  ]);

  const imageUrl = cryptid.image
    ? urlFor(cryptid.image)
        .width(640)
        .fit("max")
        .quality(70)
        .auto("format")
        .url()
    : "";



  const caseNumber = `${(cryptid.slug?.current ?? "UNK").toUpperCase().slice(0, 3)}-${(cryptid.slug?.current?.length ?? 0).toString().padStart(3, "0")}`;


  return (
    <div className="min-h-screen bg-background paper-texture">
      <StructuredData
        type="article"
        data={createCryptidArticleSchema({
          name: cryptid.name,
          description: cryptid.subhead || cryptid.description || "",
          image: imageUrl,
          slug: cryptid.slug?.current,
          tags: cryptid.tags,
          location: cryptid.location,
        })}
      />
      <StructuredData
        type="breadcrumb"
        data={createBreadcrumbSchema([
          { name: "Cryptid Directory", url: "/" },
          { name: cryptid.name },
        ])}
      />
      {cryptid.declassifiedBriefings &&
        cryptid.declassifiedBriefings.length > 0 && (
          <StructuredData
            type="faq"
            data={createFAQPageSchema(cryptid.declassifiedBriefings)}
          />
        )}

      <main id="main-content">
        {/* Breadcrumb Navigation */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Breadcrumb>
            <BreadcrumbList className="font-typewriter uppercase tracking-widest text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Cryptid Directory</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{cryptid.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          {/* Cover Sheet — photo clipped to left, identifying info on right */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-10 items-start">
            {imageUrl && (
              <div className="relative shrink-0 w-[220px] sm:w-[280px] lg:w-[320px]">
                <div className="relative overflow-hidden rounded-sm border-2 border-bureau-border shadow-[3px_3px_8px_rgba(42,42,42,0.15)]">
                  <Image
                    src={imageUrl}
                    alt={
                      (cryptid.imageAlt || cryptid.name).length > 125
                        ? (cryptid.imageAlt || cryptid.name).slice(0, 122) + '...'
                        : (cryptid.imageAlt || cryptid.name)
                    }
                    width={640}
                    height={853}
                    priority
                    sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 320px"
                    className="w-full h-auto sepia-light"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <Stamp text="Documented" variant="primary" rotation={-8} className="text-xs px-2 py-0.5" />
                </div>
              </div>
            )}

            <div className="flex-1 min-w-0 pt-1">
              <div className="text-xs uppercase tracking-eyebrow text-muted-foreground font-typewriter mb-2">
                Case File #{caseNumber}
              </div>
              <h1 className="text-title font-bold text-foreground font-display mb-2 leading-tight">
                {cryptid.name}
              </h1>
              {cryptid.subhead && (
                <p className="text-sm text-foreground/80 leading-relaxed mb-3 max-w-lg">
                  {cryptid.subhead}
                </p>
              )}
              {cryptid.scientificName && (
                <p className="text-base italic text-muted-foreground mb-4">
                  {cryptid.scientificName}
                </p>
              )}

              <div className="space-y-2 pt-3 border-t border-dashed border-[hsl(var(--bureau-border)/0.5)]">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-typewriter w-20 shrink-0">Location</span>
                  <span className="text-foreground">{cryptid.location}</span>
                </div>
                {cryptid.firstDocumented && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-typewriter w-20 shrink-0">First Doc.</span>
                    <span className="text-foreground">{cryptid.firstDocumented}</span>
                  </div>
                )}
                {cryptid.region && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-typewriter w-20 shrink-0">Region</span>
                    <span className="text-foreground">{cryptid.region}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Sections - Filing Cabinet */}
          {(cryptid.physicalDescription ||
            cryptid.behavior ||
            cryptid.habitat ||
            cryptid.diet ||
            cryptid.notableSightings) && (
            <div className="mb-8">
              <FilingCabinet
                defaultOpen={
                  cryptid.physicalDescription ? ["physical"] : []
                }
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground font-display">
                    Case Sections
                  </h2>
                  <FilingCabinetControls />
                </div>

                {cryptid.physicalDescription && (
                  <FilingDrawer value="physical" label="Physical Profile">
                    <p className="whitespace-pre-line">
                      {cryptid.physicalDescription}
                    </p>
                  </FilingDrawer>
                )}
                {cryptid.behavior && (
                  <FilingDrawer value="behavior" label="Behavioral Notes">
                    <p className="whitespace-pre-line">{cryptid.behavior}</p>
                  </FilingDrawer>
                )}
                {cryptid.habitat && (
                  <FilingDrawer value="habitat" label="Habitat Analysis">
                    <p className="whitespace-pre-line">{cryptid.habitat}</p>
                  </FilingDrawer>
                )}
                {cryptid.diet && (
                  <FilingDrawer value="diet" label="Dietary Report">
                    <p className="whitespace-pre-line">{cryptid.diet}</p>
                  </FilingDrawer>
                )}
                {cryptid.notableSightings && (
                  <FilingDrawer value="sightings" label="Sighting Timeline">
                    <p className="whitespace-pre-line">
                      {cryptid.notableSightings}
                    </p>
                  </FilingDrawer>
                )}
              </FilingCabinet>
            </div>
          )}

          {/* Declassified Briefings (FAQ) */}
          {cryptid.declassifiedBriefings &&
            cryptid.declassifiedBriefings.length > 0 && (
              <div className="mb-8">
                <FilingCabinet defaultOpen={[]}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground font-display">
                      Declassified Briefings
                    </h2>
                    <FilingCabinetControls />
                  </div>
                  {cryptid.declassifiedBriefings.map((briefing) => (
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

          {/* Witness Testimonies */}
          {cryptid.testimonies && cryptid.testimonies.length > 0 && (
            <div className="mb-8">
              <FilingCabinet defaultOpen={["addendum-0"]}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground font-display">
                    Witness Accounts
                  </h2>
                  <FilingCabinetControls />
                </div>
                {cryptid.testimonies.map((testimony, index) => {
                  const addendumLetter = String.fromCharCode(65 + index);
                  return (
                    <FilingDrawer
                      key={testimony._key}
                      value={`addendum-${index}`}
                      label={`Addendum ${addendumLetter}`}
                    >
                      <div className="flex flex-wrap gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Witness:
                          </span>{" "}
                          <span className="text-foreground font-medium">
                            {testimony.witness}
                          </span>
                        </div>
                        {testimony.date && (
                          <div>
                            <span className="text-muted-foreground">
                              Date:
                            </span>{" "}
                            <span className="text-foreground">
                              {testimony.date}
                            </span>
                          </div>
                        )}
                        {testimony.location && (
                          <div>
                            <span className="text-muted-foreground">
                              Location:
                            </span>{" "}
                            <span className="text-foreground">
                              {testimony.location}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-foreground/80 leading-relaxed italic border-l-2 border-primary pl-4">
                        &ldquo;{testimony.account}&rdquo;
                      </p>
                    </FilingDrawer>
                  );
                })}
              </FilingCabinet>
            </div>
          )}

          {/* Bureau Memo + Field Supply Drop */}
          <div className="mb-8 flex flex-col md:flex-row gap-10 items-start">
            {cryptid.bureauNotes && (
              <div className="flex-1 min-w-0 max-w-2xl">
                <BureauMemo
                  content={cryptid.bureauNotes}
                  cryptidName={cryptid.name}
                  caseNumber={caseNumber}
                />
              </div>
            )}
            <div className="shrink-0">
              <FieldSupplyDrop variant="detail" />
            </div>
          </div>

          {/* Inline conversion: file a sighting for THIS cryptid */}
          <ReportSightingCTA
            cryptidName={cryptid.name}
            cryptidSlug={cryptid.slug?.current}
          />

          {/* Related Cryptids */}
          {relatedCryptids.filter((r) => r.gridImage).length > 0 && (
            <div className="mb-8 border-t border-border pt-8">
              <h2 className="text-xl font-bold text-foreground font-display mb-6">
                Related Case Files
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedCryptids
                  .filter((related) => related.gridImage)
                  .map((related) => {
                    const relatedImageUrl = urlFor(related.gridImage!)
                      .width(400)
                      .height(400)
                      .auto("format")
                      .url();
                    return (
                      <Link
                        key={related._id}
                        href={`/cryptid/${related.slug?.current}`}
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
            <ShareButtons title={cryptid.name} />
          </div>

          {/* Newsletter Signup - compact strip */}
          <div className="mb-8 border-t border-border pt-8">
            <NewsletterSignup variant="compact" />
          </div>
        </div>
      </main>

      <BackToTop />
      <Footer />
    </div>
  );
}
