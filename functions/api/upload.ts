// POST /api/upload - Upload an image to R2 storage

import {
  Env,
  jsonResponse,
  errorResponse,
  handleOptions,
  generateId,
} from "./_shared";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleOptions();
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    const contentType = request.headers.get("Content-Type") || "";
    
    // Handle multipart form data
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return errorResponse("No file provided");
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return errorResponse(
          `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`
        );
      }

      // Validate file size
      if (file.size > MAX_SIZE) {
        return errorResponse("File too large. Maximum size is 10MB");
      }

      // Generate unique filename
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `sightings/${generateId()}.${ext}`;

      // Upload to R2
      const arrayBuffer = await file.arrayBuffer();
      await env.IMAGES.put(filename, arrayBuffer, {
        httpMetadata: {
          contentType: file.type,
        },
      });

      // Return the URL path (will be served from R2 public bucket or via worker)
      const imageUrl = `/api/images/${filename}`;

      return jsonResponse({
        success: true,
        url: imageUrl,
        filename,
      });
    }

    // Handle base64 JSON upload (fallback for the current implementation)
    if (contentType.includes("application/json")) {
      const body = await request.json() as { image: string; filename?: string };
      
      if (!body.image) {
        return errorResponse("No image data provided");
      }

      // Parse base64 data URL
      const match = body.image.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        return errorResponse("Invalid image format. Expected base64 data URL");
      }

      const mimeType = match[1];
      const base64Data = match[2];

      if (!ALLOWED_TYPES.includes(mimeType)) {
        return errorResponse(
          `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`
        );
      }

      // Convert base64 to binary
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Check size
      if (bytes.length > MAX_SIZE) {
        return errorResponse("File too large. Maximum size is 10MB");
      }

      // Generate filename
      const ext = mimeType.split("/")[1] || "jpg";
      const filename = `sightings/${generateId()}.${ext}`;

      // Upload to R2
      await env.IMAGES.put(filename, bytes.buffer, {
        httpMetadata: {
          contentType: mimeType,
        },
      });

      const imageUrl = `/api/images/${filename}`;

      return jsonResponse({
        success: true,
        url: imageUrl,
        filename,
      });
    }

    return errorResponse("Invalid content type");
  } catch (error) {
    console.error("Error uploading image:", error);
    return errorResponse("Failed to upload image", 500);
  }
};