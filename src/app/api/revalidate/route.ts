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
      revalidateTag("cryptids", "max");
      if (slug) {
        revalidateTag(`cryptid-${slug}`, "max");
      }
    } else if (type === "anomaly") {
      revalidateTag("anomalies", "max");
      if (slug) {
        revalidateTag(`anomaly-${slug}`, "max");
      }
    } else {
      // For unknown types, revalidate everything
      revalidateTag("sanity", "max");
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
