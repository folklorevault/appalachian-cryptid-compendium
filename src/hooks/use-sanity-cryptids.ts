import { useQuery } from '@tanstack/react-query'
import {
  fetchCryptids,
  fetchCryptidBySlug,
  fetchCryptidById,
  fetchMapCryptids,
} from '@/lib/sanity-provider'

// Query key factory for cache management
export const cryptidKeys = {
  all: ['cryptids'] as const,
  lists: () => [...cryptidKeys.all, 'list'] as const,
  list: (filters: { region?: string; dangerLevel?: string; search?: string }) =>
    [...cryptidKeys.lists(), filters] as const,
  details: () => [...cryptidKeys.all, 'detail'] as const,
  detail: (slug: string) => [...cryptidKeys.details(), slug] as const,
  detailById: (id: string) => [...cryptidKeys.details(), 'id', id] as const,
  map: () => [...cryptidKeys.all, 'map'] as const,
}

// Get all cryptids with optional filters
export function useCryptids(filters?: {
  region?: string
  dangerLevel?: string
  search?: string
}) {
  return useQuery({
    queryKey: cryptidKeys.list(filters || {}),
    queryFn: () => fetchCryptids(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes - Sanity CDN is fast
  })
}

// Get single cryptid by slug
export function useCryptid(slug: string | undefined) {
  return useQuery({
    queryKey: cryptidKeys.detail(slug || ''),
    queryFn: () => fetchCryptidBySlug(slug!),
    enabled: !!slug,
  })
}

// Get single cryptid by ID (for backwards compatibility)
export function useCryptidById(id: string | undefined) {
  return useQuery({
    queryKey: cryptidKeys.detailById(id || ''),
    queryFn: () => fetchCryptidById(id!),
    enabled: !!id,
  })
}

// Get cryptids for map display
export function useMapCryptids() {
  return useQuery({
    queryKey: cryptidKeys.map(),
    queryFn: fetchMapCryptids,
    staleTime: 1000 * 60 * 10, // 10 minutes - map data changes infrequently
  })
}
