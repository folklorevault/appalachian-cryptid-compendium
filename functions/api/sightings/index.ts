// POST /api/sightings - Submit a new sighting report to Sanity

import {
  Env,
  jsonResponse,
  errorResponse,
  handleOptions,
  generateId,
} from "../_shared";

interface SightingInput {
  witness_name: string;
  email: string;
  date: string;
  time?: string;
  location: string;
  state: string;
  creature_name?: string;
  description: string;
  physical_description: string;
  behavior?: string;
}

// Sanity configuration
const SANITY_PROJECT_ID = "8thljucm";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleOptions();
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    const body = (await request.json()) as SightingInput;

    // Validate required fields
    if (
      !body.witness_name ||
      !body.email ||
      !body.date ||
      !body.location ||
      !body.state ||
      !body.description ||
      !body.physical_description
    ) {
      return errorResponse(
        "Missing required fields: witness_name, email, date, location, state, description, physical_description"
      );
    }

    // Basic email validation
    if (!body.email.includes("@")) {
      return errorResponse("Invalid email address");
    }

    // Check for Sanity API token
    const sanityToken = env.SANITY_API_TOKEN;
    if (!sanityToken) {
      console.error("SANITY_API_TOKEN not configured");
      return errorResponse("Server configuration error", 500);
    }

    const documentId = `sighting-${generateId()}`;

    // Create the Sanity document
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

    // POST to Sanity mutations API
    const sanityUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`;

    const sanityResponse = await fetch(sanityUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sanityToken}`,
      },
      body: JSON.stringify({
        mutations: [
          {
            create: sanityDocument,
          },
        ],
      }),
    });

    if (!sanityResponse.ok) {
      const errorText = await sanityResponse.text();
      console.error("Sanity API error:", errorText);
      return errorResponse("Failed to submit sighting report", 500);
    }

    return jsonResponse(
      {
        success: true,
        id: documentId,
        message: "Sighting report submitted successfully",
      },
      201
    );
  } catch (error) {
    console.error("Error creating sighting report:", error);
    return errorResponse("Failed to submit sighting report", 500);
  }
};

