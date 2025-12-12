import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '8thljucm',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: import.meta.env.PROD, // Use CDN in production, fresh data in dev
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
