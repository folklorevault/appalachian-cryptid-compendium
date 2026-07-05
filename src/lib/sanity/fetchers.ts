// Server-side data fetchers for Sanity CMS with static fallback
// Used in Server Components — no client-side caching needed.

import { cache } from "react";
import { sanityClient } from "./client";
import {
  cryptidsListQuery,
  filteredCryptidsQuery,
  cryptidBySlugQuery,
  cryptidSlugsQuery,
  cryptidSlugsWithDatesQuery,
  mapCryptidsQuery,
  relatedCryptidsQuery,
  anomaliesListQuery,
  filteredAnomaliesQuery,
  anomalyBySlugQuery,
  anomalySlugsQuery,
  anomalySlugsWithDatesQuery,
  mapAnomaliesQuery,
  relatedAnomaliesQuery,
  bulletinsListQuery,
  bulletinBySlugQuery,
  bulletinsReferencingQuery,
  bulletinSlugsQuery,
  bulletinSlugsWithDatesQuery,
  feedItemsQuery,
  linkInBioQuery,
} from "./queries";
import { cryptids as staticCryptids } from "@/data/cryptids";
import type {
  SanityCryptid,
  SanityCryptidListItem,
  SanityCryptidMapItem,
  SanityAnomaly,
  SanityAnomalyListItem,
  SanityAnomalyMapItem,
  SanityBulletinListItem,
  SanityBulletin,
  SanityLinkInBio,
  FeedItem,
} from "@/types/sanity";
import { bulletins as staticBulletins, bulletinToListItem } from "@/data/bulletins";

// ── Sanity fetch with fallback ───────────────────────────────

async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  tags?: string[]
): Promise<T | null> {
  try {
    return await sanityClient.fetch<T>(query, params, {
      next: { tags: tags ?? ["sanity"] },
    });
  } catch (error) {
    console.error("Sanity fetch failed, falling back to static data:", error);
    return null;
  }
}

// ── Static data conversion ───────────────────────────────────

const cryptidCoordinates: Record<string, { lat: number; lng: number }> = {
  mothman: { lat: 38.8451, lng: -82.1371 },
  "wampus-cat": { lat: 35.9606, lng: -83.9207 },
  "moon-eyed-people": { lat: 35.4676, lng: -83.5174 },
  "skunk-ape": { lat: 25.9543, lng: -81.0503 },
  "lizard-man": { lat: 34.2018, lng: -80.2307 },
  "fouke-monster": { lat: 33.2681, lng: -93.893 },
  tailypo: { lat: 36.6002, lng: -81.2198 },
  "grafton-monster": { lat: 39.3429, lng: -80.0187 },
  "white-screamer": { lat: 34.8, lng: -87.6769 },
};

function convertStaticToSanityFormat(
  cryptid: (typeof staticCryptids)[0]
): SanityCryptid {
  const coords = cryptidCoordinates[cryptid.id];

  return {
    _id: cryptid.id,
    _type: "cryptid",
    name: cryptid.name,
    slug: { _type: "slug", current: cryptid.id },
    scientificName: cryptid.scientificName,
    location: cryptid.location,
    coordinates: coords
      ? { _type: "geopoint", lat: coords.lat, lng: coords.lng }
      : undefined,
    // Cast is safe only if static data uses exact casing matching the union type.
    // If a new region is added to static data, update the union in src/types/sanity.ts.
    region: cryptid.region as "Appalachia" | "Southeast" | "Southern",
    dangerLevel: cryptid.dangerLevel,
    firstDocumented: cryptid.firstDocumented,
    description: cryptid.description,
    image: undefined,
    gridImage: undefined,
    tags: cryptid.tags,
    physicalDescription: cryptid.physicalDescription,
    behavior: cryptid.behavior,
    habitat: cryptid.habitat,
    diet: cryptid.diet,
    testimonies: cryptid.testimonies.map((t, idx) => ({
      _key: `testimony-${idx}`,
      witness: t.witness,
      date: t.date,
      location: t.location,
      account: t.account,
    })),
    notableSightings: cryptid.notableSightings,
    bureauNotes: cryptid.bureauNotes,
    featured: cryptid.featured,
  };
}

function getStaticCryptids(filters?: {
  region?: string;
  dangerLevel?: string;
  search?: string;
}): SanityCryptidListItem[] {
  let results = staticCryptids.map(convertStaticToSanityFormat);

  if (filters?.region && filters.region !== "all") {
    results = results.filter(
      (c) => c.region.toLowerCase() === filters.region!.toLowerCase()
    );
  }
  if (filters?.dangerLevel && filters.dangerLevel !== "all") {
    results = results.filter((c) => c.dangerLevel === filters.dangerLevel);
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.location.toLowerCase().includes(search) ||
        (c.description?.toLowerCase().includes(search) ?? false)
    );
  }

  return results;
}

// ── Cryptid fetchers ─────────────────────────────────────────

export async function fetchCryptids(filters?: {
  region?: string;
  dangerLevel?: string;
  search?: string;
}): Promise<SanityCryptidListItem[]> {
  if (filters?.region || filters?.dangerLevel || filters?.search) {
    const result = await sanityFetch<SanityCryptidListItem[]>(
      filteredCryptidsQuery,
      {
        region: filters.region || "all",
        dangerLevel: filters.dangerLevel || "all",
        search: filters.search ? `*${filters.search}*` : "",
      },
      ["cryptids"]
    );
    return result ?? getStaticCryptids(filters);
  }

  const result =
    await sanityFetch<SanityCryptidListItem[]>(cryptidsListQuery, undefined, ["cryptids"]);
  return result ?? getStaticCryptids();
}

// Note: React.cache() deduplicates within a single render tree, but Next.js App Router
// runs generateMetadata and the page component in separate async contexts, so a second
// Sanity fetch will still occur for the same slug. Full deduplication would require
// next/cache unstable_cache, which is a larger refactor.
export const fetchCryptidBySlug = cache(async (
  slug: string
): Promise<SanityCryptid | null> => {
  const result = await sanityFetch<SanityCryptid>(cryptidBySlugQuery, {
    slug,
  }, ["cryptids", `cryptid-${slug}`]);
  if (result) return result;

  const cryptid = staticCryptids.find((c) => c.id === slug);
  return cryptid ? convertStaticToSanityFormat(cryptid) : null;
});

export async function fetchCryptidSlugs(): Promise<string[]> {
  const result = await sanityFetch<string[]>(cryptidSlugsQuery, undefined, ["cryptids"]);
  return result ?? staticCryptids.map((c) => c.id);
}

export async function fetchMapCryptids(): Promise<SanityCryptidMapItem[]> {
  const result = await sanityFetch<SanityCryptidMapItem[]>(mapCryptidsQuery, undefined, ["cryptids"]);
  if (result) return result;

  return staticCryptids
    .filter((c) => cryptidCoordinates[c.id])
    .map((c) => {
      const coords = cryptidCoordinates[c.id];
      return {
        _id: c.id,
        name: c.name,
        slug: { _type: "slug" as const, current: c.id },
        location: c.location,
        dangerLevel: c.dangerLevel,
        coordinates: {
          _type: "geopoint" as const,
          lat: coords.lat,
          lng: coords.lng,
        },
        description: c.description,
        gridImage: undefined,
      };
    });
}

export async function fetchRelatedCryptids(
  slug: string,
  region: string,
  dangerLevel: string
): Promise<SanityCryptidListItem[]> {
  const result = await sanityFetch<SanityCryptidListItem[]>(
    relatedCryptidsQuery,
    { slug, region, dangerLevel },
    ["cryptids"]
  );
  if (result) return result;

  return staticCryptids
    .filter(
      (c) =>
        c.id !== slug &&
        (c.region === region || c.dangerLevel === dangerLevel)
    )
    .slice(0, 3)
    .map(convertStaticToSanityFormat);
}

export type SlugWithDate = { slug: string; _updatedAt: string };

export async function fetchCryptidSlugsWithDates(): Promise<SlugWithDate[]> {
  const result = await sanityFetch<SlugWithDate[]>(cryptidSlugsWithDatesQuery, undefined, ["cryptids"]);
  return result ?? staticCryptids.map((c) => ({ slug: c.id, _updatedAt: new Date().toISOString() }));
}

// ── Anomaly fetchers ─────────────────────────────────────────
// Note: Unlike cryptids, there is no static fallback data for anomalies. All anomaly
// content is Sanity-only. If Sanity is unavailable, anomaly pages will be empty and
// generateStaticParams will produce no anomaly routes. To add resilience, create a
// src/data/anomalies.ts seed file (mirroring src/data/cryptids.ts) and wire it in here.

export async function fetchAnomalies(filters?: {
  anomalyType?: string;
  status?: string;
  region?: string;
  search?: string;
}): Promise<SanityAnomalyListItem[]> {
  if (
    filters?.anomalyType ||
    filters?.status ||
    filters?.region ||
    filters?.search
  ) {
    return (
      (await sanityFetch<SanityAnomalyListItem[]>(filteredAnomaliesQuery, {
        anomalyType: filters.anomalyType || "all",
        status: filters.status || "all",
        region: filters.region || "all",
        search: filters.search ? `*${filters.search}*` : "",
      }, ["anomalies"])) ?? []
    );
  }

  return (
    (await sanityFetch<SanityAnomalyListItem[]>(anomaliesListQuery, undefined, ["anomalies"])) ?? []
  );
}

export const fetchAnomalyBySlug = cache(async (
  slug: string
): Promise<SanityAnomaly | null> => {
  return sanityFetch<SanityAnomaly>(anomalyBySlugQuery, { slug }, ["anomalies", `anomaly-${slug}`]);
});

export async function fetchAnomalySlugs(): Promise<string[]> {
  return (await sanityFetch<string[]>(anomalySlugsQuery, undefined, ["anomalies"])) ?? [];
}

export async function fetchMapAnomalies(): Promise<SanityAnomalyMapItem[]> {
  return (
    (await sanityFetch<SanityAnomalyMapItem[]>(mapAnomaliesQuery, undefined, ["anomalies"])) ?? []
  );
}

export async function fetchRelatedAnomalies(
  slug: string,
  anomalyType: string,
  region: string
): Promise<SanityAnomalyListItem[]> {
  return (
    (await sanityFetch<SanityAnomalyListItem[]>(relatedAnomaliesQuery, {
      slug,
      anomalyType,
      region,
    }, ["anomalies"])) ?? []
  );
}

export async function fetchAnomalySlugsWithDates(): Promise<SlugWithDate[]> {
  return (await sanityFetch<SlugWithDate[]>(anomalySlugsWithDatesQuery, undefined, ["anomalies"])) ?? [];
}

// ── Bulletin fetchers ─────────────────────────────────────────

export async function fetchBulletins(): Promise<SanityBulletinListItem[]> {
  const result = await sanityFetch<SanityBulletinListItem[]>(
    bulletinsListQuery,
    undefined,
    ["bulletins"]
  );
  if (result && result.length > 0) return result;
  return staticBulletins.map(bulletinToListItem);
}

export const fetchBulletinBySlug = cache(async (
  slug: string
): Promise<SanityBulletin | null> => {
  const result = await sanityFetch<SanityBulletin>(
    bulletinBySlugQuery,
    { slug },
    ["bulletins", `bulletin-${slug}`]
  );
  if (result) return result;

  const bulletin = staticBulletins.find((b) => b.slug.current === slug);
  return bulletin ?? null;
});

/**
 * Bulletins that reference a given cryptid or anomaly (by document _id).
 * Powers the reciprocal "Referenced in Bureau Bulletins" section on
 * cryptid/anomaly detail pages. Tagged "bulletins" so editing a bulletin's
 * related refs revalidates these sections too.
 */
export async function fetchBulletinsReferencing(
  id: string
): Promise<SanityBulletinListItem[]> {
  const result = await sanityFetch<SanityBulletinListItem[]>(
    bulletinsReferencingQuery,
    { id },
    ["bulletins"]
  );
  if (result) return result;

  // Static fallback: match against static bulletins' relatedCryptids ids.
  // (Static data has no anomaly references; anomalies are Sanity-only.)
  return staticBulletins
    .filter((b) => b.relatedCryptids?.some((c) => c._id === id))
    .map(bulletinToListItem);
}

export async function fetchBulletinSlugs(): Promise<string[]> {
  const result = await sanityFetch<string[]>(
    bulletinSlugsQuery,
    undefined,
    ["bulletins"]
  );
  if (result && result.length > 0) return result;
  return staticBulletins.map((b) => b.slug.current);
}

export async function fetchBulletinSlugsWithDates(): Promise<SlugWithDate[]> {
  const result = await sanityFetch<SlugWithDate[]>(bulletinSlugsWithDatesQuery, undefined, ["bulletins"]);
  if (result && result.length > 0) return result;
  return staticBulletins.map((b) => ({ slug: b.slug.current, _updatedAt: new Date().toISOString() }));
}

// ── Link in Bio fetcher ──────────────────────────────────────

const fallbackLinkInBio: SanityLinkInBio = {
  _id: "linkInBio-fallback",
  _type: "linkInBio",
  tagline:
    "Documenting the unexplained in the Appalachian region.",
  links: [
    {
      label: "The Field Guide",
      url: "/",
      description: "Catalogued cryptid case files from the Bureau archives.",
    },
    {
      label: "Anomalies Desk",
      url: "/anomalies",
      description: "Hauntings, omen events, and unclassified phenomena.",
    },
    {
      label: "Bureau Bulletins",
      url: "/bulletins",
      description: "Field primers and regional analysis from the Records Division.",
    },
    {
      label: "Sighting Map",
      url: "/map",
      description: "Plotted encounters across the region.",
    },
    {
      label: "Report a Sighting",
      url: "/report",
      description: "Submit a witness account to the Bureau.",
    },
  ],
};

export async function fetchLinkInBio(): Promise<SanityLinkInBio> {
  const result = await sanityFetch<SanityLinkInBio>(linkInBioQuery, undefined, [
    "linkInBio",
  ]);
  return result ?? fallbackLinkInBio;
}

// ── RSS feed fetcher ─────────────────────────────────────────

export async function fetchFeedItems(): Promise<FeedItem[]> {
  const result = await sanityFetch<FeedItem[]>(feedItemsQuery, undefined, [
    "cryptids",
    "anomalies",
    "bulletins",
  ]);
  if (result && result.length > 0) return result;

  // Static fallback (Sanity unavailable): cryptids + bulletins only —
  // there is no static anomaly data. Static cryptids have no real timestamp,
  // so they sort beneath dated bulletins.
  const now = new Date().toISOString();
  const fallback: FeedItem[] = [
    ...staticBulletins.map((b) => ({
      _type: "bulletin" as const,
      _id: b.slug.current,
      title: b.title,
      slug: b.slug.current,
      summary: b.summary,
      publishedAt: b.date,
    })),
    ...staticCryptids.map((c) => ({
      _type: "cryptid" as const,
      _id: c.id,
      title: c.name,
      slug: c.id,
      summary: c.description,
      publishedAt: now,
    })),
  ];
  return fallback
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 30);
}
