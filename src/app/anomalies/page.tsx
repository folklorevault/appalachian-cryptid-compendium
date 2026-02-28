import type { Metadata } from "next";
import { fetchAnomalies } from "@/lib/sanity/fetchers";
import { AnomalyFilters } from "@/components/AnomalyFilters";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Anomalies Desk",
  description:
    "Lights, hauntings, curses, and other unresolved Appalachian incidents, cataloged like field reports. Browse the Bureau's catalog of unexplained phenomena.",
  openGraph: {
    title: "Anomalies Desk | Appalachian Cryptid Field Guide",
    description:
      "Lights, hauntings, curses, and other unresolved Appalachian incidents.",
    url: "https://appalachiancryptid.com/anomalies",
  },
};

export default async function AnomaliesPage() {
  const anomalies = await fetchAnomalies();

  return (
    <div className="min-h-screen bg-background paper-texture">
      <main id="main-content">
        {/* Hero */}
        <section className="relative py-20 px-6 lg:py-24 lg:px-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-center gap-3.5 mb-6">
              <span className="block w-10 h-px bg-border" aria-hidden="true" />
              <span className="font-typewriter text-xs tracking-[0.2em] uppercase text-[hsl(var(--bureau-ink-muted))]">
                Anomalies Desk — Open Cases
              </span>
              <span className="block w-10 h-px bg-border" aria-hidden="true" />
            </div>
            <h1 className="font-display font-bold text-foreground leading-tight text-[clamp(2.2rem,5.5vw,3.75rem)]">
              Anomalies Desk
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed font-typewriter">
              Lights, hauntings, curses, and other unresolved incidents from the
              mountains and hollers—cataloged from witness reports and ongoing
              investigations.
            </p>
          </div>
        </section>

        {/* Filters + Grid */}
        <AnomalyFilters anomalies={anomalies} />

        {/* Newsletter */}
        <section className="py-16 px-6 lg:py-20 lg:px-8 border-t border-border bg-card/50">
          <div className="max-w-6xl mx-auto">
            <NewsletterSignup />
          </div>
        </section>
      </main>

      <Footer variant="full" />
    </div>
  );
}
