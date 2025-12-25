// GROQ queries for Sanity CMS

// Get all cryptids (for index page grid)
export const cryptidsListQuery = `*[_type == "cryptid"] | order(name asc) {
  _id,
  name,
  subhead,
  slug,
  scientificName,
  location,
  coordinates,
  region,
  dangerLevel,
  description,
  image,
  imageAlt,
  gridImage,
  tags
}`

// Get cryptids with filters
export const filteredCryptidsQuery = `*[_type == "cryptid"
  && ($region == "all" || region == $region)
  && ($dangerLevel == "all" || dangerLevel == $dangerLevel)
  && ($search == "" || name match $search || location match $search || description match $search)
] | order(name asc) {
  _id,
  name,
  subhead,
  slug,
  scientificName,
  location,
  coordinates,
  region,
  dangerLevel,
  description,
  image,
  imageAlt,
  gridImage,
  tags
}`

// Get single cryptid with all details by slug
export const cryptidBySlugQuery = `*[_type == "cryptid" && slug.current == $slug][0] {
  _id,
  name,
  subhead,
  slug,
  scientificName,
  location,
  coordinates,
  region,
  dangerLevel,
  firstDocumented,
  description,
  image,
  imageAlt,
  gridImage,
  tags,
  physicalDescription,
  behavior,
  habitat,
  diet,
  testimonies[] {
    _key,
    witness,
    date,
    location,
    account
  },
  notableSightings,
  bureauNotes
}`

// Get single cryptid by ID (for backwards compatibility)
export const cryptidByIdQuery = `*[_type == "cryptid" && _id == $id][0] {
  _id,
  name,
  subhead,
  slug,
  scientificName,
  location,
  coordinates,
  region,
  dangerLevel,
  firstDocumented,
  description,
  image,
  imageAlt,
  gridImage,
  tags,
  physicalDescription,
  behavior,
  habitat,
  diet,
  testimonies[] {
    _key,
    witness,
    date,
    location,
    account
  },
  notableSightings,
  bureauNotes
}`

// Get all cryptids for map (with coordinates)
export const mapCryptidsQuery = `*[_type == "cryptid" && defined(coordinates)] {
  _id,
  name,
  slug,
  location,
  dangerLevel,
  coordinates,
  description,
  gridImage
}`

// Get related cryptids (same region or danger level, excluding current)
export const relatedCryptidsQuery = `*[_type == "cryptid" && slug.current != $slug && (region == $region || dangerLevel == $dangerLevel)][0...3] {
  _id,
  name,
  slug,
  location,
  dangerLevel,
  description,
  gridImage
}`

// ============================================
// ANOMALY QUERIES (Anomalies Desk / Case Files)
// ============================================

// Get all anomalies (for Anomalies Desk grid)
export const anomaliesListQuery = `*[_type == "anomaly"] | order(name asc) {
  _id,
  name,
  subhead,
  slug,
  location,
  coordinates,
  region,
  subRegion,
  anomalyType,
  status,
  description,
  image,
  imageAlt,
  gridImage,
  tags
}`

// Get anomalies with filters
export const filteredAnomaliesQuery = `*[_type == "anomaly"
  && ($anomalyType == "all" || anomalyType == $anomalyType)
  && ($status == "all" || status == $status)
  && ($region == "all" || region == $region)
  && ($search == "" || name match $search || location match $search || description match $search)
] | order(name asc) {
  _id,
  name,
  subhead,
  slug,
  location,
  coordinates,
  region,
  subRegion,
  anomalyType,
  status,
  description,
  image,
  imageAlt,
  gridImage,
  tags
}`

// Get single anomaly with all details by slug
export const anomalyBySlugQuery = `*[_type == "anomaly" && slug.current == $slug][0] {
  _id,
  name,
  subhead,
  slug,
  location,
  coordinates,
  region,
  subRegion,
  anomalyType,
  status,
  firstDocumented,
  description,
  image,
  imageAlt,
  gridImage,
  tags,
  phenomenon,
  theories,
  frequency,
  witnesses[] {
    _key,
    witness,
    date,
    account
  },
  relatedLocations,
  bureauNotes,
  safetyAdvisory
}`

// Get all anomalies for map (with coordinates)
export const mapAnomaliesQuery = `*[_type == "anomaly" && defined(coordinates)] {
  _id,
  name,
  slug,
  location,
  anomalyType,
  status,
  coordinates,
  description,
  gridImage
}`

// Get related anomalies (same type or region, excluding current)
export const relatedAnomaliesQuery = `*[_type == "anomaly" && slug.current != $slug && (anomalyType == $anomalyType || region == $region)][0...3] {
  _id,
  name,
  slug,
  location,
  anomalyType,
  status,
  description,
  gridImage
}`
