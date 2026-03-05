import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Sanity webhook handler — revalidates affected pages when content changes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify the webhook secret if configured
    const secret = request.headers.get("x-sanity-webhook-secret");
    if (process.env.SANITY_WEBHOOK_SECRET && secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const type = body._type;
    const slug = body.slug?.current;

    if (type === "cryptid") {
      revalidateTag("cryptids");
      if (slug) {
        revalidateTag(`cryptid-${slug}`);
      }
    } else if (type === "anomaly") {
      revalidateTag("anomalies");
      if (slug) {
        revalidateTag(`anomaly-${slug}`);
      }
    } else {
      // For unknown types, revalidate everything
      revalidateTag("sanity");
    }

    return NextResponse.json({
      revalidated: true,
      type,
      slug,
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 }
    );
  }
}
