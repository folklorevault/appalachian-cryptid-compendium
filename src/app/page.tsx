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
    "A catalog of cryptids, monsters, and unexplained mysteries from West Virginia, Tennessee, Virginia, North Carolina, and the greater American South. Documented by the Appalachian Cryptid Bureau.",
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

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="#field-guide"
                className="font-display font-bold uppercase tracking-widest text-xs text-primary-foreground bg-primary border-[3px] border-primary rounded-sm px-6 py-3 shadow-[inset_0_0_0_2px_hsl(var(--primary-foreground)/0.25)] hover:bg-primary/90 transition-colors"
              >
                Explore the Guide
              </Link>
              {[
                { href: "/map", label: "Sightings Map" },
                { href: "/bulletins", label: "Bureau Bulletins" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-display font-bold uppercase tracking-widest text-xs text-bureau-stamp border-[3px] border-bureau-stamp rounded-sm bg-bureau-manila/85 px-6 py-3 shadow-[inset_0_0_0_2px_hsl(var(--bureau-stamp))] hover:bg-bureau-stamp/10 transition-colors"
                >
                  {label}
                </Link>
              ))}
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
