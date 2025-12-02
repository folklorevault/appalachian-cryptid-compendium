// GET /api/sightings/:id - Get a single sighting report (admin only)
// PUT /api/sightings/:id - Update sighting status (admin only)
// DELETE /api/sightings/:id - Delete a sighting report (admin only)

import {
  Env,
  SightingReport,
  jsonResponse,
  errorResponse,
  handleOptions,
  isAuthenticated,
} from "../_shared";

interface SightingUpdateInput {
  status?: "pending" | "approved" | "rejected";
  reviewer_notes?: string;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleOptions();
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request, params } = context;
  const id = params.id as string;

  // Check authentication
  if (!isAuthenticated(request, env)) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const row = await env.DB.prepare(
      "SELECT * FROM sighting_reports WHERE id = ?"
    )
      .bind(id)
      .first();

    if (!row) {
      return errorResponse("Sighting report not found", 404);
    }

    const report: SightingReport = {
      id: row.id as string,
      status: row.status as "pending" | "approved" | "rejected",
      witness_name: row.witness_name as string,
      email: row.email as string,
      date: row.date as string,
      time: row.time as string,
      location: row.location as string,
      state: row.state as string,
      creature_name: row.creature_name as string,
      description: row.description as string,
      physical_description: row.physical_description as string,
      behavior: row.behavior as string,
      photo_url: row.photo_url as string,
      submitted_at: row.submitted_at as string,
    };

    return jsonResponse({ report });
  } catch (error) {
    console.error("Error fetching sighting report:", error);
    return errorResponse("Failed to fetch sighting report", 500);
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
    // Check if report exists
    const existing = await env.DB.prepare(
      "SELECT id FROM sighting_reports WHERE id = ?"
    )
      .bind(id)
      .first();

    if (!existing) {
      return errorResponse("Sighting report not found", 404);
    }

    const body = (await request.json()) as SightingUpdateInput;

    // Build update query
    const updates: string[] = [];
    const values: (string | null)[] = [];

    if (body.status !== undefined) {
      if (!["pending", "approved", "rejected"].includes(body.status)) {
        return errorResponse("Invalid status value");
      }
      updates.push("status = ?");
      values.push(body.status);
      updates.push("reviewed_at = datetime('now')");
    }

    if (body.reviewer_notes !== undefined) {
      updates.push("reviewer_notes = ?");
      values.push(body.reviewer_notes);
    }

    if (updates.length === 0) {
      return errorResponse("No fields to update");
    }

    values.push(id);

    await env.DB.prepare(
      `UPDATE sighting_reports SET ${updates.join(", ")} WHERE id = ?`
    )
      .bind(...values)
      .run();

    return jsonResponse({ success: true, id });
  } catch (error) {
    console.error("Error updating sighting report:", error);
    return errorResponse("Failed to update sighting report", 500);
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
    // Check if report exists
    const existing = await env.DB.prepare(
      "SELECT id FROM sighting_reports WHERE id = ?"
    )
      .bind(id)
      .first();

    if (!existing) {
      return errorResponse("Sighting report not found", 404);
    }

    await env.DB.prepare("DELETE FROM sighting_reports WHERE id = ?")
      .bind(id)
      .run();

    return jsonResponse({ success: true, id });
  } catch (error) {
    console.error("Error deleting sighting report:", error);
    return errorResponse("Failed to delete sighting report", 500);
  }
};

