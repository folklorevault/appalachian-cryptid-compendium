// GROQ queries for Sanity CMS

// Get all cryptids (for index page grid)
export const cryptidsListQuery = `*[_type == "cryptid"] | order(name asc) {
  _id,
  name,
  slug,
  scientificName,
  location,
  coordinates,
  region,
  dangerLevel,
  sightings,
  lastSighting,
  description,
  image,
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
  slug,
  scientificName,
  location,
  coordinates,
  region,
  dangerLevel,
  sightings,
  lastSighting,
  description,
  image,
  gridImage,
  tags
}`

// Get single cryptid with all details by slug
export const cryptidBySlugQuery = `*[_type == "cryptid" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  scientificName,
  location,
  coordinates,
  region,
  dangerLevel,
  sightings,
  lastSighting,
  description,
  image,
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
  timeline[] {
    _key,
    year,
    event,
    location
  }
}`

// Get single cryptid by ID (for backwards compatibility)
export const cryptidByIdQuery = `*[_type == "cryptid" && _id == $id][0] {
  _id,
  name,
  slug,
  scientificName,
  location,
  coordinates,
  region,
  dangerLevel,
  sightings,
  lastSighting,
  description,
  image,
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
  timeline[] {
    _key,
    year,
    event,
    location
  }
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
