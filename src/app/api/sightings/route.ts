import { NextRequest, NextResponse } from "next/server";
import { checkBotId } from "botid/server";

const SANITY_PROJECT_ID = "8thljucm";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";
const MAX_REQUEST_BODY_BYTES = 16 * 1024;
const MAX_DATE_LENGTH = 10;
const MAX_TIME_LENGTH = 50;

function generateId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
  );
}

async function parseJsonBodyWithLimit(request: NextRequest) {
  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const parsedLength = Number.parseInt(contentLength, 10);
    if (Number.isFinite(parsedLength) && parsedLength > MAX_REQUEST_BODY_BYTES) {
      return { error: "Request body too large.", status: 413 as const };
    }
  }

  if (!request.body) {
    return { error: "Invalid request body.", status: 400 as const };
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bodyText = "";
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > MAX_REQUEST_BODY_BYTES) {
      return { error: "Request body too large.", status: 413 as const };
    }

    bodyText += decoder.decode(value, { stream: true });
  }

  bodyText += decoder.decode();

  let body: unknown;
  try {
    body = JSON.parse(bodyText);
  } catch {
    return { error: "Invalid JSON body.", status: 400 as const };
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Invalid request body.", status: 400 as const };
  }

  return { body: body as Record<string, any> };
}

export async function POST(request: NextRequest) {
  try {
    // BotID check — blocks automated bots at the platform level
    const verification = await checkBotId();
    // Log every verdict so a mass-block (e.g. a CSP change starving the BotID
    // challenge, as happened 2026-03-31) is visible in logs. If this only ever
    // prints "BLOCKED", real witnesses are being silently dropped — investigate.
    console.log(`[botid] /api/sightings verdict: ${verification.isBot ? "BLOCKED" : "allowed"}`);
    if (verification.isBot) {
      return NextResponse.json(
        { success: true, id: "ok", message: "Sighting report submitted successfully" },
        { status: 201 }
      );
    }

    const parsedBody = await parseJsonBodyWithLimit(request);
    if ("error" in parsedBody) {
      return NextResponse.json(
        { error: parsedBody.error },
        { status: parsedBody.status }
      );
    }

    const body = parsedBody.body;

    // Honeypot check: if the hidden field is filled, it's a bot.
    // Return fake success so bots don't retry.
    if (body.website) {
      return NextResponse.json(
        { success: true, id: "ok", message: "Sighting report submitted successfully" },
        { status: 201 }
      );
    }

    // Timing check: if submitted less than 3 seconds after page load, likely a bot
    if (body._t && Date.now() - body._t < 3000) {
      return NextResponse.json(
        { success: true, id: "ok", message: "Sighting report submitted successfully" },
        { status: 201 }
      );
    }

    // Only the encounter description is required — everything else is
    // optional so we don't scare off witnesses who just want to leave a note.
    if (!body.description || !body.description.trim()) {
      return NextResponse.json(
        { error: "Please tell us what you saw." },
        { status: 400 }
      );
    }

    if (body.email && !body.email.includes("@")) {
      return NextResponse.json(
        { error: "That email address looks off." },
        { status: 400 }
      );
    }

    if (body.witness_name && body.witness_name.length > 100) {
      return NextResponse.json(
        { error: "Witness name must be 100 characters or fewer." },
        { status: 400 }
      );
    }

    if (body.email && body.email.length > 254) {
      return NextResponse.json(
        { error: "Email must be 254 characters or fewer." },
        { status: 400 }
      );
    }

    if (body.location && body.location.length > 1000) {
      return NextResponse.json(
        { error: "Location must be 1,000 characters or fewer." },
        { status: 400 }
      );
    }

    if (body.state && body.state.length > 50) {
      return NextResponse.json(
        { error: "State must be 50 characters or fewer." },
        { status: 400 }
      );
    }

    if (body.creature_name && body.creature_name.length > 150) {
      return NextResponse.json(
        { error: "Creature name must be 150 characters or fewer." },
        { status: 400 }
      );
    }

    if (body.description && body.description.length > 5000) {
      return NextResponse.json(
        { error: "Description must be 5,000 characters or fewer." },
        { status: 400 }
      );
    }

    if (body.physical_description && body.physical_description.length > 3000) {
      return NextResponse.json(
        { error: "Physical description must be 3,000 characters or fewer." },
        { status: 400 }
      );
    }

    if (body.behavior && body.behavior.length > 3000) {
      return NextResponse.json(
        { error: "Behavior must be 3,000 characters or fewer." },
        { status: 400 }
      );
    }

    if (body.date !== undefined && body.date !== null) {
      if (typeof body.date !== "string") {
        return NextResponse.json(
          { error: "Date must be a string in YYYY-MM-DD format." },
          { status: 400 }
        );
      }

      const trimmedDate = body.date.trim();
      if (trimmedDate.length > MAX_DATE_LENGTH) {
        return NextResponse.json(
          { error: "Date must be 10 characters or fewer." },
          { status: 400 }
        );
      }

      if (trimmedDate && !/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) {
        return NextResponse.json(
          { error: "Date must use YYYY-MM-DD format." },
          { status: 400 }
        );
      }

      if (trimmedDate) {
        const parsedDate = new Date(`${trimmedDate}T00:00:00.000Z`);
        if (
          Number.isNaN(parsedDate.getTime()) ||
          parsedDate.toISOString().slice(0, 10) !== trimmedDate
        ) {
          return NextResponse.json(
            { error: "Date must be a valid calendar date." },
            { status: 400 }
          );
        }
      }

      body.date = trimmedDate || undefined;
    }

    if (body.time !== undefined && body.time !== null) {
      if (typeof body.time !== "string") {
        return NextResponse.json(
          { error: "Time must be a string." },
          { status: 400 }
        );
      }

      const trimmedTime = body.time.trim();
      if (trimmedTime.length > MAX_TIME_LENGTH) {
        return NextResponse.json(
          { error: "Time must be 50 characters or fewer." },
          { status: 400 }
        );
      }

      body.time = trimmedTime || undefined;
    }

    const sanityToken = process.env.SANITY_API_TOKEN;
    if (!sanityToken) {
      console.error("SANITY_API_TOKEN not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const documentId = `sighting-${generateId()}`;

    const sanityDocument = {
      _id: documentId,
      _type: "sightingReport",
      status: "pending",
      witnessName: body.witness_name?.trim() || "Anonymous",
      email: body.email?.trim() || undefined,
      date: body.date || undefined,
      time: body.time || undefined,
      location: body.location?.trim() || undefined,
      state: body.state || "Other / Unsure",
      creatureName: body.creature_name?.trim() || undefined,
      description: body.description.trim(),
      physicalDescription: body.physical_description?.trim() || undefined,
      behavior: body.behavior?.trim() || undefined,
    };

    const sanityUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`;

    const sanityResponse = await fetch(sanityUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sanityToken}`,
      },
      body: JSON.stringify({
        mutations: [{ create: sanityDocument }],
      }),
    });

    if (!sanityResponse.ok) {
      const errorText = await sanityResponse.text();
      console.error("Sanity API error:", errorText);
      return NextResponse.json(
        { error: "Failed to submit sighting report" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        id: documentId,
        message: "Sighting report submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating sighting report:", error);
    return NextResponse.json(
      { error: "Failed to submit sighting report" },
      { status: 500 }
    );
  }
}
