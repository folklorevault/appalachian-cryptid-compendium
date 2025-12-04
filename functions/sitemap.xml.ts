// Dynamic XML sitemap generator
// Accessible at /sitemap.xml

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const baseUrl = "https://appalachiancryptid.com";

  try {
    // Get all cryptid IDs from the database
    const result = await env.DB.prepare(
      "SELECT id, updated_at FROM cryptids ORDER BY id"
    ).all();

    const cryptids = result.results || [];

    // Build the sitemap XML
    const urls = [
      // Static pages
      {
        loc: baseUrl,
        changefreq: "weekly",
        priority: "1.0",
        lastmod: new Date().toISOString().split("T")[0],
      },
      {
        loc: `${baseUrl}/about`,
        changefreq: "monthly",
        priority: "0.8",
      },
      {
        loc: `${baseUrl}/map`,
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        loc: `${baseUrl}/report`,
        changefreq: "monthly",
        priority: "0.7",
      },
      // Dynamic cryptid pages
      ...cryptids.map((cryptid: any) => ({
        loc: `${baseUrl}/cryptid/${cryptid.id}`,
        changefreq: "monthly",
        priority: "0.9",
        lastmod: cryptid.updated_at
          ? new Date(cryptid.updated_at).toISOString().split("T")[0]
          : undefined,
      })),
    ];

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(xmlContent, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    // Fallback sitemap with static routes only if DB is unavailable
    const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/map</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/report</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

    return new Response(staticSitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
};
