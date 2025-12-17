// POST /api/analytics - Track page views and events

import { Env, errorResponse, handleOptions, corsHeaders } from "./_shared";

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleOptions();
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    const body = await request.json();
    const { event, page, cryptid, referrer, userAgent } = body;

    if (!event || !page) {
      return errorResponse("Event and page are required", 400);
    }

    // Use Cloudflare Analytics Engine (if configured)
    // This requires the analytics_engine binding in wrangler.toml
    if (env.ANALYTICS) {
      await env.ANALYTICS.writeDataPoint({
        blobs: [event, page, cryptid || "", referrer || "", userAgent || ""],
        doubles: [Date.now()],
        indexes: [page], // Index by page for easy querying
      });
    }

    // Also log to console for debugging
    console.log("Analytics:", {
      event,
      page,
      cryptid,
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error tracking analytics:", error);
    return errorResponse("Failed to track analytics", 500);
  }
};

// GET /api/analytics - Retrieve analytics data (admin only)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    // Check authentication
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token || token !== env.ADMIN_API_KEY) {
      return errorResponse("Unauthorized", 401);
    }

    // Query popular cryptids from D1
    const stmt = await env.DB.prepare(`
      SELECT
        page,
        COUNT(*) as views,
        MAX(timestamp) as last_viewed
      FROM analytics
      WHERE page LIKE '/cryptids/%'
      GROUP BY page
      ORDER BY views DESC
      LIMIT 10
    `);

    const { results } = await stmt.all();

    return new Response(
      JSON.stringify({
        popular_cryptids: results,
        generated_at: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error retrieving analytics:", error);
    return errorResponse("Failed to retrieve analytics", 500);
  }
};
