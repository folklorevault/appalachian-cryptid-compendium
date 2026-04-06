import type { Metadata } from "next";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { fetchCryptids, fetchAnomalies } from "@/lib/sanity/fetchers";
import { FieldGuideContent } from "@/components/FieldGuideContent";

export const metadata: Metadata = {
  title: "Field Guide - Complete Reference",
  description:
    "A naturalist's field guide to the cryptids, creatures, anomalies, and strange phenomena of the Appalachian Mountains and American South.",
  alternates: {
    canonical: "/field-guide",
  },
};

export default async function FieldGuidePage() {
  const [cryptids, anomalies] = await Promise.all([
    fetchCryptids(),
    fetchAnomalies(),
  ]);

  return (
    <div className="min-h-screen bg-background paper-texture">
      <FieldGuideContent cryptids={cryptids} anomalies={anomalies} />
      <Footer variant="full" />
      <BackToTop />
    </div>
  );
}
