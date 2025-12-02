// POST /api/auth - Admin login
// GET /api/auth - Verify token

import {
  Env,
  jsonResponse,
  errorResponse,
  handleOptions,
  corsHeaders,
} from "./_shared";

interface LoginInput {
  api_key: string;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleOptions();
};

// Verify if the provided token is valid
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ authenticated: false });
  }

  const token = authHeader.replace("Bearer ", "");
  const isValid = token === env.ADMIN_API_KEY;

  return jsonResponse({ authenticated: isValid });
};

// Login with API key
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    const body = (await request.json()) as LoginInput;

    if (!body.api_key) {
      return errorResponse("API key required");
    }

    // Check if API key matches
    if (body.api_key !== env.ADMIN_API_KEY) {
      return errorResponse("Invalid API key", 401);
    }

    // Return the token (in this simple case, it's the same as the API key)
    // In production, you might generate a JWT here
    return jsonResponse({
      success: true,
      token: body.api_key,
      message: "Authentication successful",
    });
  } catch (error) {
    console.error("Auth error:", error);
    return errorResponse("Authentication failed", 500);
  }
};

