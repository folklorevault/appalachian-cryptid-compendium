// POST /api/indexnow - Submit URLs to IndexNow for instant search engine indexing (admin only)
// If body.urls provided, submits those specific URLs.
// If body.urls empty/absent, fetches all cryptid + anomaly slugs from Sanity and submits all site URLs.

import {
  Env,
  errorResponse,
  jsonResponse,
  handleOptions,
  isAuthenticated,
} from "./_shared";

const SANITY_PROJECT_ID = "8thljucm";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";
const BASE_URL = "https://appalachiancryptid.com";

interface SanityResult {
  result: Array<{ slug: { current: string } }>;
}

async function fetchSanitySlugs(query: string): Promise<SanityResult> {
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Sanity API error: ${response.status}`);
  }
  return response.json();
}

async function submitToIndexNow(
  key: string,
  urls: string[]
): Promise<Response> {
  return fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: "appalachiancryptid.com",
      key,
      keyLocation: `${BASE_URL}/${key}.txt`,
      urlList: urls,
    }),
  });
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleOptions();
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  if (!isAuthenticated(request, env)) {
    return errorResponse("Unauthorized", 401);
  }

  const key = env.INDEXNOW_KEY;
  if (!key) {
    return errorResponse("INDEXNOW_KEY not configured", 500);
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      urls?: string[];
    };

    let urls: string[];

    if (body.urls && body.urls.length > 0) {
      // Submit specific URLs provided by the admin
      urls = body.urls;
    } else {
      // Bulk mode: fetch all slugs from Sanity and build full URL list
      const [cryptidsResponse, anomaliesResponse] = await Promise.all([
        fetchSanitySlugs(
          `*[_type == "cryptid"]{ slug } | order(slug.current asc)`
        ),
        fetchSanitySlugs(
          `*[_type == "anomaly"]{ slug } | order(slug.current asc)`
        ),
      ]);

      const cryptids = cryptidsResponse.result || [];
      const anomalies = anomaliesResponse.result || [];

      urls = [
        BASE_URL,
        `${BASE_URL}/field-guide`,
        `${BASE_URL}/anomalies`,
        `${BASE_URL}/map`,
        `${BASE_URL}/report`,
        ...cryptids
          .filter((c) => c.slug?.current)
          .map((c) => `${BASE_URL}/cryptid/${c.slug.current}`),
        ...anomalies
          .filter((a) => a.slug?.current)
          .map((a) => `${BASE_URL}/anomaly/${a.slug.current}`),
      ];
    }

    const indexNowResponse = await submitToIndexNow(key, urls);

    return jsonResponse({
      success: indexNowResponse.ok || indexNowResponse.status === 202,
      status: indexNowResponse.status,
      urlCount: urls.length,
      urls,
    });
  } catch (error) {
    console.error("IndexNow submission error:", error);
    return errorResponse("Failed to submit URLs to IndexNow", 500);
  }
};
