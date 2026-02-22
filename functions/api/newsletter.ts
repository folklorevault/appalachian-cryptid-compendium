import { Env, jsonResponse, errorResponse, handleOptions } from "./_shared";

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleOptions();
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const apiKey = env.LOOPS_API_KEY;
  if (!apiKey) {
    return errorResponse("Newsletter service not configured", 503);
  }

  let body: { email?: string; _t?: number };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request body");
  }

  // Timing check — reject submissions faster than 2 seconds (bot behavior)
  const MIN_FORM_MS = 2000;
  if (body._t && Date.now() - body._t < MIN_FORM_MS) {
    // Fake success so bots don't retry
    return jsonResponse({ success: true });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return errorResponse("A valid email address is required");
  }

  // Forward to Loops API
  const loopsRes = await fetch("https://app.loops.so/api/v1/contacts/create", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      source: "website",
      mailingLists: {
        cmlwtpmz40dhh0iyf479cb0jr: true,
      },
    }),
  });

  const loopsData = await loopsRes.json() as { success: boolean; message?: string };

  // 409 = already exists, treat as success
  if (loopsRes.ok || loopsRes.status === 409) {
    return jsonResponse({ success: true });
  }

  return errorResponse(loopsData.message || "Failed to register", loopsRes.status);
};
