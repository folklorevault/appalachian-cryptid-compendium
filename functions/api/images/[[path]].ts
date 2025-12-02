// GET /api/images/* - Serve images from R2 storage

import { Env, errorResponse, handleOptions, corsHeaders } from "../_shared";

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleOptions();
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, params } = context;

  try {
    // Get the full path from the catch-all parameter
    const pathParam = params.path;
    const imagePath = Array.isArray(pathParam) ? pathParam.join("/") : pathParam;

    if (!imagePath) {
      return errorResponse("Image path required", 400);
    }

    // Retrieve from R2
    const object = await env.IMAGES.get(imagePath);

    if (!object) {
      return errorResponse("Image not found", 404);
    }

    // Get the image body
    const body = await object.arrayBuffer();

    // Return the image with appropriate headers
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": object.httpMetadata?.contentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "ETag": object.etag,
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return errorResponse("Failed to serve image", 500);
  }
};