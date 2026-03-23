import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fetchCryptidBySlug } from "@/lib/sanity/fetchers";

export const alt = "Cryptid case file";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cryptid = await fetchCryptidBySlug(slug);

  const fontsDir = join(process.cwd(), "public", "fonts");
  const rokkittFont = await readFile(join(fontsDir, "rokkitt-700-latin.woff"));

  const name = cryptid?.name ?? "Unknown Cryptid";
  const location = cryptid?.location ?? "Appalachia";
  const dangerLevel = cryptid?.dangerLevel ?? "Unknown";
  const region = cryptid?.region ?? "";
  const firstDoc = cryptid?.firstDocumented ?? "";
  const caseNumber = `${slug.toUpperCase().slice(0, 3)}-${slug.length.toString().padStart(3, "0")}`;

  // Color palette from the site's light mode CSS variables
  const bg = "#f0ebe0"; // --background: 40 33% 94%
  const fg = "#3d2e1e"; // --foreground: 25 30% 20%
  const primary = "#2e6e4e"; // --primary: 152 35% 28%
  const muted = "#8a7a66"; // --muted-foreground: 25 15% 45%
  const border = "#c9bda8"; // --border: 35 25% 82%
  const dangerColors: Record<string, string> = {
    Low: "#2e6e4e",
    Medium: "#c47b2b",
    High: "#c43232",
  };
  const dangerColor = dangerColors[dangerLevel] ?? muted;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: bg,
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle paper texture grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #3d2e1e 1px, transparent 1px), radial-gradient(circle at 80% 70%, #3d2e1e 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top classification stripe */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: primary,
            height: "44px",
            width: "100%",
          }}
        >
          <span
            style={{
              color: "#f0ebe0",
              fontSize: "13px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}
          >
            Appalachian Cryptid Division — Department of Unexplained Phenomena
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "40px 56px 36px",
          }}
        >
          {/* Case file header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: muted,
                  fontWeight: 600,
                }}
              >
                Case File #{caseNumber}
              </span>
              {firstDoc && (
                <span
                  style={{
                    fontSize: "13px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: muted,
                  }}
                >
                  First Documented: {firstDoc}
                </span>
              )}
            </div>

            {/* Danger level badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: `3px solid ${dangerColor}`,
                borderRadius: "4px",
                padding: "6px 16px",
                transform: "rotate(-2deg)",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: dangerColor,
                  fontFamily: "Rokkitt",
                }}
              >
                Danger: {dangerLevel}
              </span>
            </div>
          </div>

          {/* Cryptid name */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderBottom: `2px dashed ${border}`,
              paddingBottom: "24px",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                fontSize: "72px",
                fontWeight: 700,
                color: fg,
                fontFamily: "Rokkitt",
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              {name}
            </span>
            <span
              style={{
                fontSize: "22px",
                color: muted,
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              {location}
              {region && ` — ${region} Region`}
            </span>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "auto",
            }}
          >
            <span
              style={{
                fontSize: "15px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: muted,
              }}
            >
              appalachiancryptid.com
            </span>
            <span
              style={{
                fontSize: "13px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: muted,
                opacity: 0.6,
              }}
            >
              For Official Use Only
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Rokkitt",
          data: rokkittFont,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
