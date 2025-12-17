// GET /api/images/* - Serve optimized images from R2 storage

import { Env, errorResponse, handleOptions, corsHeaders } from "../_shared";

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleOptions();
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, params, request } = context;

  try {
    // Get the full path from the catch-all parameter
    const pathParam = params.path;
    const imagePath = Array.isArray(pathParam) ? pathParam.join("/") : pathParam;

    if (!imagePath) {
      return errorResponse("Image path required", 400);
    }

    // Parse URL for optimization parameters
    const url = new URL(request.url);
    const width = url.searchParams.get("w");
    const height = url.searchParams.get("h");
    const quality = url.searchParams.get("q") || "85";
    const format = url.searchParams.get("f"); // webp, avif, jpeg, png

    // Retrieve from R2
    const object = await env.IMAGES.get(imagePath);

    if (!object) {
      return errorResponse("Image not found", 404);
    }

    // Get the image body
    const body = await object.arrayBuffer();

    // If no optimization params, return original
    if (!width && !height && !format) {
      return new Response(body, {
        status: 200,
        headers: {
          "Content-Type": object.httpMetadata?.contentType || "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
          "ETag": object.etag,
          ...corsHeaders,
        },
      });
    }

    // Build image transformation options
    const options: any = {
      quality: parseInt(quality),
    };

    if (width) options.width = parseInt(width);
    if (height) options.height = parseInt(height);
    if (format) options.format = format;

    // Use Cloudflare's image resizing
    // This requires the "image_resizing" binding in wrangler.toml
    const imageRequest = new Request(request.url, {
      cf: {
        image: options,
      },
    });

    // Create response with the body
    const response = new Response(body, {
      status: 200,
      headers: {
        "Content-Type": format
          ? `image/${format}`
          : object.httpMetadata?.contentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "ETag": object.etag,
        "Vary": "Accept",
        ...corsHeaders,
      },
    });

    // Apply image transformations via cf.image
    return fetch(imageRequest.url, {
      method: "GET",
      body: response.body,
      cf: {
        image: options,
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return errorResponse("Failed to serve image", 500);
  }
};
