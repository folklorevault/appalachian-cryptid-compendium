import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface IncidentLogProps {
  content: string;
  anomalyName: string;
  caseNumber?: string;
  station?: string;
  className?: string;
}

/**
 * Teletype-style incident log for anomaly case files.
 * Distinct from BureauMemo - feels like field transmission rather than office paperwork.
 */
export const IncidentLog = ({
  content,
  anomalyName,
  caseNumber,
  station = "FIELD STATION",
  className,
}: IncidentLogProps) => {
  // Generate a pseudo-random time based on case number for consistency
  const baseHour = caseNumber
    ? (caseNumber.charCodeAt(0) % 12) + 19 // 19:00 - 06:00 (night hours)
    : 21;

  // ⚡ Optimization: Pre-compute display formats in list rendering.
  // We parse the content and calculate the fake timestamp for each entry inside a useMemo
  // block so that we avoid performing expensive string allocations and math on every re-render.
  const processedEntries = useMemo(() => {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.map((entry, idx) => {
      const hour = (baseHour + Math.floor(idx / 4)) % 24;
      const minute = (idx * 7 + 13) % 60;
      const timestamp = `${hour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}`;
      return { text: entry.trim(), timestamp };
    });
  }, [content, baseHour]);

  return (
    <div className={cn("relative", className)}>
      {/* Teletype paper with perforated edges */}
      <div className="bg-bureau-paper border border-bureau-border rounded-none overflow-hidden shadow-md">
        {/* Perforated edge top */}
        <div className="h-4 bg-bureau-manila-light border-b border-dashed border-bureau-border flex items-center justify-between px-2">
          <div className="flex gap-1">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-bureau-border" />
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="p-4 font-typewriter text-xs leading-relaxed text-bureau-ink">
          {/* Header block */}
          <div className="border-b-2 border-double border-bureau-border pb-3 mb-4">
            <div className="text-center tracking-[0.3em] text-xs text-bureau-ink-muted">
              ══════════ INCIDENT LOG ══════════
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div>
                <span className="text-bureau-ink-muted">STATION:</span>{" "}
                <span className="tracking-wider">{station.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-bureau-ink-muted">CASE:</span>{" "}
                <span className="tracking-wider">{caseNumber || "PENDING"}</span>
              </div>
              <div>
                <span className="text-bureau-ink-muted">SUBJECT:</span>{" "}
                <span className="tracking-wider">{anomalyName.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-bureau-ink-muted">DATE:</span>{" "}
                <span className="tracking-wider">[REDACTED]</span>
              </div>
            </div>
          </div>

          {/* Log entries */}
          <div className="space-y-2">
            {processedEntries.map((entry, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="text-bureau-ink-muted shrink-0 tabular-nums">
                  {entry.timestamp} HRS -
                </span>
                <span className="uppercase tracking-wide">
                  {entry.text}
                </span>
              </div>
            ))}
          </div>

          {/* End transmission */}
          <div className="mt-6 pt-3 border-t-2 border-double border-bureau-border">
            <div className="text-center text-xs tracking-eyebrow text-bureau-ink-muted">
              ─── END TRANSMISSION ───
            </div>
            <div className="text-center text-xs mt-2 text-muted-foreground">
              CLASSIFICATION: RESTRICTED • RETAIN FOR RECORDS
            </div>
          </div>
        </div>

        {/* Perforated edge bottom */}
        <div className="h-4 bg-bureau-manila-light border-t border-dashed border-bureau-border flex items-center justify-between px-2">
          <div className="flex gap-1">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-bureau-border" />
            ))}
          </div>
        </div>
      </div>

      {/* Slight paper curl shadow */}
      <div
        className="absolute -bottom-1 left-4 right-4 h-2 bg-linear-to-b from-black/5 to-transparent rounded-full"
        aria-hidden="true"
      />
    </div>
  );
};
