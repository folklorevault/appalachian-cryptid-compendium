import type { Metadata } from "next";
import Link from "next/link";
import { fetchCryptids } from "@/lib/sanity/fetchers";
import { CryptidFilters } from "@/components/CryptidFilters";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const cryptids = await fetchCryptids();

  return (
    <div className="min-h-screen bg-background paper-texture">
      <main id="main-content">
        {/* ── Hero ─────────────────────────────────── */}
        <section className="relative py-20 px-6 lg:py-24 lg:px-8 text-center overflow-hidden">
          {/* Subtle green gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(to bottom, hsla(152 35% 28% / 0.04), transparent 70%)",
            }}
          />

          <div className="relative z-10 max-w-[680px] mx-auto">
            {/* Classification label with decorative rules */}
            <div className="flex items-center justify-center gap-3.5 mb-6">
              <span
                className="block w-10 h-px bg-border"
                aria-hidden="true"
              />
              <span className="font-typewriter text-xs tracking-[0.2em] uppercase text-[hsl(var(--bureau-ink-muted))]">
                Appalachian Cryptid Division — Working Document
              </span>
              <span
                className="block w-10 h-px bg-border"
                aria-hidden="true"
              />
            </div>

            {/* Heading */}
            <h1 className="font-display font-bold text-foreground leading-[1.08] tracking-tight mb-7 text-[clamp(2.2rem,5.5vw,3.75rem)]">
              Creatures of the Mountains
              <br />
              <span className="text-primary block">
                &amp; the American South
              </span>
            </h1>

            {/* Typewriter description */}
            <p className="font-typewriter text-sm text-muted-foreground leading-relaxed max-w-[480px] mx-auto mb-3 tracking-wide">
              Front-porch stories, backroad sightings, and local legends from
              the mountains and hollers of Appalachia and the American South.
            </p>

            {/* Provenance line */}
            <p className="font-typewriter text-xs text-[hsl(var(--bureau-ink-muted))] tracking-wider opacity-65">
              Compiled from witness reports and ongoing field research
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link
                href="#field-guide"
                className="font-typewriter text-sm tracking-[0.08em] uppercase text-primary-foreground bg-primary px-7 py-3 hover:bg-primary/90 transition-colors"
              >
                Explore the Guide
              </Link>
              <Link
                href="/report"
                className="font-typewriter text-sm tracking-[0.08em] uppercase text-[hsl(var(--bureau-stamp))] border-2 border-[hsl(var(--bureau-stamp))] px-6 py-2.5 opacity-85 hover:opacity-100 hover:bg-[hsl(var(--bureau-stamp)/0.05)] transition-all -rotate-1"
              >
                Report a Sighting
              </Link>
            </div>
          </div>
        </section>

        {/* ── Filters + Card Grid ─────────────────── */}
        <CryptidFilters cryptids={cryptids} />

        {/* ── Newsletter ──────────────────────────── */}
        <section className="py-16 px-6 lg:py-20 lg:px-8 border-t border-border bg-card/50">
          <div className="max-w-6xl mx-auto text-center">
            <p className="font-typewriter text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Email Newsletter
            </p>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">
              Get New Cryptid Alerts
            </h2>
            <p className="font-typewriter text-sm text-muted-foreground max-w-md mx-auto mb-8">
              Sign up and we&apos;ll email you when new creatures are added to
              the guide or the Bureau has news to report.
            </p>
            <NewsletterSignup />
          </div>
        </section>
      </main>

      <Footer variant="full" />
    </div>
  );
}
