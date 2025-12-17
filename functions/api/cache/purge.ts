// POST /api/cache/purge - Clear cache for specific pages (admin only)

import { Env, errorResponse, handleOptions, corsHeaders } from "../_shared";

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleOptions();
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    // Check authentication
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token || token !== env.ADMIN_API_KEY) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const { path } = body;

    if (!path) {
      return errorResponse("Path is required", 400);
    }

    // Build the full URL to purge
    const url = new URL(request.url);
    const urlToPurge = `${url.protocol}//${url.host}${path}`;

    // Delete from cache
    const cache = caches.default;
    const deleted = await cache.delete(urlToPurge);

    return new Response(
      JSON.stringify({
        success: true,
        purged: urlToPurge,
        deleted,
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
    console.error("Error purging cache:", error);
    return errorResponse("Failed to purge cache", 500);
  }
};
