import { NextRequest, NextResponse } from "next/server";

// Parse email from either JSON or form-encoded body
async function parseEmail(request: NextRequest): Promise<{ email: string; loadedAt?: number; honeypot?: string; isFormSubmission: boolean }> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await request.formData();
    return {
      email: formData.get("email") as string || "",
      honeypot: formData.get("website") as string || "",
      loadedAt: undefined,
      isFormSubmission: true,
    };
  }

  const body = await request.json();
  return {
    email: body.email || "",
    honeypot: body.website || "",
    loadedAt: body._t,
    isFormSubmission: false,
  };
}

// Add contact to Loops.so mailing list
async function addToLoops(email: string): Promise<boolean> {
  const loopsApiKey = process.env.LOOPS_API_KEY;
  if (!loopsApiKey) {
    console.warn("LOOPS_API_KEY not configured — skipping Loops signup");
    return false;
  }

  const response = await fetch("https://app.loops.so/api/v1/contacts/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loopsApiKey}`,
    },
    body: JSON.stringify({
      email,
      source: "appalachian-cryptid-compendium",
      mailingLists: {
        cmlwtpmz40dhh0iyf479cb0jr: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Loops API error:", errorText);
    return false;
  }

  return true;
}

// Save subscriber record to Sanity (backup/audit)
async function addToSanity(email: string): Promise<boolean> {
  const sanityToken = process.env.SANITY_API_TOKEN;
  if (!sanityToken) {
    console.warn("SANITY_API_TOKEN not configured — skipping Sanity subscriber record");
    return false;
  }

  const sanityUrl = `https://8thljucm.api.sanity.io/v2024-01-01/data/mutate/production`;

  const response = await fetch(sanityUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sanityToken}`,
    },
    body: JSON.stringify({
      mutations: [
        {
          create: {
            _type: "newsletterSubscriber",
            email,
            subscribedAt: new Date().toISOString(),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Sanity API error:", errorText);
    return false;
  }

  return true;
}

function errorResponse(isFormSubmission: boolean, message: string, request: NextRequest, status = 500) {
  if (isFormSubmission) {
    return NextResponse.redirect(new URL("/newsletter-error", request.url), 303);
  }
  return NextResponse.json({ success: false, error: message }, { status });
}

function successResponse(isFormSubmission: boolean, request: NextRequest) {
  if (isFormSubmission) {
    return NextResponse.redirect(new URL("/newsletter-success", request.url), 303);
  }
  return NextResponse.json({ success: true });
}

// Newsletter signup handler — adds to Loops.so + creates Sanity subscriber record
export async function POST(request: NextRequest) {
  try {
    const { email, loadedAt, honeypot, isFormSubmission } = await parseEmail(request);

    // Honeypot check: if the hidden field is filled, it's a bot.
    // Return fake success so bots don't retry.
    if (honeypot) {
      return successResponse(isFormSubmission, request);
    }

    // Basic validation
    if (!email || !email.includes("@")) {
      return errorResponse(isFormSubmission, "A valid email is required.", request, 400);
    }

    // Timing check: if submitted less than 2 seconds after page load, likely a bot
    // (only applies to JS submissions that include the timestamp)
    if (loadedAt && Date.now() - loadedAt < 2000) {
      return successResponse(isFormSubmission, request);
    }

    // Add to Loops (primary — this is what actually sends emails)
    // and Sanity (secondary — subscriber record for the CMS)
    const [loopsOk, sanityOk] = await Promise.all([
      addToLoops(email),
      addToSanity(email),
    ]);

    // Fail only if Loops fails and was configured (i.e., key exists but API errored)
    if (!loopsOk && process.env.LOOPS_API_KEY) {
      return errorResponse(isFormSubmission, "Subscription failed. Try again.", request);
    }

    // If neither service was configured, that's a server config problem
    if (!loopsOk && !sanityOk) {
      console.error("Neither LOOPS_API_KEY nor SANITY_API_TOKEN configured");
      return errorResponse(isFormSubmission, "Server configuration error", request);
    }

    return successResponse(isFormSubmission, request);
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { success: false, error: "Subscription failed. Try again." },
      { status: 500 }
    );
  }
}
