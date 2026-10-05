import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getDangerLevelLabel } from "@/lib/caseUtils";
import type { AssessmentResult } from "@/lib/assessment";

export const OG_SIZE = { width: 1200, height: 630 };

// Satori can't read CSS variables, so these mirror the light-mode tokens in globals.css.
const c = {
  background: "#f5f1eb", // --background 40 33% 94%
  paper: "#f8f6f2", // --bureau-paper 40 30% 96%
  manila: "#ddceb0", // --bureau-manila 40 40% 78%
  ink: "#493527", // --bureau-ink 25 30% 22%
  inkMuted: "#745e4e", // --bureau-ink-muted 25 20% 38%
  foreground: "#423024", // --foreground 25 30% 20%
  border: "#cdbba2", // --bureau-border 35 30% 72%
  primary: "#2e6049", // --primary 152 35% 28%
  primaryFg: "#f8f6f1", // --primary-foreground 40 33% 96%
  stamp: "#683027", // --bureau-stamp 8 45% 28%
  secondary: "#eeded3", // --secondary 25 45% 88%
  accent: "#d18847", // --accent 28 60% 55%
  destructive: "#d22d2d", // --destructive 0 65% 50%
};

const dangerBadge = {
  Low: { bg: c.accent, fg: "#281d15" /* --bureau-ink-dark */ },
  Medium: { bg: c.secondary, fg: c.foreground },
  High: { bg: c.destructive, fg: c.primaryFg },
} as const;

async function loadFonts() {
  const dir = join(process.cwd(), "public", "fonts");
  const [rokkitt, specialElite] = await Promise.all([
    readFile(join(dir, "rokkitt-700-latin.woff")),
    readFile(join(dir, "specialelite-400-latin.woff")),
  ]);
  return [
    { name: "Rokkitt", data: rokkitt, style: "normal" as const, weight: 700 as const },
    { name: "Special Elite", data: specialElite, style: "normal" as const, weight: 400 as const },
  ];
}

async function inlinePhoto(url: string | null): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    // A missing photo shouldn't 500 the card; fall back to the redacted slot.
    return null;
  }
}

const typewriter = { fontFamily: "Special Elite", textTransform: "uppercase" as const };

function Stripe({ right }: { right: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: c.primary,
        color: c.primaryFg,
        height: 52,
        padding: "0 40px",
        fontSize: 18,
        letterSpacing: "0.2em",
        ...typewriter,
      }}
    >
      <span>Appalachian Cryptid Division</span>
      <span>{right}</span>
    </div>
  );
}

function Row({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: `2px dashed ${c.border}`,
        paddingBottom: 8,
        fontSize: 21,
        letterSpacing: "0.05em",
        ...typewriter,
      }}
    >
      <span style={{ color: c.inkMuted }}>{label}</span>
      <span style={{ display: "flex", color: valueColor ?? c.foreground }}>{value}</span>
    </div>
  );
}

/** Field Agent ID card for a quiz result. The agent number stays redacted: it's per-visitor. */
export async function renderAgentIdCard(result: AssessmentResult) {
  const [fonts, photo] = await Promise.all([loadFonts(), inlinePhoto(result.ogPhotoUrl)]);
  const badge = dangerBadge[result.dangerLevel];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: c.background, padding: 36 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: c.paper,
            border: `4px solid ${c.foreground}`,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: `6px 6px 0 rgba(66,48,36,0.2)`,
          }}
        >
          <Stripe right="Field Agent Identification" />

          <div style={{ flex: 1, display: "flex", padding: "30px 40px 0", gap: 40 }}>
            <div style={{ display: "flex", position: "relative", width: 280, height: 350 }}>
              <div
                style={{
                  display: "flex",
                  width: 280,
                  height: 350,
                  border: `4px solid ${c.foreground}`,
                  backgroundColor: c.manila,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {photo ? (
                   
                  <img src={photo} width={272} height={342} alt="" style={{ objectFit: "cover" }} />
                ) : (
                  <span style={{ color: c.inkMuted, fontSize: 18, letterSpacing: "0.15em", ...typewriter }}>
                    Photo redacted
                  </span>
                )}
              </div>
              <div
                style={{
                  position: "absolute",
                  right: -26,
                  bottom: -14,
                  display: "flex",
                  padding: "6px 16px",
                  border: `4px solid ${c.stamp}`,
                  borderRadius: 6,
                  color: c.stamp,
                  backgroundColor: "rgba(245,241,235,0.85)",
                  fontSize: 22,
                  letterSpacing: "0.16em",
                  transform: "rotate(-8deg)",
                  ...typewriter,
                }}
              >
                Assigned
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ color: c.inkMuted, fontSize: 20, letterSpacing: "0.2em", ...typewriter }}>
                Assigned entity
              </span>
              <span
                style={{
                  fontFamily: "Rokkitt",
                  fontSize: result.name.length > 16 ? 64 : 76,
                  lineHeight: 1,
                  color: c.foreground,
                  marginTop: 10,
                  letterSpacing: "-0.01em",
                }}
              >
                {result.name}
              </span>
              <span style={{ fontSize: 26, color: c.inkMuted, marginTop: 12, fontFamily: "Special Elite" }}>
                {result.scientificName}
              </span>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
                <Row
                  label="Agent No."
                  value={<span style={{ display: "flex", width: 110, height: 22, backgroundColor: c.foreground }} />}
                />
                <Row label="Classification" value={result.classification} valueColor={c.primary} />
                <Row label="Territory" value={result.territory.length > 30 ? result.territory.split(",")[0] : result.territory} />
                <Row
                  label="Danger level"
                  value={
                    <span style={{ display: "flex", padding: "2px 12px", borderRadius: 4, backgroundColor: badge.bg, color: badge.fg }}>
                      {getDangerLevelLabel(result.dangerLevel)}
                    </span>
                  }
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: `2px dashed ${c.border}`,
              padding: "14px 40px",
              color: c.inkMuted,
              fontSize: 18,
              letterSpacing: "0.15em",
              ...typewriter,
            }}
          >
            <span>Which Appalachian cryptid are you?</span>
            <span>appalachiancryptid.com</span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}

/** Landing card for the quiz itself. */
export async function renderAssessmentCard(names: string[]) {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: c.background, padding: 36 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: c.paper,
            border: `4px solid ${c.foreground}`,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: `6px 6px 0 rgba(66,48,36,0.2)`,
          }}
        >
          <Stripe right="Form ACD-41" />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 56px", gap: 22 }}>
            <span style={{ color: c.stamp, fontSize: 22, letterSpacing: "0.2em", ...typewriter }}>
              Field Agent Affinity Assessment
            </span>
            <span style={{ fontFamily: "Rokkitt", fontSize: 92, lineHeight: 1, color: c.foreground, letterSpacing: "-0.02em" }}>
              Which Appalachian cryptid are you?
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
              {names.map((n) => (
                <span
                  key={n}
                  style={{
                    display: "flex",
                    padding: "6px 14px",
                    border: `2px solid ${c.border}`,
                    borderRadius: 6,
                    backgroundColor: c.manila,
                    color: c.ink,
                    fontSize: 20,
                    letterSpacing: "0.1em",
                    ...typewriter,
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: `2px dashed ${c.border}`,
              padding: "14px 40px",
              color: c.inkMuted,
              fontSize: 18,
              letterSpacing: "0.15em",
              ...typewriter,
            }}
          >
            <span>Seven questions. Results are binding.</span>
            <span>appalachiancryptid.com</span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
