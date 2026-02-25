// Data provider that integrates Sanity CMS with static data fallback
// This allows the site to work even if Sanity is unavailable
//
// Uses an optimistic strategy: the real query IS the health check.
// No separate probe request — if the query succeeds, Sanity is up.
// If it fails, we fall back to static data and remember the failure.

import { sanityClient } from './sanity'
import {
  cryptidsListQuery,
  filteredCryptidsQuery,
  cryptidBySlugQuery,
  cryptidByIdQuery,
  mapCryptidsQuery,
  relatedCryptidsQuery,
  anomaliesListQuery,
  filteredAnomaliesQuery,
  anomalyBySlugQuery,
  mapAnomaliesQuery,
  relatedAnomaliesQuery,
} from './sanity-queries'
import { cryptids as staticCryptids } from '@/data/cryptids'
import type {
  SanityCryptid,
  SanityCryptidListItem,
  SanityCryptidMapItem,
  SanityAnomaly,
  SanityAnomalyListItem,
  SanityAnomalyMapItem,
} from '@/types/sanity'

// Sanity availability state: null = unknown, true/false = confirmed
let sanityAvailable: boolean | null = null

// Session storage keys for caching availability across navigations
const SANITY_AVAILABLE_KEY = 'sanity-available'
const SANITY_CHECK_EXPIRY_KEY = 'sanity-check-expiry'
const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutes

// Initialize from sessionStorage if available
if (typeof window !== 'undefined') {
  try {
    const expiry = sessionStorage.getItem(SANITY_CHECK_EXPIRY_KEY)
    if (expiry && Date.now() < parseInt(expiry, 10)) {
      const cached = sessionStorage.getItem(SANITY_AVAILABLE_KEY)
      if (cached !== null) {
        sanityAvailable = cached === 'true'
      }
    }
  } catch {
    // sessionStorage not available
  }
}

// Cache the availability result in sessionStorage
function cacheAvailability(available: boolean): void {
  sanityAvailable = available
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(SANITY_AVAILABLE_KEY, String(available))
      sessionStorage.setItem(SANITY_CHECK_EXPIRY_KEY, String(Date.now() + CACHE_DURATION_MS))
    } catch {
      // sessionStorage not available
    }
  }
}

// Optimistic Sanity fetch: try the real query, fall back on failure.
// Eliminates the separate health-check round-trip on first load.
async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  // Known down — skip immediately
  if (sanityAvailable === false) return null

  try {
    const result = await sanityClient.fetch<T>(query, params)
    if (sanityAvailable === null) {
      cacheAvailability(true)
    }
    return result
  } catch (error) {
    if (sanityAvailable === null) {
      console.log('Sanity unavailable, falling back to static data:', error)
      cacheAvailability(false)
    }
    return null
  }
}

// Coordinates for cryptid locations (used for static fallback)
const cryptidCoordinates: Record<string, { lat: number; lng: number }> = {
  mothman: { lat: 38.8451, lng: -82.1371 },
  'wampus-cat': { lat: 35.9606, lng: -83.9207 },
  'moon-eyed-people': { lat: 35.4676, lng: -83.5174 },
  'skunk-ape': { lat: 25.9543, lng: -81.0503 },
  'lizard-man': { lat: 34.2018, lng: -80.2307 },
  'fouke-monster': { lat: 33.2681, lng: -93.893 },
  tailypo: { lat: 36.6002, lng: -81.2198 },
  'grafton-monster': { lat: 39.3429, lng: -80.0187 },
  'white-screamer': { lat: 34.8, lng: -87.6769 },
}

// Convert static cryptid to Sanity format for consistency
function convertStaticToSanityFormat(
  cryptid: (typeof staticCryptids)[0]
): SanityCryptid {
  const coords = cryptidCoordinates[cryptid.id]

  return {
    _id: cryptid.id,
    _type: 'cryptid',
    name: cryptid.name,
    slug: { _type: 'slug', current: cryptid.id },
    scientificName: cryptid.scientificName,
    location: cryptid.location,
    coordinates: coords
      ? { _type: 'geopoint', lat: coords.lat, lng: coords.lng }
      : undefined,
    region: cryptid.region as 'Appalachia' | 'Southeast' | 'Southern',
    dangerLevel: cryptid.dangerLevel,
    firstDocumented: cryptid.firstDocumented,
    description: cryptid.description,
    // For static images, we'll use the path directly (not Sanity image refs)
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
  }
}

// Static fallback: filter cryptids locally
function getStaticCryptids(filters?: {
  region?: string
  dangerLevel?: string
  search?: string
}): SanityCryptidListItem[] {
  let results = staticCryptids.map(convertStaticToSanityFormat)

  if (filters?.region && filters.region !== 'all') {
    const normalizedFilter = filters.region.toLowerCase()
    results = results.filter(
      (c) => c.region.toLowerCase() === normalizedFilter
    )
  }

  if (filters?.dangerLevel && filters.dangerLevel !== 'all') {
    results = results.filter((c) => c.dangerLevel === filters.dangerLevel)
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase()
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.location.toLowerCase().includes(search) ||
        (c.description?.toLowerCase().includes(search) ?? false)
    )
  }

  return results
}

// Helper to get static image path
export function getStaticImagePath(cryptidId: string, type: 'detail' | 'grid'): string {
  const staticCryptid = staticCryptids.find((c) => c.id === cryptidId)
  if (!staticCryptid) return '/cryptids/mothman.webp' // fallback
  return type === 'detail' ? staticCryptid.image : staticCryptid.gridImage
}

// Get all cryptids (for index page)
export async function fetchCryptids(filters?: {
  region?: string
  dangerLevel?: string
  search?: string
}): Promise<SanityCryptidListItem[]> {
  if (filters?.region || filters?.dangerLevel || filters?.search) {
    const result = await sanityFetch<SanityCryptidListItem[]>(filteredCryptidsQuery, {
      region: filters.region || 'all',
      dangerLevel: filters.dangerLevel || 'all',
      search: filters.search ? `*${filters.search}*` : '',
    })
    return result ?? getStaticCryptids(filters)
  }

  const result = await sanityFetch<SanityCryptidListItem[]>(cryptidsListQuery)
  return result ?? getStaticCryptids()
}

// Get single cryptid by slug
export async function fetchCryptidBySlug(
  slug: string
): Promise<SanityCryptid | null> {
  const result = await sanityFetch<SanityCryptid>(cryptidBySlugQuery, { slug })
  if (result) return result

  // Fallback to static data - try to match by slug/id
  const cryptid = staticCryptids.find((c) => c.id === slug)
  return cryptid ? convertStaticToSanityFormat(cryptid) : null
}

// Get single cryptid by ID (for backwards compatibility)
export async function fetchCryptidById(
  id: string
): Promise<SanityCryptid | null> {
  const result = await sanityFetch<SanityCryptid>(cryptidByIdQuery, { id })
  if (result) return result

  // Fallback to static data
  const cryptid = staticCryptids.find((c) => c.id === id)
  return cryptid ? convertStaticToSanityFormat(cryptid) : null
}

// Get cryptids for map (with coordinates)
export async function fetchMapCryptids(): Promise<SanityCryptidMapItem[]> {
  const result = await sanityFetch<SanityCryptidMapItem[]>(mapCryptidsQuery)
  if (result) return result

  // Fallback to static data with coordinates
  return staticCryptids
    .filter((c) => cryptidCoordinates[c.id])
    .map((c) => {
      const coords = cryptidCoordinates[c.id]
      return {
        _id: c.id,
        name: c.name,
        slug: { _type: 'slug' as const, current: c.id },
        location: c.location,
        dangerLevel: c.dangerLevel,
        coordinates: { _type: 'geopoint' as const, lat: coords.lat, lng: coords.lng },
        description: c.description,
        gridImage: undefined, // Static images handled separately
      }
    })
}

// Get related cryptids (same region or danger level)
export async function fetchRelatedCryptids(
  slug: string,
  region: string,
  dangerLevel: string
): Promise<SanityCryptidListItem[]> {
  const result = await sanityFetch<SanityCryptidListItem[]>(relatedCryptidsQuery, { slug, region, dangerLevel })
  if (result) return result

  // Fallback to static data
  return staticCryptids
    .filter((c) => c.id !== slug && (c.region === region || c.dangerLevel === dangerLevel))
    .slice(0, 3)
    .map(convertStaticToSanityFormat)
}

// Check if using Sanity or static data
export async function isUsingSanity(): Promise<boolean> {
  return sanityAvailable === true
}

// Force refresh availability check
export function resetSanityCheck(): void {
  sanityAvailable = null
}

// ============================================
// ANOMALY FETCH FUNCTIONS (Anomalies Desk)
// ============================================

// Get all anomalies (for Anomalies Desk page)
export async function fetchAnomalies(filters?: {
  anomalyType?: string
  status?: string
  region?: string
  search?: string
}): Promise<SanityAnomalyListItem[]> {
  if (filters?.anomalyType || filters?.status || filters?.region || filters?.search) {
    return await sanityFetch<SanityAnomalyListItem[]>(filteredAnomaliesQuery, {
      anomalyType: filters.anomalyType || 'all',
      status: filters.status || 'all',
      region: filters.region || 'all',
      search: filters.search ? `*${filters.search}*` : '',
    }) ?? []
  }

  return await sanityFetch<SanityAnomalyListItem[]>(anomaliesListQuery) ?? []
}

// Get single anomaly by slug
export async function fetchAnomalyBySlug(
  slug: string
): Promise<SanityAnomaly | null> {
  return sanityFetch<SanityAnomaly>(anomalyBySlugQuery, { slug })
}

// Get anomalies for map (with coordinates)
export async function fetchMapAnomalies(): Promise<SanityAnomalyMapItem[]> {
  return await sanityFetch<SanityAnomalyMapItem[]>(mapAnomaliesQuery) ?? []
}

// Get related anomalies (same type or region)
export async function fetchRelatedAnomalies(
  slug: string,
  anomalyType: string,
  region: string
): Promise<SanityAnomalyListItem[]> {
  return await sanityFetch<SanityAnomalyListItem[]>(relatedAnomaliesQuery, { slug, anomalyType, region }) ?? []
}
