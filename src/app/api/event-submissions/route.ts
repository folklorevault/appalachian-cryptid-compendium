import { NextRequest, NextResponse } from "next/server";
import { checkBotId } from "botid/server";

const SANITY_PROJECT_ID = "8thljucm";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";
const MAX_REQUEST_BODY_BYTES = 16 * 1024;

const ROLES = ["organizer", "attendee", "other"] as const;

// Max lengths. Names and places are short; the note is the only long field.
const LIMITS = {
  eventName: 150,
  eventSlug: 100,
  town: 100,
  state: 40,
  dates: 150,
  url: 500,
  email: 254,
  note: 3000,
} as const;

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

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
  return { body: body as Record<string, unknown> };
}

/** Trimmed string, or undefined for anything that isn't a non-empty string. */
const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

/** http(s) URLs only: the value ends up as a clickable link in Studio. */
function httpUrl(v: unknown): string | undefined | null {
  const s = text(v);
  if (!s) return undefined;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

const fakeSuccess = () =>
  NextResponse.json(
    { success: true, id: "ok", message: "Submission received" },
    { status: 201 }
  );

export async function POST(request: NextRequest) {
  try {
    // BotID check. Log every verdict so a mass-block (e.g. a CSP change
    // starving the BotID challenge, as happened 2026-03-31) shows up in logs.
    // If this only ever prints "BLOCKED", real submissions are being dropped.
    const verification = await checkBotId();
    console.log(
      `[botid] /api/event-submissions verdict: ${verification.isBot ? "BLOCKED" : "allowed"}`
    );
    if (verification.isBot) return fakeSuccess();

    const parsed = await parseJsonBodyWithLimit(request);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }
    const body = parsed.body;

    // Honeypot and timing checks: fake success so bots don't retry.
    if (body.website) return fakeSuccess();
    if (typeof body._t === "number" && Date.now() - body._t < 3000) return fakeSuccess();

    const eventName = text(body.event_name);
    if (!eventName) {
      return NextResponse.json({ error: "Please tell us which event this is about." }, { status: 400 });
    }

    const role = ROLES.find((r) => r === body.role) ?? "other";
    const officialUrl = httpUrl(body.official_url);
    const sourceUrl = httpUrl(body.source_url);
    if (officialUrl === null || sourceUrl === null) {
      return NextResponse.json({ error: "That link needs to start with http:// or https://." }, { status: 400 });
    }

    const email = text(body.email);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "That email address looks off." }, { status: 400 });
    }

    const fields = {
      eventName,
      eventSlug: text(body.event_slug),
      town: text(body.town),
      state: text(body.state),
      dates: text(body.dates),
      email,
      note: text(body.note),
    };
    for (const [key, max] of [
      ["eventName", LIMITS.eventName],
      ["eventSlug", LIMITS.eventSlug],
      ["town", LIMITS.town],
      ["state", LIMITS.state],
      ["dates", LIMITS.dates],
      ["email", LIMITS.email],
      ["note", LIMITS.note],
    ] as const) {
      if ((fields[key]?.length ?? 0) > max) {
        return NextResponse.json({ error: "One of the answers is too long. Please shorten it." }, { status: 400 });
      }
    }
    if ((officialUrl?.length ?? 0) > LIMITS.url || (sourceUrl?.length ?? 0) > LIMITS.url) {
      return NextResponse.json({ error: "One of the links is too long." }, { status: 400 });
    }

    // Something has to be changing: dates, a link, or a note.
    if (!fields.dates && !officialUrl && !sourceUrl && !fields.note) {
      return NextResponse.json(
        { error: "Add the new dates, a link, or a short note so the Bureau knows what to check." },
        { status: 400 }
      );
    }

    const sanityToken = process.env.SANITY_API_TOKEN;
    if (!sanityToken) {
      console.error("SANITY_API_TOKEN not configured: event submission NOT saved");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const documentId = `event-submission-${generateId()}`;

    const document = {
      // A draft on purpose. The dataset is public and only documents with a
      // dot in their _id need a token to read, so a published submission would
      // expose the sender's email. See schemaTypes/eventSubmission.ts.
      _id: `drafts.${documentId}`,
      _type: "eventSubmission",
      status: "pending",
      role,
      ...fields,
      officialUrl,
      sourceUrl,
      organizerInterest: body.organizer_interest === true,
      submittedAt: new Date().toISOString(),
    };

    const response = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sanityToken}`,
        },
        body: JSON.stringify({ mutations: [{ create: document }] }),
      }
    );

    // Say "received" only after Sanity confirms the write.
    if (!response.ok) {
      console.error("Sanity API error saving event submission:", response.status, await response.text());
      return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
    }

    console.log(`[event-submissions] saved ${documentId} (${role})`);
    return NextResponse.json(
      { success: true, id: documentId, message: "Submission received" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event submission:", error);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }
}
