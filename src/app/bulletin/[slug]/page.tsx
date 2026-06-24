import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BackToTop } from "@/components/BackToTop";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Footer } from "@/components/Footer";
import {
  StructuredData,
  createBlogPostingSchema,
  createBreadcrumbSchema,
} from "@/components/StructuredData";
import {
  fetchBulletinBySlug,
  fetchBulletinSlugs,
} from "@/lib/sanity/fetchers";
import { formatLongDate } from "@/lib/utils";
import type { BulletinCategory } from "@/types/sanity";

const CATEGORY_LABELS: Record<BulletinCategory, string> = {
  "field-terminology": "Field Terminology",
  "regional-analysis": "Regional Analysis",
  "cultural-brief": "Cultural Brief",
  "operational-notice": "Operational Notice",
};

// ── Static params for build-time generation ──────────────

export async function generateStaticParams() {
  const slugs = await fetchBulletinSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ── SEO metadata ─────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string } & Record<string, string | string[]>>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bulletin = await fetchBulletinBySlug(slug);

  if (!bulletin) {
    return { title: "Bulletin Not Found" };
  }

  const rawSummary = bulletin.summary || "";
  const description =
    rawSummary.length > 160
      ? rawSummary.slice(0, 157) + "..."
      : rawSummary;

  return {
    title: `${bulletin.title} | Bureau Bulletins`,
    description,
    alternates: {
      canonical: `/bulletin/${slug}`,
    },
    openGraph: {
      title: `${bulletin.title} — Bureau Bulletin ${bulletin.bulletinNumber}`,
      description,
      type: "article",
      url: `https://appalachiancryptid.com/bulletin/${slug}`,
    },
  };
}

// ── Page ─────────────────────────────────────────────────

export default async function BulletinDetailPage({
  params,
}: {
  params: Promise<{ slug: string } & Record<string, string | string[]>>;
}) {
  const { slug } = await params;
  const bulletin = await fetchBulletinBySlug(slug);

  if (!bulletin) {
    notFound();
  }

  const categoryLabel = CATEGORY_LABELS[bulletin.category] ?? bulletin.category;

  return (
    <div className="min-h-screen bg-background paper-texture">
      <StructuredData
        type="blogPosting"
        data={createBlogPostingSchema({
          title: bulletin.title,
          summary: bulletin.summary,
          date: bulletin.date,
          slug: bulletin.slug.current,
          readTime: bulletin.readTime,
        })}
      />
      <StructuredData
        type="breadcrumb"
        data={createBreadcrumbSchema([
          { name: "Bureau Bulletins", url: "/bulletins" },
          { name: bulletin.title },
        ])}
      />
      <main id="main-content">
        {/* Breadcrumb */}
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Breadcrumb>
            <BreadcrumbList className="font-typewriter uppercase tracking-widest text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/bulletins">Bureau Bulletins</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{bulletin.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span className="font-typewriter text-xs font-bold tracking-[0.05em] text-bureau-ink">
              {bulletin.bulletinNumber}
            </span>
            <span className="font-typewriter text-xs text-bureau-ink-muted">
              {formatLongDate(bulletin.date)}
            </span>
            <span
              className="font-typewriter text-xs tracking-widest uppercase pb-px"
              style={{
                color: `hsl(var(--bulletin-${bulletin.category}))`,
                borderBottom: `1.5px solid hsl(var(--bulletin-${bulletin.category}) / 0.25)`,
              }}
            >
              {categoryLabel}
            </span>
            {bulletin.readTime && (
              <span className="font-typewriter text-xs text-muted-foreground/80">
                {bulletin.readTime} read
              </span>
            )}
          </div>

          <h1 className="font-display font-bold text-foreground leading-tight text-[clamp(1.6rem,4vw,2.4rem)] mb-3">
            {bulletin.title}
          </h1>

          {bulletin.summary && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {bulletin.summary}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="max-w-3xl mx-auto px-6">
          <hr className="border-t-2 border-bureau-ink-muted mb-8" />
        </div>

        {/* Body */}
        <article className="max-w-3xl mx-auto px-6 pb-12">
          {bulletin.body && bulletin.body.length > 0 ? (
            <div className="prose prose-stone max-w-none font-sans text-foreground leading-relaxed [&_p]:mb-4 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground">
              <PortableText value={bulletin.body as PortableTextBlock[]} />
            </div>
          ) : (
            <p className="text-muted-foreground italic font-typewriter text-sm">
              Full bulletin content not yet available.
            </p>
          )}

          {/* Related Case Files */}
          {bulletin.relatedCryptids && bulletin.relatedCryptids.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border">
              <h2 className="text-lg font-bold text-foreground font-display mb-3">
                Related Case Files
              </h2>
              <div className="flex flex-wrap gap-2">
                {bulletin.relatedCryptids.map((cryptid) => (
                  <Link
                    key={cryptid._id}
                    href={`/cryptid/${cryptid.slug.current}`}
                    className="font-typewriter text-xs tracking-[0.05em] text-primary border border-primary/30 rounded-sm px-2.5 py-1 no-underline hover:bg-primary/5 transition-colors"
                  >
                    {cryptid.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Anomalies */}
          {bulletin.relatedAnomalies &&
            bulletin.relatedAnomalies.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h2 className="text-lg font-bold text-foreground font-display mb-3">
                  Related Anomalies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {bulletin.relatedAnomalies.map((anomaly) => (
                    <Link
                      key={anomaly._id}
                      href={`/anomaly/${anomaly.slug.current}`}
                      className="font-typewriter text-xs tracking-[0.05em] text-accent border border-accent/30 rounded-sm px-2.5 py-1 no-underline hover:bg-accent/5 transition-colors"
                    >
                      {anomaly.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

          {/* Newsletter */}
          <div className="mt-10 pt-8 border-t border-border">
            <NewsletterSignup variant="compact" />
          </div>
        </article>
      </main>

      <BackToTop />
      <Footer />
    </div>
  );
}
