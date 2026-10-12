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
  // Editors write transmissions as a header (STATION:/SUBJECT:), timestamped
  // lines ("2243 HRS — …") and a closing "[CASE STATUS: …]". Pull those apart
  // so the slip shows each line's own time once, not a generated one on top.
  const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
  let stationLine: string | undefined;
  let statusLine: string | undefined;
  const entries: { time?: string; text: string }[] = [];
  for (const line of lines) {
    const header = line.match(/^(STATION|SUBJECT):\s*(.*)$/i);
    if (header) {
      if (header[1].toUpperCase() === "STATION") stationLine = header[2];
      continue;
    }
    const status = line.match(/^\[(.*)\]$/);
    if (status) {
      statusLine = status[1];
      continue;
    }
    const timed = line.match(/^(\d{4})\s*HRS\s*[—–-]\s*(.*)$/i);
    entries.push(timed ? { time: timed[1], text: timed[2] } : { text: line });
  }

  return (
    <div className={cn("relative", className)}>
      {/* Teletype paper with perforated edges */}
      <div className="bg-bureau-paper border border-bureau-border rounded-none overflow-hidden shadow-md">
        {/* Perforated edge top */}
        <div className="h-4 bg-bureau-manila-light border-b border-dashed border-bureau-border flex items-center justify-between px-2" aria-hidden="true">
          <div className="flex gap-1">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-bureau-border" />
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="p-4 font-typewriter text-sm leading-relaxed text-bureau-ink">
          {/* Header block */}
          <div className="border-b-2 border-double border-bureau-border pb-3 mb-4">
            <div className="flex items-center gap-3 tracking-eyebrow text-xs text-bureau-ink-muted">
              <span className="flex-1 border-t-4 border-double border-bureau-border" aria-hidden="true" />
              INCIDENT LOG
              <span className="flex-1 border-t-4 border-double border-bureau-border" aria-hidden="true" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div>
                <span className="text-bureau-ink-muted">STATION:</span>{" "}
                <span className="tracking-type">{(stationLine ?? station).toUpperCase()}</span>
              </div>
              <div>
                <span className="text-bureau-ink-muted">CASE:</span>{" "}
                <span className="tracking-type">{caseNumber || "PENDING"}</span>
              </div>
              <div>
                <span className="text-bureau-ink-muted">SUBJECT:</span>{" "}
                <span className="tracking-type">{anomalyName.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-bureau-ink-muted">DATE:</span>{" "}
                <span className="tracking-type">[REDACTED]</span>
              </div>
            </div>
          </div>

          {/* Log entries */}
          <div className="space-y-2">
            {/* Only the editor's own times are printed; untimed lines run plain. */}
            {entries.map((entry, idx) => (
              <div key={idx} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                {entry.time && (
                  <span className="text-bureau-ink-muted shrink-0 tabular-nums">
                    {entry.time} HRS -
                  </span>
                )}
                <span className="uppercase tracking-type">{entry.text}</span>
              </div>
            ))}
          </div>

          {/* End transmission */}
          <div className="mt-6 pt-3 border-t-2 border-double border-bureau-border">
            <div className="flex items-center justify-center gap-3 text-xs tracking-eyebrow text-bureau-ink-muted">
              <span className="w-8 border-t border-bureau-border" aria-hidden="true" />
              END TRANSMISSION
              <span className="w-8 border-t border-bureau-border" aria-hidden="true" />
            </div>
            <div className="text-center text-xs mt-2 text-muted-foreground">
              {statusLine ? statusLine.toUpperCase() : "CLASSIFICATION: RESTRICTED • RETAIN FOR RECORDS"}
            </div>
          </div>
        </div>

        {/* Perforated edge bottom */}
        <div className="h-4 bg-bureau-manila-light border-t border-dashed border-bureau-border flex items-center justify-between px-2" aria-hidden="true">
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
