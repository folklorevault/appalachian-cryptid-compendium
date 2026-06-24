import type { Metadata } from "next";
import { fetchBulletins } from "@/lib/sanity/fetchers";
import { BulletinLedger } from "@/components/BulletinLedger";
import { Footer } from "@/components/Footer";
import {
  StructuredData,
  createBlogSchema,
  createBreadcrumbSchema,
} from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Bureau Bulletins",
  description:
    "Official communications from the Bureau of Appalachian Cryptid Documentation. Field primers, regional analysis, and operational guidance released to the public record.",
  alternates: {
    canonical: "/bulletins",
  },
  openGraph: {
    title: "Bureau Bulletins | Appalachian Cryptid Field Guide",
    description:
      "Field primers, regional analysis, and operational guidance from the Bureau.",
    url: "https://appalachiancryptid.com/bulletins",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bureau Bulletins | Appalachian Cryptid Field Guide",
    description:
      "Field primers, regional analysis, and operational guidance from the Bureau.",
  },
};

export default async function BulletinsPage() {
  const bulletins = await fetchBulletins();

  return (
    <div className="min-h-screen bg-background paper-texture">
      <StructuredData
        type="blog"
        data={createBlogSchema(
          bulletins.map((b) => ({
            title: b.title,
            summary: b.summary,
            date: b.date,
            slug: b.slug.current,
          }))
        )}
      />
      <StructuredData
        type="breadcrumb"
        data={createBreadcrumbSchema([
          { name: "Field Guide", url: "/" },
          { name: "Bureau Bulletins" },
        ])}
      />
      <main id="main-content">
        {/* Ledger Header */}
        <section className="relative py-20 px-6 lg:py-24 lg:px-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-center gap-3.5 mb-6">
              <span className="block w-10 h-px bg-border" aria-hidden="true" />
              <span className="font-typewriter text-xs tracking-eyebrow uppercase text-bureau-ink-muted">
                Bureau of Appalachian Cryptid Documentation ◆ Records Division
              </span>
              <span className="block w-10 h-px bg-border" aria-hidden="true" />
            </div>

            <h1 className="font-display font-bold text-foreground leading-tight text-[clamp(2.2rem,5.5vw,3.75rem)]">
              Bureau Bulletins
            </h1>

            {/* Double-rule underline */}
            <div
              className="max-w-[300px] mx-auto border-t-2 border-b border-foreground"
              style={{ height: "4px" }}
            />

            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed font-typewriter">
              Official communications released to the public record.
              Field primers, regional analysis, and operational guidance.
            </p>
          </div>
        </section>

        {/* Ledger */}
        <BulletinLedger bulletins={bulletins} />
      </main>

      <Footer variant="simple" />
    </div>
  );
}
