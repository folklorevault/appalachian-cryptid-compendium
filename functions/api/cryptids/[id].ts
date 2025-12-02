// GET /api/cryptids/:id - Get a single cryptid with testimonies and timeline
// PUT /api/cryptids/:id - Update a cryptid (admin only)
// DELETE /api/cryptids/:id - Delete a cryptid (admin only)

import {
  Env,
  Cryptid,
  Testimony,
  TimelineEvent,
  jsonResponse,
  errorResponse,
  handleOptions,
  isAuthenticated,
  rowToCryptid,
} from "../_shared";

interface CryptidUpdateInput {
  name?: string;
  scientific_name?: string;
  location?: string;
  region?: string;
  last_sighting?: string;
  danger_level?: "Low" | "Medium" | "High";
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
  const { env, params } = context;
  const id = params.id as string;

  try {
    // Get cryptid
    const cryptidRow = await env.DB.prepare(
      "SELECT * FROM cryptids WHERE id = ?"
    )
      .bind(id)
      .first();

    if (!cryptidRow) {
      return errorResponse("Cryptid not found", 404);
    }

    const cryptid: Cryptid = rowToCryptid(cryptidRow as Record<string, unknown>);

    // Get testimonies
    const { results: testimoniesResults } = await env.DB.prepare(
      "SELECT * FROM testimonies WHERE cryptid_id = ? ORDER BY date ASC"
    )
      .bind(id)
      .all();

    cryptid.testimonies = (testimoniesResults || []).map(
      (row) =>
        ({
          id: row.id,
          cryptid_id: row.cryptid_id,
          witness: row.witness,
          date: row.date,
          location: row.location,
          account: row.account,
        } as Testimony)
    );

    // Get timeline events
    const { results: timelineResults } = await env.DB.prepare(
      "SELECT * FROM timeline_events WHERE cryptid_id = ? ORDER BY year ASC"
    )
      .bind(id)
      .all();

    cryptid.timeline = (timelineResults || []).map(
      (row) =>
        ({
          id: row.id,
          cryptid_id: row.cryptid_id,
          year: row.year,
          event: row.event,
          location: row.location,
        } as TimelineEvent)
    );

    return jsonResponse({ cryptid });
  } catch (error) {
    console.error("Error fetching cryptid:", error);
    return errorResponse("Failed to fetch cryptid", 500);
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const { env, request, params } = context;
  const id = params.id as string;

  // Check authentication
  if (!isAuthenticated(request, env)) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    // Check if cryptid exists
    const existing = await env.DB.prepare(
      "SELECT id FROM cryptids WHERE id = ?"
    )
      .bind(id)
      .first();

    if (!existing) {
      return errorResponse("Cryptid not found", 404);
    }

    const body = (await request.json()) as CryptidUpdateInput;

    // Build dynamic update query
    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (body.name !== undefined) {
      updates.push("name = ?");
      values.push(body.name);
    }
    if (body.scientific_name !== undefined) {
      updates.push("scientific_name = ?");
      values.push(body.scientific_name);
    }
    if (body.location !== undefined) {
      updates.push("location = ?");
      values.push(body.location);
    }
    if (body.region !== undefined) {
      updates.push("region = ?");
      values.push(body.region);
    }
    if (body.last_sighting !== undefined) {
      updates.push("last_sighting = ?");
      values.push(body.last_sighting);
    }
    if (body.danger_level !== undefined) {
      updates.push("danger_level = ?");
      values.push(body.danger_level);
    }
    if (body.sightings !== undefined) {
      updates.push("sightings = ?");
      values.push(body.sightings);
    }
    if (body.description !== undefined) {
      updates.push("description = ?");
      values.push(body.description);
    }
    if (body.image !== undefined) {
      updates.push("image = ?");
      values.push(body.image);
    }
    if (body.tags !== undefined) {
      updates.push("tags = ?");
      values.push(JSON.stringify(body.tags));
    }
    if (body.physical_description !== undefined) {
      updates.push("physical_description = ?");
      values.push(body.physical_description);
    }
    if (body.behavior !== undefined) {
      updates.push("behavior = ?");
      values.push(body.behavior);
    }
    if (body.habitat !== undefined) {
      updates.push("habitat = ?");
      values.push(body.habitat);
    }
    if (body.diet !== undefined) {
      updates.push("diet = ?");
      values.push(body.diet);
    }

    if (updates.length === 0) {
      return errorResponse("No fields to update");
    }

    updates.push("updated_at = datetime('now')");
    values.push(id);

    await env.DB.prepare(
      `UPDATE cryptids SET ${updates.join(", ")} WHERE id = ?`
    )
      .bind(...values)
      .run();

    return jsonResponse({ success: true, id });
  } catch (error) {
    console.error("Error updating cryptid:", error);
    return errorResponse("Failed to update cryptid", 500);
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { env, request, params } = context;
  const id = params.id as string;

  // Check authentication
  if (!isAuthenticated(request, env)) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    // Check if cryptid exists
    const existing = await env.DB.prepare(
      "SELECT id FROM cryptids WHERE id = ?"
    )
      .bind(id)
      .first();

    if (!existing) {
      return errorResponse("Cryptid not found", 404);
    }

    // Delete (cascade will handle testimonies and timeline)
    await env.DB.prepare("DELETE FROM cryptids WHERE id = ?").bind(id).run();

    return jsonResponse({ success: true, id });
  } catch (error) {
    console.error("Error deleting cryptid:", error);
    return errorResponse("Failed to delete cryptid", 500);
  }
};

