import type { Metadata } from "next";
import { fetchMapCryptids, fetchMapAnomalies } from "@/lib/sanity/fetchers";
import { MapShell } from "./MapShell";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sighting Map",
  description:
    "Interactive map of cryptid sightings and anomaly case files across Appalachia and the American South.",
  alternates: {
    canonical: "/map",
  },
};

export default async function MapPage() {
  const [cryptids, anomalies] = await Promise.all([
    fetchMapCryptids(),
    fetchMapAnomalies(),
  ]);

  return (
    <div className="min-h-screen bg-background paper-texture">
      <main id="main-content" className="py-16 px-6 lg:py-20 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Server-rendered so crawlers see a real h1; CryptidMap is
              client-only (ssr: false) and has no heading of its own. */}
          <h1 className="sr-only">Sighting Map</h1>
          <MapShell cryptids={cryptids} anomalies={anomalies} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
