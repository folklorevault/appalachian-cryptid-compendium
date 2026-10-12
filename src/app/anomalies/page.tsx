import type { Metadata } from "next";
import { fetchAnomalies } from "@/lib/sanity/fetchers";
import { AnomalyLedger, type LedgerEntry } from "@/components/AnomalyLedger";
import { formatFileNo } from "@/lib/anomalyFile";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Anomalies Desk",
  description:
    "Lights, hauntings, curses, and other unresolved Appalachian incidents — the Bureau's catalog of unexplained phenomena.",
  alternates: {
    canonical: "/anomalies",
  },
  openGraph: {
    title: "Anomalies Desk | Appalachian Cryptid Field Guide",
    description:
      "Lights, hauntings, curses, and other unresolved Appalachian incidents.",
    url: "https://appalachiancryptid.com/anomalies",
  },
};

export default async function AnomaliesPage() {
  const anomalies = await fetchAnomalies();
  if (anomalies.length === 0) {
    // fetchAnomalies swallows Sanity errors and there is no static fallback,
    // so an empty list here is an outage. Make it findable in the logs.
    console.error("[anomalies] ledger rendered with 0 files: Sanity fetch failed or returned nothing");
  }

  // File numbers follow creation order (oldest = 001) so a file keeps its
  // number as new ones arrive; the ledger lists newest first.
  const byAge = [...anomalies].sort((a, b) =>
    (a._createdAt ?? "").localeCompare(b._createdAt ?? "")
  );
  const width = Math.max(3, String(byAge.length).length);
  const entries: LedgerEntry[] = byAge
    .map((anomaly, i) => ({ anomaly, fileNo: formatFileNo(i + 1, width) }))
    .reverse();

  const active = anomalies.filter((a) => a.status === "Active").length;
  const cold = anomalies.filter((a) => a.status === "Cold").length;

  return (
    <div className="min-h-screen bg-background paper-texture">
      <main id="main-content">
        {/* ── The desk: ink plate, same stock as the homepage band ── */}
        <section
          className="plate-stock plate-ink relative border-b border-border bg-bureau-ink text-bureau-manila-light paper-texture"
          aria-labelledby="anomalies-heading"
        >
          <div className="relative z-2 max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid gap-10 pt-12 pb-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end lg:gap-14 lg:pt-16 lg:pb-10">
              <div>
                <p className="flex items-center gap-3.5 mb-4.5 font-typewriter text-xs tracking-eyebrow uppercase text-bureau-rust-ink">
                  <span className="block w-10 h-px bg-current opacity-70" aria-hidden="true" />
                  Open Investigations
                </p>
                <h1
                  id="anomalies-heading"
                  className="font-display font-bold text-hero leading-[1.08] tracking-tight text-bureau-paper text-balance mb-6"
                >
                  The Anomalies Desk
                </h1>
                <p className="font-sans text-base leading-relaxed text-bureau-manila-light/90 max-w-[54ch] mb-3.5">
                  Lights nobody can account for, sounds nobody wants to answer,
                  places where something simply isn&rsquo;t right. Appalachian
                  stories that have traveled through the mountains and beyond
                  for generations.
                </p>
                <p className="font-typewriter text-xs tracking-type text-bureau-manila-light/70">
                  None satisfactorily explained.
                </p>
              </div>

              {anomalies.length > 0 && (
                <dl className="flex flex-wrap gap-x-8 gap-y-2.5 font-typewriter text-xs tracking-type">
                  <Tally n={anomalies.length} label={anomalies.length === 1 ? "file on the desk" : "files on the desk"} />
                  {active > 0 && <Tally n={active} label="active" />}
                  {cold > 0 && <Tally n={cold} label="gone cold" />}
                </dl>
              )}
            </div>

            <AnomalyLedger entries={entries} />
          </div>
        </section>

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

function Tally({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="sr-only">{label}</dt>
      <dd className="flex items-baseline gap-1.5">
        <span className="font-display font-bold text-3xl leading-none text-bureau-rust tabular-nums">
          {n}
        </span>
        <span aria-hidden="true">{label}</span>
      </dd>
    </div>
  );
}
