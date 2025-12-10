// Data provider that integrates Sanity CMS with static data fallback
// This allows the site to work even if Sanity is unavailable

import { sanityClient } from './sanity'
import {
  cryptidsListQuery,
  filteredCryptidsQuery,
  cryptidBySlugQuery,
  cryptidByIdQuery,
  mapCryptidsQuery,
} from './sanity-queries'
import { cryptids as staticCryptids } from '@/data/cryptids'
import type {
  SanityCryptid,
  SanityCryptidListItem,
  SanityCryptidMapItem,
} from '@/types/sanity'

let sanityAvailable: boolean | null = null

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

  // Check if project ID is configured
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
  if (!projectId || projectId === 'your-project-id') {
    console.log('Sanity not configured, using static data')
    sanityAvailable = false
    return false
  }

  try {
    // Try to fetch a single document ID to verify connection
    await sanityClient.fetch('*[_type == "cryptid"][0]._id')
    sanityAvailable = true
    console.log('Sanity connection successful')
  } catch (error) {
    console.log('Sanity unavailable, falling back to static data:', error)
    sanityAvailable = false
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
    sightings: cryptid.sightings,
    lastSighting: cryptid.lastSighting,
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
    timeline: cryptid.timeline.map((e, idx) => ({
      _key: `event-${idx}`,
      year: e.year,
      event: e.event,
      location: e.location,
    })),
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

// Check if using Sanity or static data
export async function isUsingSanity(): Promise<boolean> {
  return checkSanityAvailability()
}

// Force refresh availability check
export function resetSanityCheck(): void {
  sanityAvailable = null
}
