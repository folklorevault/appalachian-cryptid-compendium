// Dynamic XML sitemap generator
// Accessible at /sitemap.xml
// Fetches cryptids and anomalies from Sanity CMS

interface Env {
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
}

interface SanityResult {
  result: Array<{
    slug: { current: string };
    _updatedAt?: string;
  }>;
}

const SANITY_PROJECT_ID = "8thljucm";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";

async function fetchFromSanity(query: string): Promise<SanityResult> {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodedQuery}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Sanity API error: ${response.status}`);
  }
  return response.json();
}

export const onRequestGet: PagesFunction<Env> = async () => {
  const baseUrl = "https://appalachiancryptid.com";

  try {
    // Fetch cryptids and anomalies from Sanity in parallel
    const [cryptidsResponse, anomaliesResponse] = await Promise.all([
      fetchFromSanity(`*[_type == "cryptid"]{ slug, _updatedAt } | order(slug.current asc)`),
      fetchFromSanity(`*[_type == "anomaly"]{ slug, _updatedAt } | order(slug.current asc)`),
    ]);

    const cryptids = cryptidsResponse.result || [];
    const anomalies = anomaliesResponse.result || [];

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
        loc: `${baseUrl}/map`,
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        loc: `${baseUrl}/report`,
        changefreq: "monthly",
        priority: "0.7",
      },
      {
        loc: `${baseUrl}/anomalies`,
        changefreq: "weekly",
        priority: "0.9",
      },
      // Dynamic cryptid pages
      ...cryptids.map((cryptid) => ({
        loc: `${baseUrl}/cryptid/${cryptid.slug?.current}`,
        changefreq: "monthly",
        priority: "0.9",
        lastmod: cryptid._updatedAt
          ? cryptid._updatedAt.split("T")[0]
          : undefined,
      })),
      // Dynamic anomaly pages
      ...anomalies.map((anomaly) => ({
        loc: `${baseUrl}/anomaly/${anomaly.slug?.current}`,
        changefreq: "monthly",
        priority: "0.8",
        lastmod: anomaly._updatedAt
          ? anomaly._updatedAt.split("T")[0]
          : undefined,
      })),
    ].filter((url) => url.loc && !url.loc.includes("undefined"));

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
    console.error("Sitemap generation error:", error);
    // Fallback sitemap with static routes only if Sanity is unavailable
    const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
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
  <url>
    <loc>${baseUrl}/anomalies</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
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
