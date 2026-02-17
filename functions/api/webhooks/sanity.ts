// POST /api/webhooks/sanity - Sanity webhook handler
// Receives publish events, submits changed URLs to IndexNow, and purges edge cache.
// Validated via x-webhook-secret header (not admin auth — this is server-to-server).

import { Env } from "../_shared";

const BASE_URL = "https://appalachiancryptid.com";

// Map Sanity document types to URL prefixes
const TYPE_PREFIX_MAP: Record<string, string> = {
  cryptid: "/cryptid/",
  anomaly: "/anomaly/",
};

// Listing pages to purge when any content changes
const LISTING_PAGES = ["/", "/field-guide", "/anomalies"];

interface SanityWebhookBody {
  _id?: string;
  _type?: string;
  _rev?: string;
  slug?: { current?: string };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  // Validate webhook secret
  const secret = request.headers.get("x-webhook-secret");
  if (!secret || secret !== env.SANITY_WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await request.json()) as SanityWebhookBody;
    const { _type, slug } = body;

    // Skip unrecognized document types (return 200 to prevent Sanity retries)
    const prefix = _type ? TYPE_PREFIX_MAP[_type] : undefined;
    if (!prefix || !slug?.current) {
      return new Response(
        JSON.stringify({ success: true, skipped: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const changedPath = `${prefix}${slug.current}`;
    const changedUrl = `${BASE_URL}${changedPath}`;

    // Submit to IndexNow and purge cache in parallel
    const key = env.INDEXNOW_KEY;
    const indexNowPromise = key
      ? fetch("https://api.indexnow.org/indexnow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            host: "appalachiancryptid.com",
            key,
            keyLocation: `${BASE_URL}/${key}.txt`,
            urlList: [changedUrl],
          }),
        }).catch((err) => console.error("IndexNow submission failed:", err))
      : Promise.resolve();

    // Purge edge cache for the changed page + listing pages
    const cache = caches.default;
    const pathsToPurge = [changedPath, ...LISTING_PAGES];
    const purgePromises = pathsToPurge.map((path) => {
      const url = `${request.url.split("/api/")[0]}${path}`;
      return cache.delete(url).catch((err) =>
        console.error(`Cache purge failed for ${path}:`, err)
      );
    });

    await Promise.all([indexNowPromise, ...purgePromises]);

    return new Response(
      JSON.stringify({
        success: true,
        indexed: changedUrl,
        cachesPurged: pathsToPurge,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Sanity webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
