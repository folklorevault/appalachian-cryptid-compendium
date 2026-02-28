import { NextRequest, NextResponse } from "next/server";

// Newsletter signup handler — creates a subscriber document in Sanity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, _t: loadedAt } = body;

    // Basic validation
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email is required." },
        { status: 400 }
      );
    }

    // Timing check: if submitted less than 2 seconds after page load, likely a bot
    if (loadedAt && Date.now() - loadedAt < 2000) {
      // Silently accept to not tip off bots
      return NextResponse.json({ success: true });
    }

    const sanityToken = process.env.SANITY_API_TOKEN;
    if (!sanityToken) {
      console.error("SANITY_API_TOKEN not configured");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const sanityUrl = `https://8thljucm.api.sanity.io/v2024-01-01/data/mutate/production`;

    const sanityResponse = await fetch(sanityUrl, {
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

    if (!sanityResponse.ok) {
      const errorText = await sanityResponse.text();
      console.error("Sanity API error:", errorText);
      return NextResponse.json(
        { success: false, error: "Subscription failed. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { success: false, error: "Subscription failed. Try again." },
      { status: 500 }
    );
  }
}
