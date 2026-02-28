import type { MetadataRoute } from "next";
import { fetchCryptidSlugs, fetchAnomalySlugs } from "@/lib/sanity/fetchers";

const BASE_URL = "https://appalachiancryptid.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cryptidSlugs, anomalySlugs] = await Promise.all([
    fetchCryptidSlugs(),
    fetchAnomalySlugs(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/field-guide`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/anomalies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/map`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/report`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const cryptidPages: MetadataRoute.Sitemap = cryptidSlugs.map((slug) => ({
    url: `${BASE_URL}/cryptid/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const anomalyPages: MetadataRoute.Sitemap = anomalySlugs.map((slug) => ({
    url: `${BASE_URL}/anomaly/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...cryptidPages, ...anomalyPages];
}
