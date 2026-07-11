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

export interface SanityDeclassifiedBriefing {
  _key: string
  question: string
  answer: string
}

export interface SanityCaseFileSection {
  _key: string
  heading: string
  label?: string
  body: string
}

export interface SanityTestimony {
  _key: string
  witness: string
  date?: string
  location?: string
  account: string
}

export interface SanityCryptid {
  _id: string
  _type: 'cryptid'
  name: string
  subhead?: string
  slug: SanitySlug
  scientificName?: string
  location: string
  coordinates?: SanityGeopoint
  region: 'Appalachia' | 'Southeast' | 'Southern'
  dangerLevel: 'Low' | 'Medium' | 'High'
  firstDocumented?: string
  description?: string
  image?: SanityImage
  imageAlt?: string
  gridImage?: SanityImage
  tags?: string[]
  fileAbstract?: string
  caseFileSections?: SanityCaseFileSection[]
  physicalDescription?: string
  behavior?: string
  habitat?: string
  diet?: string
  testimonies?: SanityTestimony[]
  notableSightings?: string
  bureauNotes?: string
  declassifiedBriefings?: SanityDeclassifiedBriefing[]
  featured?: boolean
}

// Type for list queries (less data)
export interface SanityCryptidListItem {
  _id: string
  name: string
  subhead?: string
  slug: SanitySlug
  scientificName?: string
  location: string
  coordinates?: SanityGeopoint
  region: 'Appalachia' | 'Southeast' | 'Southern'
  dangerLevel: 'Low' | 'Medium' | 'High'
  description?: string
  image?: SanityImage
  imageAlt?: string
  gridImage?: SanityImage
  tags?: string[]
  featured?: boolean
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

// Anomaly types for the Anomalies Desk
export type AnomalyType = 'Lights' | 'Hauntings' | 'Curses' | 'Omen Events' | 'Sounds/Calls' | 'Weather Oddities' | 'Time Weirdness' | 'Places'
export type AnomalyStatus = 'Open File' | 'Active' | 'Cold' | 'Seasonal'
export type AnomalyRegion = 'TN' | 'NC' | 'VA' | 'WV' | 'KY' | 'GA' | 'SC' | 'AL'
export type AnomalySubRegion = 'Smokies' | 'Blue Ridge' | 'Cumberland' | 'Allegheny' | 'Shenandoah' | 'New River' | 'Ohio River'

export interface SanityWitnessAccount {
  _key: string
  witness: string
  date?: string
  account: string
}

export interface SanityAnomaly {
  _id: string
  _type: 'anomaly'
  name: string
  subhead?: string
  slug: SanitySlug
  location: string
  coordinates?: SanityGeopoint
  region: AnomalyRegion
  subRegion?: AnomalySubRegion
  anomalyType: AnomalyType
  status: AnomalyStatus
  firstDocumented?: string
  description?: string
  image?: SanityImage
  imageAlt?: string
  gridImage?: SanityImage
  tags?: string[]
  phenomenon?: string
  theories?: string
  frequency?: string
  witnesses?: SanityWitnessAccount[]
  relatedLocations?: string
  noteOnRecord?: string
  bureauNotes?: string
  safetyAdvisory?: string
  declassifiedBriefings?: SanityDeclassifiedBriefing[]
}

// Type for anomaly list queries (less data)
export interface SanityAnomalyListItem {
  _id: string
  name: string
  subhead?: string
  slug: SanitySlug
  location: string
  coordinates?: SanityGeopoint
  region: AnomalyRegion
  subRegion?: AnomalySubRegion
  anomalyType: AnomalyType
  status: AnomalyStatus
  description?: string
  image?: SanityImage
  imageAlt?: string
  gridImage?: SanityImage
  tags?: string[]
}

// ── Bulletin types ──────────────────────────────────────────

export type BulletinCategory =
  | 'field-terminology'
  | 'regional-analysis'
  | 'cultural-brief'
  | 'operational-notice'

export interface SanityBulletinListItem {
  _id: string
  title: string
  slug: SanitySlug
  bulletinNumber: string
  date: string
  category: BulletinCategory
  summary: string
  readTime?: string
  relatedCryptids?: Array<{ _id: string; name: string; slug: SanitySlug }>
}

export interface SanityBulletin extends SanityBulletinListItem {
  _type: 'bulletin'
  body?: unknown[]
  relatedAnomalies?: Array<{ _id: string; name: string; slug: SanitySlug }>
}

// Type for anomaly map queries
export interface SanityAnomalyMapItem {
  _id: string
  name: string
  slug: SanitySlug
  location: string
  anomalyType: AnomalyType
  status: AnomalyStatus
  coordinates: SanityGeopoint
  description?: string
  gridImage?: SanityImage
}

export type SocialPlatform =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'bluesky'
  | 'youtube'
  | 'threads'
  | 'x'
  | 'email'
  | 'rss'

// ── RSS feed ─────────────────────────────────────────────────

export interface FeedItem {
  _type: 'cryptid' | 'anomaly' | 'bulletin'
  _id: string
  title: string
  slug: string
  summary?: string
  publishedAt: string
}

export interface LinkInBioLink {
  _key?: string
  label: string
  url: string
  description?: string
  badge?: string
}

export interface LinkInBioSocial {
  _key?: string
  platform: SocialPlatform
  url: string
}

export interface SanityLinkInBio {
  _id: string
  _type: 'linkInBio'
  tagline: string
  pinnedNote?: string
  links: LinkInBioLink[]
  socials?: LinkInBioSocial[]
}
