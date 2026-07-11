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
  tags,
  featured
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
  fileAbstract,
  caseFileSections[] {
    _key,
    heading,
    label,
    body
  },
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

// Slugs with _updatedAt (for sitemap)
export const cryptidSlugsWithDatesQuery = `*[_type == "cryptid"]{ "slug": slug.current, _updatedAt }`;

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
  noteOnRecord,
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

// Slugs with _updatedAt (for sitemap)
export const anomalySlugsWithDatesQuery = `*[_type == "anomaly"]{ "slug": slug.current, _updatedAt }`;

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

// Bulletins that reference a given cryptid or anomaly document id.
// Inverse of relatedCryptids[]/relatedAnomalies[] — `references()` matches
// a reference to $id anywhere in the document, so one query serves both.
export const bulletinsReferencingQuery = `*[_type == "bulletin" && references($id)] | order(date desc) {
  ${bulletinListFields}
}`;

export const bulletinSlugsQuery = `*[_type == "bulletin"].slug.current`;

// Slugs with _updatedAt (for sitemap)
export const bulletinSlugsWithDatesQuery = `*[_type == "bulletin"]{ "slug": slug.current, _updatedAt }`;

// ── RSS FEED QUERY ────────────────────────────────────────────
// Combined feed of all published content, newest first. Cryptids and
// anomalies have no `date` field, so we fall back to `_createdAt`.
export const feedItemsQuery = `*[_type in ["cryptid", "anomaly", "bulletin"] && defined(slug.current)]
  | order(coalesce(date, _createdAt) desc)[0...30] {
  _type,
  _id,
  "title": coalesce(title, name),
  "slug": slug.current,
  "summary": coalesce(summary, description),
  "publishedAt": coalesce(date, _createdAt)
}`;

// ── LINK IN BIO QUERY ─────────────────────────────────────────

export const linkInBioQuery = `*[_type == "linkInBio"][0] {
  _id,
  _type,
  tagline,
  pinnedNote,
  links[] {
    _key,
    label,
    url,
    description,
    badge
  },
  socials[] {
    _key,
    platform,
    url
  }
}`;
