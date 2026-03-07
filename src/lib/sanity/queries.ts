// GROQ queries for Sanity CMS

// Shared field projections to keep queries DRY
const listFields = `
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
`;

const detailFields = `
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
  bureauNotes,
  declassifiedBriefings[] {
    _key,
    question,
    answer
  }
`;

// ── CRYPTID QUERIES ──────────────────────────────────────────

export const cryptidsListQuery = `*[_type == "cryptid"] | order(_createdAt desc) {
  ${listFields}
}`;

export const filteredCryptidsQuery = `*[_type == "cryptid"
  && ($region == "all" || region == $region)
  && ($dangerLevel == "all" || dangerLevel == $dangerLevel)
  && ($search == "" || name match $search || location match $search || description match $search)
] | order(_createdAt desc) {
  ${listFields}
}`;

export const cryptidBySlugQuery = `*[_type == "cryptid" && slug.current == $slug][0] {
  ${detailFields}
}`;

export const cryptidByIdQuery = `*[_type == "cryptid" && _id == $id][0] {
  ${detailFields}
}`;

export const mapCryptidsQuery = `*[_type == "cryptid" && defined(coordinates)] {
  _id,
  name,
  slug,
  location,
  dangerLevel,
  coordinates,
  description,
  gridImage
}`;

export const relatedCryptidsQuery = `*[_type == "cryptid" && slug.current != $slug && (region == $region || dangerLevel == $dangerLevel)][0...3] {
  _id,
  name,
  slug,
  location,
  dangerLevel,
  description,
  gridImage
}`;

// Get all cryptid slugs (for generateStaticParams)
export const cryptidSlugsQuery = `*[_type == "cryptid"].slug.current`;

// ── ANOMALY QUERIES ──────────────────────────────────────────

const anomalyListFields = `
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
`;

export const anomaliesListQuery = `*[_type == "anomaly"] | order(_createdAt desc) {
  ${anomalyListFields}
}`;

export const filteredAnomaliesQuery = `*[_type == "anomaly"
  && ($anomalyType == "all" || anomalyType == $anomalyType)
  && ($status == "all" || status == $status)
  && ($region == "all" || region == $region)
  && ($search == "" || name match $search || location match $search || description match $search)
] | order(_createdAt desc) {
  ${anomalyListFields}
}`;

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
  safetyAdvisory,
  declassifiedBriefings[] {
    _key,
    question,
    answer
  }
}`;

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
}`;

export const relatedAnomaliesQuery = `*[_type == "anomaly" && slug.current != $slug && (anomalyType == $anomalyType || region == $region)][0...3] {
  _id,
  name,
  slug,
  location,
  anomalyType,
  status,
  description,
  gridImage
}`;

// Get all anomaly slugs (for generateStaticParams)
export const anomalySlugsQuery = `*[_type == "anomaly"].slug.current`;

// ── BULLETIN QUERIES ──────────────────────────────────────────

const bulletinListFields = `
  _id,
  title,
  slug,
  bulletinNumber,
  date,
  category,
  summary,
  readTime,
  relatedCryptids[]-> { _id, name, slug }
`;

export const bulletinsListQuery = `*[_type == "bulletin"] | order(date desc) {
  ${bulletinListFields}
}`;

export const bulletinBySlugQuery = `*[_type == "bulletin" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  bulletinNumber,
  date,
  category,
  summary,
  readTime,
  body,
  relatedCryptids[]-> { _id, name, slug },
  relatedAnomalies[]-> { _id, name, slug }
}`;

export const bulletinSlugsQuery = `*[_type == "bulletin"].slug.current`;
