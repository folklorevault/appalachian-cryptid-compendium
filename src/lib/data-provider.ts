// Data provider that falls back to static data when API is unavailable
// This allows development without the backend running

import { cryptids as staticCryptids } from "@/data/cryptids";
import { getCryptids, getCryptid, Cryptid } from "./api";

let apiAvailable: boolean | null = null;

// Check if API is available
async function checkApiAvailability(): Promise<boolean> {
  if (apiAvailable !== null) return apiAvailable;

  try {
    const response = await fetch("/api/cryptids", { method: "HEAD" });
    apiAvailable = response.ok;
  } catch {
    apiAvailable = false;
  }

  return apiAvailable;
}

// Convert static data format to API format
function convertStaticCryptid(cryptid: (typeof staticCryptids)[0]): Cryptid {
  return {
    id: cryptid.id,
    name: cryptid.name,
    scientific_name: cryptid.scientificName,
    location: cryptid.location,
    region: cryptid.region,
    last_sighting: cryptid.lastSighting,
    danger_level: cryptid.dangerLevel,
    sightings: cryptid.sightings,
    description: cryptid.description,
    image: cryptid.image,
    tags: cryptid.tags,
    physical_description: cryptid.physicalDescription,
    behavior: cryptid.behavior,
    habitat: cryptid.habitat,
    diet: cryptid.diet,
    testimonies: cryptid.testimonies.map((t) => ({
      id: t.id,
      cryptid_id: cryptid.id,
      witness: t.witness,
      date: t.date,
      location: t.location,
      account: t.account,
    })),
    notable_sightings: cryptid.notableSightings,
    bureau_notes: cryptid.bureauNotes,
  };
}

// Get all cryptids with optional filters
export async function fetchCryptids(filters?: {
  region?: string;
  danger_level?: string;
  search?: string;
}): Promise<Cryptid[]> {
  const useApi = await checkApiAvailability();

  if (useApi) {
    return getCryptids(filters);
  }

  // Fallback to static data
  let results = staticCryptids.map(convertStaticCryptid);

  if (filters?.region && filters.region !== "all") {
    results = results.filter((c) => c.region === filters.region);
  }

  if (filters?.danger_level && filters.danger_level !== "all") {
    results = results.filter((c) => c.danger_level === filters.danger_level);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.location.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search)
    );
  }

  return results;
}

// Get a single cryptid by ID
export async function fetchCryptid(id: string): Promise<Cryptid | null> {
  const useApi = await checkApiAvailability();

  if (useApi) {
    try {
      return await getCryptid(id);
    } catch {
      return null;
    }
  }

  // Fallback to static data
  const cryptid = staticCryptids.find((c) => c.id === id);
  return cryptid ? convertStaticCryptid(cryptid) : null;
}

// Check if we're using the API
export async function isUsingApi(): Promise<boolean> {
  return checkApiAvailability();
}

// Force refresh API availability check
export function resetApiCheck(): void {
  apiAvailable = null;
}

