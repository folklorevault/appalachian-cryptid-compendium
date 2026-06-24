import Link from "next/link";
import { fetchMapCryptids } from "@/lib/sanity/fetchers";
import {
  APPALACHIAN_STATES,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  projectCoordinate,
} from "@/data/appalachian-borders";

const dangerFill: Record<string, string> = {
  High: "hsl(8 65% 38%)",
  Medium: "hsl(35 70% 42%)",
  Low: "hsl(152 35% 32%)",
};

const TICK_COUNT_X = 10;
const TICK_COUNT_Y = 6;

export async function SightingsMapTeaser() {
  const cryptids = await fetchMapCryptids();
  const plotted = cryptids
    .filter((c) => c.coordinates)
    .map((c) => {
      const [x, y] = projectCoordinate(
        c.coordinates.lng,
        c.coordinates.lat
      );
      return { ...c, x, y };
    })
    .filter(
      (c) =>
        c.x >= 0 && c.x <= VIEWBOX_WIDTH && c.y >= 0 && c.y <= VIEWBOX_HEIGHT
    );

  return (
    <section
      className="border-b border-border bg-bureau-manila/40 paper-texture"
      aria-label="Sightings map teaser"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-10">
        <div className="text-center mb-4">
          <p className="font-typewriter text-[10px] tracking-eyebrow uppercase text-muted-foreground mb-1">
            Bureau Sighting Grid — Field Survey {new Date().getFullYear()}
          </p>
          <h2 className="font-display font-bold text-xl text-foreground">
            Reported Across the Region
          </h2>
        </div>

        <div
          className="relative mx-auto w-full max-w-[560px] rounded-md bg-bureau-ink p-2.5 shadow-[0_8px_24px_-8px_hsl(var(--bureau-ink)/0.55),0_2px_0_0_hsl(var(--bureau-ink))]"
        >
          <div className="relative overflow-hidden rounded-sm bg-bureau-manila-light/70 ring-1 ring-bureau-ink/30">
          <svg
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={`${plotted.length} reported cryptid locations across eight Appalachian states`}
            className="block w-full h-auto"
          >
            <defs>
              <pattern
                id="sighting-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="hsl(var(--bureau-ink))"
                  strokeOpacity="0.08"
                  strokeWidth="1"
                />
              </pattern>
              <pattern
                id="sighting-grid-fine"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="0"
                  cy="0"
                  r="0.6"
                  fill="hsl(var(--bureau-ink))"
                  fillOpacity="0.12"
                />
              </pattern>
            </defs>

            <rect
              width={VIEWBOX_WIDTH}
              height={VIEWBOX_HEIGHT}
              fill="url(#sighting-grid-fine)"
            />
            <rect
              width={VIEWBOX_WIDTH}
              height={VIEWBOX_HEIGHT}
              fill="url(#sighting-grid)"
            />

            <g
              stroke="hsl(var(--bureau-ink))"
              strokeOpacity="0.18"
              strokeWidth="1"
            >
              {Array.from({ length: TICK_COUNT_X + 1 }, (_, i) => {
                const x = (i / TICK_COUNT_X) * VIEWBOX_WIDTH;
                return (
                  <line
                    key={`tx-${i}`}
                    x1={x}
                    x2={x}
                    y1={VIEWBOX_HEIGHT - 8}
                    y2={VIEWBOX_HEIGHT}
                  />
                );
              })}
              {Array.from({ length: TICK_COUNT_Y + 1 }, (_, i) => {
                const y = (i / TICK_COUNT_Y) * VIEWBOX_HEIGHT;
                return (
                  <line key={`ty-${i}`} x1={0} x2={8} y1={y} y2={y} />
                );
              })}
            </g>

            <g
              fill="none"
              stroke="hsl(var(--bureau-stamp))"
              strokeOpacity="0.55"
              strokeWidth="1.4"
              strokeDasharray="4 3"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              {APPALACHIAN_STATES.map((s) => (
                <path key={s.fips} d={s.d} />
              ))}
            </g>

            <g>
              {APPALACHIAN_STATES.map((s) => {
                const cx = labelPosition(s.code).x;
                const cy = labelPosition(s.code).y;
                return (
                  <text
                    key={`label-${s.fips}`}
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    fontFamily="'Special Elite', monospace"
                    fontSize="14"
                    fill="hsl(var(--bureau-ink))"
                    fillOpacity="0.45"
                    letterSpacing="2"
                  >
                    {s.code}
                  </text>
                );
              })}
            </g>

            <g>
              {plotted.map((c) => (
                <g key={c._id}>
                  <line
                    x1={c.x - 7}
                    x2={c.x + 7}
                    y1={c.y}
                    y2={c.y}
                    stroke="hsl(var(--bureau-ink))"
                    strokeOpacity="0.4"
                    strokeWidth="0.8"
                  />
                  <line
                    x1={c.x}
                    x2={c.x}
                    y1={c.y - 7}
                    y2={c.y + 7}
                    stroke="hsl(var(--bureau-ink))"
                    strokeOpacity="0.4"
                    strokeWidth="0.8"
                  />
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="4.2"
                    fill={dangerFill[c.dangerLevel] ?? dangerFill.Low}
                    stroke="hsl(var(--bureau-manila-light))"
                    strokeWidth="1.2"
                  />
                </g>
              ))}
            </g>

            <g
              transform={`translate(${VIEWBOX_WIDTH - 30} 60) rotate(-12)`}
              opacity="0.55"
            >
              <rect
                x={-180}
                y={-30}
                width={180}
                height={56}
                fill="none"
                stroke="hsl(var(--bureau-stamp))"
                strokeWidth="3"
                strokeDasharray="2 2"
              />
              <text
                x={-90}
                y={-8}
                textAnchor="middle"
                fontFamily="'Special Elite', monospace"
                fontSize="13"
                fontWeight="700"
                fill="hsl(var(--bureau-stamp))"
                letterSpacing="3"
              >
                CLASSIFIED
              </text>
              <text
                x={-90}
                y={14}
                textAnchor="middle"
                fontFamily="'Special Elite', monospace"
                fontSize="9"
                fill="hsl(var(--bureau-stamp))"
                letterSpacing="2"
              >
                SIGHTING GRID
              </text>
            </g>
          </svg>

          <div className="absolute top-2 left-3 font-typewriter text-[9px] tracking-eyebrow uppercase text-bureau-ink/50 pointer-events-none">
            Lat 40°N
          </div>
          <div className="absolute bottom-2 left-3 font-typewriter text-[9px] tracking-eyebrow uppercase text-bureau-ink/50 pointer-events-none">
            Lat 30°N
          </div>
          <div className="absolute bottom-2 right-3 font-typewriter text-[9px] tracking-eyebrow uppercase text-bureau-ink/50 pointer-events-none">
            Lng 75°W
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-typewriter text-[9px] tracking-eyebrow uppercase text-bureau-ink/50 pointer-events-none">
            Plot No. {plotted.length.toString().padStart(3, "0")}
          </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 max-w-[560px] mx-auto">
          <div className="flex justify-center sm:justify-start gap-3 font-typewriter text-[10px] tracking-label uppercase text-muted-foreground">
            <LegendDot label="High" color={dangerFill.High} />
            <LegendDot label="Medium" color={dangerFill.Medium} />
            <LegendDot label="Low" color={dangerFill.Low} />
          </div>

          <Link
            href="/map"
            className="self-center sm:self-auto font-display font-bold uppercase tracking-widest text-[11px] text-bureau-stamp border-[3px] border-bureau-stamp rounded-sm bg-bureau-manila/85 px-4 py-2 shadow-[inset_0_0_0_2px_hsl(var(--bureau-stamp))] hover:bg-bureau-stamp/10 transition-colors"
          >
            Open Full Map →
          </Link>
        </div>
      </div>
    </section>
  );
}

function LegendDot({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full border border-bureau-ink/30"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {label} Risk
    </span>
  );
}

function labelPosition(code: string): { x: number; y: number } {
  const centroids: Record<string, [number, number]> = {
    AL: [-86.8, 32.8],
    GA: [-83.4, 32.8],
    KY: [-85.0, 37.6],
    NC: [-79.5, 35.5],
    SC: [-80.9, 34.0],
    TN: [-86.0, 35.9],
    VA: [-78.9, 37.7],
    WV: [-80.7, 38.7],
  };
  const c = centroids[code];
  if (!c) return { x: 0, y: 0 };
  const [x, y] = projectCoordinate(c[0], c[1]);
  return { x, y };
}
