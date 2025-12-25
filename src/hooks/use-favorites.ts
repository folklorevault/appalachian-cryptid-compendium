import { useState, useEffect, useCallback, useMemo } from "react";

const STORAGE_KEY = "cryptid-favorites";

/**
 * Hook for managing favorite cryptids using localStorage.
 * Persists favorites across page refreshes and browser sessions.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // localStorage might be full or disabled
    }
  }, [favorites]);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const isFavorite = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites]
  );

  const addFavorite = useCallback((slug: string) => {
    setFavorites((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  }, []);

  const removeFavorite = useCallback((slug: string) => {
    setFavorites((prev) => prev.filter((s) => s !== slug));
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return useMemo(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite,
      addFavorite,
      removeFavorite,
      clearFavorites,
      count: favorites.length,
    }),
    [favorites, toggleFavorite, isFavorite, addFavorite, removeFavorite, clearFavorites]
  );
}
