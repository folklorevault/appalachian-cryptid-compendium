import { Env, jsonResponse, handleOptions, corsHeaders } from "./_shared";

interface TrendingCryptid {
  cryptid: string;
  views: number;
}

/**
 * GET /api/trending
 * Returns the top 5 most-viewed cryptids from the last 7 days.
 * This is a public endpoint (no auth required).
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    // Query the analytics table for top cryptids by view count in last 7 days
    const stmt = env.DB.prepare(`
      SELECT cryptid, COUNT(*) as views
      FROM analytics
      WHERE event = 'page_view'
        AND cryptid IS NOT NULL
        AND cryptid != ''
        AND timestamp >= datetime('now', '-7 days')
      GROUP BY cryptid
      ORDER BY views DESC
      LIMIT 5
    `);

    const { results } = await stmt.all<TrendingCryptid>();

    return jsonResponse({
      trending: results || [],
      period: "7 days",
    });
  } catch (error) {
    console.error("Trending API error:", error);
    // Return empty array on error - trending is non-critical
    return jsonResponse({
      trending: [],
      period: "7 days",
    });
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleOptions();
};
