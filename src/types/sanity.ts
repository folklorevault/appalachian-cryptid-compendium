// TypeScript types for Sanity CMS data

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface SanityGeopoint {
  _type: 'geopoint'
  lat: number
  lng: number
  alt?: number
}

export interface SanitySlug {
  _type: 'slug'
  current: string
}

export interface SanityTestimony {
  _key: string
  witness: string
  date?: string
  location?: string
  account: string
}

export interface SanityTimelineEvent {
  _key: string
  year: string
  event: string
  location?: string
}

export interface SanityCryptid {
  _id: string
  _type: 'cryptid'
  name: string
  slug: SanitySlug
  scientificName?: string
  location: string
  coordinates?: SanityGeopoint
  region: 'Appalachia' | 'Southeast' | 'Southern'
  dangerLevel: 'Low' | 'Medium' | 'High'
  sightings: number
  lastSighting?: string
  description?: string
  image?: SanityImage
  gridImage?: SanityImage
  tags?: string[]
  physicalDescription?: string
  behavior?: string
  habitat?: string
  diet?: string
  testimonies?: SanityTestimony[]
  timeline?: SanityTimelineEvent[]
}

// Type for list queries (less data)
export interface SanityCryptidListItem {
  _id: string
  name: string
  slug: SanitySlug
  scientificName?: string
  location: string
  coordinates?: SanityGeopoint
  region: 'Appalachia' | 'Southeast' | 'Southern'
  dangerLevel: 'Low' | 'Medium' | 'High'
  sightings: number
  lastSighting?: string
  description?: string
  image?: SanityImage
  gridImage?: SanityImage
  tags?: string[]
}

// Type for map queries (minimal data with coordinates)
export interface SanityCryptidMapItem {
  _id: string
  name: string
  slug: SanitySlug
  location: string
  dangerLevel: 'Low' | 'Medium' | 'High'
  coordinates: SanityGeopoint
  description?: string
  gridImage?: SanityImage
}
