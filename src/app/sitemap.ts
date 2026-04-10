import type { MetadataRoute } from "next";
import {
  fetchCryptidSlugsWithDates,
  fetchAnomalySlugsWithDates,
  fetchBulletinSlugsWithDates,
} from "@/lib/sanity/fetchers";

const BASE_URL = "https://appalachiancryptid.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cryptids, anomalies, bulletins] = await Promise.all([
    fetchCryptidSlugsWithDates(),
    fetchAnomalySlugsWithDates(),
    fetchBulletinSlugsWithDates(),
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
      url: `${BASE_URL}/bulletins`,
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
      url: `${BASE_URL}/shop`,
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

  const cryptidPages: MetadataRoute.Sitemap = cryptids.map((c) => ({
    url: `${BASE_URL}/cryptid/${c.slug}`,
    lastModified: new Date(c._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const anomalyPages: MetadataRoute.Sitemap = anomalies.map((a) => ({
    url: `${BASE_URL}/anomaly/${a.slug}`,
    lastModified: new Date(a._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const bulletinPages: MetadataRoute.Sitemap = bulletins.map((b) => ({
    url: `${BASE_URL}/bulletin/${b.slug}`,
    lastModified: new Date(b._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...cryptidPages, ...anomalyPages, ...bulletinPages];
}
