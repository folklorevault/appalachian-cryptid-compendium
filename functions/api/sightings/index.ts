// POST /api/sightings - Submit a new sighting report (public)
// GET /api/sightings - List sighting reports (admin only)

import {
  Env,
  SightingReport,
  jsonResponse,
  errorResponse,
  handleOptions,
  isAuthenticated,
  generateId,
} from "../_shared";

interface SightingInput {
  witness_name: string;
  email: string;
  date: string;
  time?: string;
  location: string;
  state: string;
  creature_name?: string;
  description: string;
  physical_description: string;
  behavior?: string;
  photo_url?: string;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleOptions();
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  const url = new URL(request.url);

  // Check authentication for listing reports
  if (!isAuthenticated(request, env)) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const status = url.searchParams.get("status") || "pending";
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    const { results } = await env.DB.prepare(
      `SELECT * FROM sighting_reports 
       WHERE status = ? 
       ORDER BY submitted_at DESC 
       LIMIT ? OFFSET ?`
    )
      .bind(status, limit, offset)
      .all();

    // Get total count
    const countResult = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM sighting_reports WHERE status = ?"
    )
      .bind(status)
      .first();

    const reports = (results || []).map(
      (row) =>
        ({
          id: row.id,
          status: row.status,
          witness_name: row.witness_name,
          email: row.email,
          date: row.date,
          time: row.time,
          location: row.location,
          state: row.state,
          creature_name: row.creature_name,
          description: row.description,
          physical_description: row.physical_description,
          behavior: row.behavior,
          photo_url: row.photo_url,
          submitted_at: row.submitted_at,
        } as SightingReport)
    );

    return jsonResponse({
      reports,
      total: (countResult as { count: number })?.count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching sighting reports:", error);
    return errorResponse("Failed to fetch sighting reports", 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    const body = (await request.json()) as SightingInput;

    // Validate required fields
    if (
      !body.witness_name ||
      !body.email ||
      !body.date ||
      !body.location ||
      !body.state ||
      !body.description ||
      !body.physical_description
    ) {
      return errorResponse(
        "Missing required fields: witness_name, email, date, location, state, description, physical_description"
      );
    }

    // Basic email validation
    if (!body.email.includes("@")) {
      return errorResponse("Invalid email address");
    }

    const id = generateId();

    await env.DB.prepare(
      `INSERT INTO sighting_reports (
        id, witness_name, email, date, time, location, state,
        creature_name, description, physical_description, behavior, photo_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        body.witness_name,
        body.email,
        body.date,
        body.time || null,
        body.location,
        body.state,
        body.creature_name || null,
        body.description,
        body.physical_description,
        body.behavior || null,
        body.photo_url || null
      )
      .run();

    return jsonResponse(
      {
        success: true,
        id,
        message: "Sighting report submitted successfully",
      },
      201
    );
  } catch (error) {
    console.error("Error creating sighting report:", error);
    return errorResponse("Failed to submit sighting report", 500);
  }
};

