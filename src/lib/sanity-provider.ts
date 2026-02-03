// Data provider that integrates Sanity CMS with static data fallback
// This allows the site to work even if Sanity is unavailable

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

let sanityAvailable: boolean | null = null

// Session storage key for caching Sanity availability
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

// Check if Sanity is available and configured
async function checkSanityAvailability(): Promise<boolean> {
  if (sanityAvailable !== null) return sanityAvailable

  try {
    // Try to fetch a single document ID to verify connection
    await sanityClient.fetch('*[_type == "cryptid"][0]._id')
    sanityAvailable = true
    console.log('Sanity connection successful')
  } catch (error) {
    console.log('Sanity unavailable, falling back to static data:', error)
    sanityAvailable = false
  }

  // Cache the result in sessionStorage to avoid check on subsequent navigations
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(SANITY_AVAILABLE_KEY, String(sanityAvailable))
      sessionStorage.setItem(SANITY_CHECK_EXPIRY_KEY, String(Date.now() + CACHE_DURATION_MS))
    } catch {
      // sessionStorage not available
    }
  }

  return sanityAvailable
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
  const useSanity = await checkSanityAvailability()

  if (useSanity) {
    if (filters?.region || filters?.dangerLevel || filters?.search) {
      return sanityClient.fetch(filteredCryptidsQuery, {
        region: filters.region || 'all',
        dangerLevel: filters.dangerLevel || 'all',
        search: filters.search ? `*${filters.search}*` : '',
      })
    }
    return sanityClient.fetch(cryptidsListQuery)
  }

  // Fallback to static data
  let results = staticCryptids.map(convertStaticToSanityFormat)

  // Normalize region comparison (case-insensitive)
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

// Get single cryptid by slug
export async function fetchCryptidBySlug(
  slug: string
): Promise<SanityCryptid | null> {
  const useSanity = await checkSanityAvailability()

  if (useSanity) {
    try {
      const cryptid = await sanityClient.fetch(cryptidBySlugQuery, { slug })
      return cryptid
    } catch {
      return null
    }
  }

  // Fallback to static data - try to match by slug/id
  const cryptid = staticCryptids.find((c) => c.id === slug)
  return cryptid ? convertStaticToSanityFormat(cryptid) : null
}

// Get single cryptid by ID (for backwards compatibility)
export async function fetchCryptidById(
  id: string
): Promise<SanityCryptid | null> {
  const useSanity = await checkSanityAvailability()

  if (useSanity) {
    try {
      const cryptid = await sanityClient.fetch(cryptidByIdQuery, { id })
      return cryptid
    } catch {
      return null
    }
  }

  // Fallback to static data
  const cryptid = staticCryptids.find((c) => c.id === id)
  return cryptid ? convertStaticToSanityFormat(cryptid) : null
}

// Get cryptids for map (with coordinates)
export async function fetchMapCryptids(): Promise<SanityCryptidMapItem[]> {
  const useSanity = await checkSanityAvailability()

  if (useSanity) {
    return sanityClient.fetch(mapCryptidsQuery)
  }

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
  const useSanity = await checkSanityAvailability()

  if (useSanity) {
    return sanityClient.fetch(relatedCryptidsQuery, { slug, region, dangerLevel })
  }

  // Fallback to static data
  return staticCryptids
    .filter((c) => c.id !== slug && (c.region === region || c.dangerLevel === dangerLevel))
    .slice(0, 3)
    .map(convertStaticToSanityFormat)
}

// Check if using Sanity or static data
export async function isUsingSanity(): Promise<boolean> {
  return checkSanityAvailability()
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
  const useSanity = await checkSanityAvailability()

  if (useSanity) {
    if (filters?.anomalyType || filters?.status || filters?.region || filters?.search) {
      return sanityClient.fetch(filteredAnomaliesQuery, {
        anomalyType: filters.anomalyType || 'all',
        status: filters.status || 'all',
        region: filters.region || 'all',
        search: filters.search ? `*${filters.search}*` : '',
      })
    }
    return sanityClient.fetch(anomaliesListQuery)
  }

  // No static fallback for anomalies - return empty array
  // User will need to add content via Sanity
  return []
}

// Get single anomaly by slug
export async function fetchAnomalyBySlug(
  slug: string
): Promise<SanityAnomaly | null> {
  const useSanity = await checkSanityAvailability()

  if (useSanity) {
    try {
      const anomaly = await sanityClient.fetch(anomalyBySlugQuery, { slug })
      return anomaly
    } catch {
      return null
    }
  }

  return null
}

// Get anomalies for map (with coordinates)
export async function fetchMapAnomalies(): Promise<SanityAnomalyMapItem[]> {
  const useSanity = await checkSanityAvailability()

  if (useSanity) {
    return sanityClient.fetch(mapAnomaliesQuery)
  }

  return []
}

// Get related anomalies (same type or region)
export async function fetchRelatedAnomalies(
  slug: string,
  anomalyType: string,
  region: string
): Promise<SanityAnomalyListItem[]> {
  const useSanity = await checkSanityAvailability()

  if (useSanity) {
    return sanityClient.fetch(relatedAnomaliesQuery, { slug, anomalyType, region })
  }

  return []
}
