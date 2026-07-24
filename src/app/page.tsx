import type { Metadata } from "next";
import Link from "next/link";
import { fetchCryptids, fetchBulletins } from "@/lib/sanity/fetchers";
import { CryptidFilters } from "@/components/CryptidFilters";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { DeferredMount } from "@/components/DeferredMount";
import { FeaturedCryptid } from "@/components/FeaturedCryptid";
import { BulletinTeaser } from "@/components/BulletinTeaser";
import { SightingsMapTeaser } from "@/components/SightingsMapTeaser";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Appalachian Cryptid Field Guide — Creatures of the Mountains & the American South",
  description:
    "Field guide to the cryptids, monsters, and unexplained mysteries of Appalachia and the American South — case files documented by the Bureau.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const [cryptids, bulletins] = await Promise.all([
    fetchCryptids(),
    fetchBulletins(),
  ]);

  const featuredCryptid =
    cryptids.find((c) => c.featured) ?? cryptids[0] ?? null;

  return (
    <div className="min-h-screen bg-background paper-texture">
      <main id="main-content">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative py-16 px-6 lg:py-20 lg:px-8 text-center overflow-hidden border-b border-border">
          {/* Subtle top gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(to bottom, hsla(152 35% 28% / 0.04), transparent 70%)",
            }}
          />

          <div className="relative z-10 max-w-[680px] mx-auto">
            {/* Classification label */}
            <div className="flex items-center justify-center gap-3.5 mb-6" aria-hidden="true">
              <span className="block w-10 h-px bg-border" />
              <span className="font-typewriter text-xs tracking-eyebrow uppercase text-bureau-ink-muted">
                Appalachian Cryptid Division — Working Document
              </span>
              <span className="block w-10 h-px bg-border" />
            </div>

            {/* Heading */}
            <h1 className="font-display font-bold text-foreground leading-[1.08] tracking-tight mb-6 text-[clamp(2.2rem,5.5vw,3.75rem)]">
              Creatures of the Mountains
              <br />
              <span className="text-primary block">and the American South</span>
            </h1>

            {/* SEO description */}
            <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-[520px] mx-auto mb-2">
              The <strong className="text-foreground font-semibold">Appalachian Cryptid Field Guide</strong> documents cryptids, monsters, unexplained mysteries and lore from the hollers of{" "}
              <strong className="text-foreground font-semibold">West Virginia</strong>,{" "}
              <strong className="text-foreground font-semibold">Tennessee</strong>,{" "}
              <strong className="text-foreground font-semibold">Virginia</strong>,{" "}
              <strong className="text-foreground font-semibold">North Carolina</strong> and the greater American South.
            </p>

            {/* Typewriter tagline */}
            <p className="font-typewriter text-xs text-bureau-ink-muted tracking-wider opacity-70 mb-10">
              Each entry is documented, cross-referenced, and filed.
            </p>

            {/* Quick links: one stamped primary action + typed index line */}
            <div className="flex flex-col items-center gap-[18px]">
              <Link
                href="#field-guide"
                className="stamp-btn text-[15px] px-7 py-3 text-bureau-stamp-ink"
                style={{ "--stamp-rot": "-2deg" } as React.CSSProperties}
              >
                <span
                  className="flex items-center gap-2"
                  style={{ filter: "url(#__svg-stamp-texture)" }}
                >
                  <span aria-hidden="true" className="text-[11px] tracking-normal">
                    ★
                  </span>
                  Explore the Guide
                  <span aria-hidden="true" className="text-[11px] tracking-normal">
                    ★
                  </span>
                </span>
              </Link>
              <p className="font-typewriter text-xs tracking-[0.06em] text-bureau-ink-muted">
                <span aria-hidden="true">Also on file: </span>
                <Link
                  href="/map"
                  className="text-primary border-b border-dotted border-primary/60 hover:border-solid"
                >
                  Sightings Map
                </Link>
                <span aria-hidden="true" className="text-foreground/30 mx-2">
                  ·
                </span>
                <Link
                  href="/bulletins"
                  className="text-primary border-b border-dotted border-primary/60 hover:border-solid"
                >
                  Bureau Bulletins
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* ── Editorial Row: Featured Cryptid + Bulletin Teasers ────── */}
        {(featuredCryptid || bulletins.length > 0) && (
          <section className="border-b border-border" aria-label="Featured case file and recent bulletins">
            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {featuredCryptid && (
                  <FeaturedCryptid cryptid={featuredCryptid} />
                )}
                {bulletins.length > 0 && (
                  <BulletinTeaser bulletins={bulletins} />
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Newsletter (slim, inline) ─────────────────────────────── */}
        <section
          className="border-b border-border bg-card/30"
          aria-label="Email newsletter signup"
        >
          <div className="max-w-3xl mx-auto px-6 lg:px-8 py-6">
            <p className="font-typewriter text-[10px] tracking-eyebrow uppercase text-muted-foreground mb-3 text-center">
              Bureau Dispatches — Standing Order
            </p>
            <NewsletterSignup variant="compact" />
          </div>
        </section>

        {/* ── Cryptid Directory ─────────────────────────────────────── */}
        <section
          id="field-guide"
          className="py-8 border-b border-border"
          aria-label="Cryptid directory"
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8 mb-6">
            <p className="font-typewriter text-[10px] tracking-label uppercase text-muted-foreground mb-1">
              Bureau Active Case Files — {cryptids.length} Entries
            </p>
            <h2 className="font-display font-bold text-2xl text-foreground">
              The Case Drawers
            </h2>
          </div>
          <CryptidFilters cryptids={cryptids} />
        </section>

        {/* ── Sightings Map Teaser ──────────────────────────────────── */}
        <SightingsMapTeaser />

        {/* ── Newsletter ────────────────────────────────────────────── */}
        <section className="py-16 px-6 lg:py-20 lg:px-8 border-t border-border bg-card/50">
          <div className="max-w-6xl mx-auto text-center">
            <p className="font-typewriter text-xs tracking-eyebrow uppercase text-muted-foreground mb-2">
              Email Newsletter
            </p>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">
              Get New Cryptid Alerts
            </h2>
            <p className="font-typewriter text-sm text-muted-foreground max-w-md mx-auto mb-8">
              Sign up and we&apos;ll email you when new creatures are added to
              the guide or the Bureau has news to report.
            </p>
            <DeferredMount minHeight={150}>
              <NewsletterSignup />
            </DeferredMount>
          </div>
        </section>

      </main>

      <Footer variant="full" />
    </div>
  );
}
