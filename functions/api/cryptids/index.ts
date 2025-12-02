// GET /api/cryptids - List all cryptids
// POST /api/cryptids - Create a new cryptid (admin only)

import {
  Env,
  jsonResponse,
  errorResponse,
  handleOptions,
  isAuthenticated,
  generateId,
  rowToCryptid,
} from "../_shared";

interface CryptidInput {
  id?: string;
  name: string;
  scientific_name?: string;
  location: string;
  region: string;
  last_sighting?: string;
  danger_level: "Low" | "Medium" | "High";
  sightings?: number;
  description?: string;
  image?: string;
  tags?: string[];
  physical_description?: string;
  behavior?: string;
  habitat?: string;
  diet?: string;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleOptions();
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const url = new URL(context.request.url);

  // Optional filters
  const region = url.searchParams.get("region");
  const dangerLevel = url.searchParams.get("danger_level");
  const search = url.searchParams.get("search");

  try {
    let query = "SELECT * FROM cryptids WHERE 1=1";
    const params: string[] = [];

    if (region && region !== "all") {
      query += " AND region = ?";
      params.push(region);
    }

    if (dangerLevel && dangerLevel !== "all") {
      query += " AND danger_level = ?";
      params.push(dangerLevel);
    }

    if (search) {
      query += " AND (name LIKE ? OR location LIKE ? OR description LIKE ?)";
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += " ORDER BY name ASC";

    const stmt = env.DB.prepare(query);
    const { results } = await (params.length > 0
      ? stmt.bind(...params).all()
      : stmt.all());

    const cryptids = (results || []).map((row) =>
      rowToCryptid(row as Record<string, unknown>)
    );

    return jsonResponse({ cryptids, count: cryptids.length });
  } catch (error) {
    console.error("Error fetching cryptids:", error);
    return errorResponse("Failed to fetch cryptids", 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  // Check authentication
  if (!isAuthenticated(request, env)) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const body = (await request.json()) as CryptidInput;

    // Validate required fields
    if (!body.name || !body.location || !body.region || !body.danger_level) {
      return errorResponse(
        "Missing required fields: name, location, region, danger_level"
      );
    }

    const id = body.id || generateId();
    const tags = JSON.stringify(body.tags || []);

    await env.DB.prepare(
      `INSERT INTO cryptids (
        id, name, scientific_name, location, region, last_sighting,
        danger_level, sightings, description, image, tags,
        physical_description, behavior, habitat, diet
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        body.name,
        body.scientific_name || null,
        body.location,
        body.region,
        body.last_sighting || null,
        body.danger_level,
        body.sightings || 0,
        body.description || null,
        body.image || null,
        tags,
        body.physical_description || null,
        body.behavior || null,
        body.habitat || null,
        body.diet || null
      )
      .run();

    return jsonResponse({ success: true, id }, 201);
  } catch (error) {
    console.error("Error creating cryptid:", error);
    return errorResponse("Failed to create cryptid", 500);
  }
};

