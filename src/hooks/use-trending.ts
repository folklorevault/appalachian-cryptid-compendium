import { useQuery } from "@tanstack/react-query";

interface TrendingItem {
  cryptid: string;
  views: number;
}

interface TrendingResponse {
  trending: TrendingItem[];
  period: string;
}

/**
 * Fetches the trending/most-viewed cryptids from the last 7 days.
 * Uses a 15-minute stale time since trending data doesn't change rapidly.
 */
export function useTrending() {
  return useQuery({
    queryKey: ["trending"],
    queryFn: async (): Promise<TrendingItem[]> => {
      const res = await fetch("/api/trending");
      if (!res.ok) {
        throw new Error("Failed to fetch trending cryptids");
      }
      const data: TrendingResponse = await res.json();
      return data.trending || [];
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1, // Only retry once - trending is non-critical
  });
}
