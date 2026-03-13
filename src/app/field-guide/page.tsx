import type { Metadata } from "next";
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

  return <FieldGuideContent cryptids={cryptids} anomalies={anomalies} />;
}
