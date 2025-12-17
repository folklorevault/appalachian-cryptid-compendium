// GET /api/analytics/stats - Get dashboard statistics (admin only)

import { Env, errorResponse, handleOptions, corsHeaders } from "../_shared";

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleOptions();
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    // Check authentication
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token || token !== env.ADMIN_API_KEY) {
      return errorResponse("Unauthorized", 401);
    }

    // Get popular cryptids (top 10)
    const popularCryptidsStmt = await env.DB.prepare(`
      SELECT
        cryptid,
        COUNT(*) as views,
        MAX(timestamp) as last_viewed
      FROM analytics
      WHERE event = 'page_view' AND cryptid IS NOT NULL AND cryptid != ''
      GROUP BY cryptid
      ORDER BY views DESC
      LIMIT 10
    `);
    const { results: popularCryptids } = await popularCryptidsStmt.all();

    // Get recent searches (top 10)
    const searchesStmt = await env.DB.prepare(`
      SELECT
        page as query,
        COUNT(*) as count,
        MAX(timestamp) as last_search
      FROM analytics
      WHERE event = 'search'
      GROUP BY page
      ORDER BY count DESC
      LIMIT 10
    `);
    const { results: recentSearches } = await searchesStmt.all();

    // Get filter usage stats
    const filtersStmt = await env.DB.prepare(`
      SELECT
        page as filter_type,
        COUNT(*) as uses,
        MAX(timestamp) as last_used
      FROM analytics
      WHERE event = 'filter_applied'
      GROUP BY page
      ORDER BY uses DESC
      LIMIT 10
    `);
    const { results: filterStats } = await filtersStmt.all();

    // Get total stats
    const totalsStmt = await env.DB.prepare(`
      SELECT
        COUNT(*) as total_events,
        COUNT(DISTINCT CASE WHEN event = 'page_view' THEN page END) as unique_pages,
        COUNT(CASE WHEN event = 'page_view' THEN 1 END) as total_page_views,
        COUNT(CASE WHEN event = 'search' THEN 1 END) as total_searches,
        COUNT(CASE WHEN event = 'sighting_submitted' THEN 1 END) as total_sightings
      FROM analytics
    `);
    const totals = await totalsStmt.first();

    // Get daily views for last 7 days
    const dailyStmt = await env.DB.prepare(`
      SELECT
        DATE(timestamp) as date,
        COUNT(*) as views
      FROM analytics
      WHERE event = 'page_view' AND DATE(timestamp) >= DATE('now', '-7 days')
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `);
    const { results: dailyViews } = await dailyStmt.all();

    // Get recent activity (last 20 events)
    const recentStmt = await env.DB.prepare(`
      SELECT
        event,
        page,
        cryptid,
        timestamp
      FROM analytics
      ORDER BY timestamp DESC
      LIMIT 20
    `);
    const { results: recentActivity } = await recentStmt.all();

    return new Response(
      JSON.stringify({
        totals,
        popularCryptids,
        recentSearches,
        filterStats,
        dailyViews,
        recentActivity,
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
    console.error("Error retrieving analytics stats:", error);
    return errorResponse("Failed to retrieve analytics", 500);
  }
};
