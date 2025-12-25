import { useQuery } from '@tanstack/react-query'
import {
  fetchAnomalies,
  fetchAnomalyBySlug,
  fetchMapAnomalies,
  fetchRelatedAnomalies,
} from '@/lib/sanity-provider'

// Query key factory for cache management
export const anomalyKeys = {
  all: ['anomalies'] as const,
  lists: () => [...anomalyKeys.all, 'list'] as const,
  list: (filters: { anomalyType?: string; status?: string; region?: string; search?: string }) =>
    [...anomalyKeys.lists(), filters] as const,
  details: () => [...anomalyKeys.all, 'detail'] as const,
  detail: (slug: string) => [...anomalyKeys.details(), slug] as const,
  map: () => [...anomalyKeys.all, 'map'] as const,
  related: (slug: string) => [...anomalyKeys.all, 'related', slug] as const,
}

// Get all anomalies with optional filters
export function useAnomalies(filters?: {
  anomalyType?: string
  status?: string
  region?: string
  search?: string
}) {
  return useQuery({
    queryKey: anomalyKeys.list(filters || {}),
    queryFn: () => fetchAnomalies(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get single anomaly by slug
export function useAnomaly(slug: string | undefined) {
  return useQuery({
    queryKey: anomalyKeys.detail(slug || ''),
    queryFn: () => fetchAnomalyBySlug(slug!),
    enabled: !!slug,
  })
}

// Get anomalies for map display
export function useMapAnomalies() {
  return useQuery({
    queryKey: anomalyKeys.map(),
    queryFn: fetchMapAnomalies,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Get related anomalies (same type or region)
export function useRelatedAnomalies(
  slug: string | undefined,
  anomalyType: string | undefined,
  region: string | undefined
) {
  return useQuery({
    queryKey: anomalyKeys.related(slug || ''),
    queryFn: () => fetchRelatedAnomalies(slug!, anomalyType!, region!),
    enabled: !!slug && !!anomalyType && !!region,
    staleTime: 1000 * 60 * 5,
  })
}
