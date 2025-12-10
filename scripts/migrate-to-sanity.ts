/**
 * Migration script to move cryptid data from static files to Sanity CMS
 *
 * Usage:
 * 1. Set environment variables:
 *    - SANITY_PROJECT_ID: Your Sanity project ID
 *    - SANITY_DATASET: Dataset name (usually 'production')
 *    - SANITY_WRITE_TOKEN: Write token from sanity.io/manage
 *
 * 2. Run with ts-node or tsx:
 *    npx tsx scripts/migrate-to-sanity.ts
 */

import { createClient } from '@sanity/client'

// Import static cryptid data - adjust path if needed
// For running with tsx, we import from the compiled source
const cryptids = [
  {
    id: 'mothman',
    name: 'Mothman',
    scientificName: 'Homo chiroptera',
    location: 'Point Pleasant, West Virginia',
    region: 'Appalachia',
    dangerLevel: 'High' as const,
    sightings: 147,
    lastSighting: 'October 2023',
    description: 'A terrifying winged humanoid with glowing red eyes, often reported before tragic events. First documented during the Silver Bridge collapse of 1967.',
    tags: ['Winged', 'Nocturnal', 'Omen', 'Humanoid'],
    physicalDescription: 'Stands 6-7 feet tall with a 10-15 foot wingspan. Covered in dark gray or black skin that some describe as feathered. Most distinctive feature is its large, glowing red eyes that witnesses claim can induce paralysis or extreme fear. No visible head - eyes appear set in the chest area.',
    behavior: 'Primarily nocturnal, often seen perched on high structures or gliding silently. Appears to be drawn to areas before disasters or tragedies. Does not attack but causes intense psychological distress. Known to chase vehicles at speeds exceeding 100 mph.',
    habitat: 'Abandoned industrial areas, old munitions plants, dense woodland near rivers. Shows preference for locations with historical significance or impending catastrophe.',
    diet: 'Unknown - no feeding behavior observed',
  },
  // Note: In a real migration, you would import all cryptids from src/data/cryptids.ts
  // This is a template showing the structure
]

// Coordinates for map markers
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

// Sample testimonies (you would import these from the actual data)
const sampleTestimonies = {
  mothman: [
    {
      witness: 'Roger and Linda Scarberry',
      date: 'November 15, 1966',
      location: 'TNT Area, Point Pleasant',
      account: 'We were driving past the old power plant when we saw it. Those eyes... they were like two big red reflectors. It spread its wings - they must have been ten feet across - and just lifted off the ground.',
    },
  ],
}

// Sample timeline events
const sampleTimeline = {
  mothman: [
    {
      year: '1966',
      event: 'First documented sighting at the abandoned TNT plant',
      location: 'Point Pleasant, WV',
    },
    {
      year: '1967',
      event: 'Silver Bridge collapse - 46 deaths. Multiple Mothman sightings in preceding weeks.',
      location: 'Point Pleasant, WV',
    },
  ],
}

async function migrate() {
  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET || 'production'
  const token = process.env.SANITY_WRITE_TOKEN

  if (!projectId || !token) {
    console.error('Missing required environment variables:')
    console.error('- SANITY_PROJECT_ID')
    console.error('- SANITY_WRITE_TOKEN')
    console.error('')
    console.error('Get these from https://sanity.io/manage')
    process.exit(1)
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  console.log(`Migrating to Sanity project: ${projectId} (${dataset})`)
  console.log('')

  for (const cryptid of cryptids) {
    const coords = cryptidCoordinates[cryptid.id]
    const testimonies = sampleTestimonies[cryptid.id as keyof typeof sampleTestimonies] || []
    const timeline = sampleTimeline[cryptid.id as keyof typeof sampleTimeline] || []

    const doc = {
      _type: 'cryptid',
      _id: cryptid.id, // Use existing ID for consistency
      name: cryptid.name,
      slug: { _type: 'slug', current: cryptid.id },
      scientificName: cryptid.scientificName,
      location: cryptid.location,
      coordinates: coords
        ? { _type: 'geopoint', lat: coords.lat, lng: coords.lng }
        : undefined,
      region: cryptid.region,
      dangerLevel: cryptid.dangerLevel,
      sightings: cryptid.sightings,
      lastSighting: cryptid.lastSighting,
      description: cryptid.description,
      tags: cryptid.tags,
      physicalDescription: cryptid.physicalDescription,
      behavior: cryptid.behavior,
      habitat: cryptid.habitat,
      diet: cryptid.diet,
      testimonies: testimonies.map((t, idx) => ({
        _key: `testimony-${idx}`,
        _type: 'testimony',
        witness: t.witness,
        date: t.date,
        location: t.location,
        account: t.account,
      })),
      timeline: timeline.map((e, idx) => ({
        _key: `event-${idx}`,
        _type: 'timelineEvent',
        year: e.year,
        event: e.event,
        location: e.location,
      })),
    }

    try {
      await client.createOrReplace(doc)
      console.log(`✓ Migrated: ${cryptid.name}`)
    } catch (error) {
      console.error(`✗ Failed to migrate ${cryptid.name}:`, error)
    }
  }

  console.log('')
  console.log('Migration complete!')
  console.log('')
  console.log('Next steps:')
  console.log('1. Upload images via Sanity Studio')
  console.log('2. Verify data at https://appalachian-cryptid.sanity.studio')
  console.log('3. Update VITE_SANITY_PROJECT_ID in your .env file')
}

migrate().catch(console.error)
