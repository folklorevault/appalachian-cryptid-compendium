// Shared types and utilities for API functions

export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  ANALYTICS_ENGINE: AnalyticsEngineDataset;
  ADMIN_API_KEY?: string;
}

export interface Cryptid {
  id: string;
  name: string;
  scientific_name: string;
  location: string;
  region: string;
  last_sighting: string;
  danger_level: "Low" | "Medium" | "High";
  sightings: number;
  description: string;
  image: string;
  tags: string[];
  physical_description: string;
  behavior: string;
  habitat: string;
  diet: string;
  testimonies?: Testimony[];
  timeline?: TimelineEvent[];
}

export interface Testimony {
  id: string;
  cryptid_id: string;
  witness: string;
  date: string;
  location: string;
  account: string;
}

export interface TimelineEvent {
  id: string;
  cryptid_id: string;
  year: string;
  event: string;
  location: string;
}

export interface SightingReport {
  id: string;
  status: "pending" | "approved" | "rejected";
  witness_name: string;
  email: string;
  date: string;
  time: string;
  location: string;
  state: string;
  creature_name: string;
  description: string;
  physical_description: string;
  behavior: string;
  photo_url: string;
  submitted_at: string;
}

// CORS headers for API responses
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// JSON response helper
export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

// Error response helper
export function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ error: message }, status);
}

// Handle CORS preflight
export function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Check admin authentication
export function isAuthenticated(request: Request, env: Env): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return false;

  const token = authHeader.replace("Bearer ", "");
  return token === env.ADMIN_API_KEY;
}

// Generate a simple unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Parse tags from JSON string
export function parseTags(tagsStr: string | null): string[] {
  if (!tagsStr) return [];
  try {
    return JSON.parse(tagsStr);
  } catch {
    return [];
  }
}

// Convert database row to Cryptid object
export function rowToCryptid(row: Record<string, unknown>): Cryptid {
  return {
    id: row.id as string,
    name: row.name as string,
    scientific_name: row.scientific_name as string,
    location: row.location as string,
    region: row.region as string,
    last_sighting: row.last_sighting as string,
    danger_level: row.danger_level as "Low" | "Medium" | "High",
    sightings: row.sightings as number,
    description: row.description as string,
    image: row.image as string,
    tags: parseTags(row.tags as string),
    physical_description: row.physical_description as string,
    behavior: row.behavior as string,
    habitat: row.habitat as string,
    diet: row.diet as string,
  };
}