// POST /api/analytics - Track page views and events with dual-write to Analytics Engine + D1

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

    // Write to Cloudflare Analytics Engine for long-term analytics
    // Analytics Engine stores data points with:
    // - blobs: array of strings (up to 20)
    // - doubles: array of numbers (up to 20)
    // - indexes: array of strings for indexing (up to 10)
    if (env.ANALYTICS_ENGINE) {
      await env.ANALYTICS_ENGINE.writeDataPoint({
        // Store string data as blobs
        blobs: [
          event,                    // blob1: event type (page_view, search, filter, etc.)
          page,                     // blob2: page path
          cryptid || "",            // blob3: cryptid name/slug
          referrer || "",           // blob4: referrer URL
          userAgent || "",          // blob5: user agent
        ],
        // Store numeric data as doubles
        doubles: [Date.now()],      // double1: timestamp
        // Index by page for easy querying
        indexes: [page],
      });
    }

    // ALSO write to D1 for the admin dashboard
    // This allows the dashboard to query analytics data without needing GraphQL
    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO analytics (event, page, cryptid, referrer, user_agent, timestamp)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).bind(
        event,
        page,
        cryptid || null,
        referrer || null,
        userAgent || null
      ).run();
    }

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

// GET /api/analytics - Retrieve analytics instructions
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    // Check authentication
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token || token !== env.ADMIN_API_KEY) {
      return errorResponse("Unauthorized", 401);
    }

    return new Response(
      JSON.stringify({
        message: "Analytics is enabled with dual-write strategy",
        endpoints: {
          stats: "/api/analytics/stats - View dashboard statistics (queries D1)",
          cloudflare_dashboard: "https://dash.cloudflare.com - Advanced Analytics Engine queries"
        },
        storage: {
          d1: "Dashboard queries and recent analytics (last 30 days recommended)",
          analytics_engine: "Long-term storage with unlimited cardinality (query via dashboard)"
        },
        example_ae_queries: [
          {
            description: "Most viewed cryptids (last 7 days) via Analytics Engine",
            sql: `SELECT blob3 as cryptid, COUNT(*) as views FROM cryptid_analytics WHERE blob1 = 'page_view' AND blob3 != '' AND timestamp > NOW() - INTERVAL '7' DAY GROUP BY blob3 ORDER BY views DESC LIMIT 10`
          },
          {
            description: "Page views by path (last 24 hours)",
            sql: `SELECT blob2 as page, COUNT(*) as views FROM cryptid_analytics WHERE blob1 = 'page_view' AND timestamp > NOW() - INTERVAL '1' DAY GROUP BY blob2 ORDER BY views DESC`
          }
        ],
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
