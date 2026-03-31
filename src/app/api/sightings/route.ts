import { NextRequest, NextResponse } from "next/server";
import { checkBotId } from "botid/server";

const SANITY_PROJECT_ID = "8thljucm";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";

function generateId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
  );
}

export async function POST(request: NextRequest) {
  try {
    // BotID check — blocks automated bots at the platform level
    const verification = await checkBotId();
    if (verification.isBot) {
      return NextResponse.json(
        { success: true, id: "ok", message: "Sighting report submitted successfully" },
        { status: 201 }
      );
    }

    const body = await request.json();

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

    // Validate required fields
    const required = [
      "witness_name",
      "email",
      "date",
      "location",
      "state",
      "description",
      "physical_description",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!body.email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
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
      witnessName: body.witness_name,
      email: body.email,
      date: body.date,
      time: body.time || undefined,
      location: body.location,
      state: body.state,
      creatureName: body.creature_name || undefined,
      description: body.description,
      physicalDescription: body.physical_description,
      behavior: body.behavior || undefined,
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
