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
  // Parse content into log entries if it contains newlines
  const entries = content.split('\n').filter(line => line.trim());

  // Generate a pseudo-random time based on case number for consistency
  const baseHour = caseNumber
    ? (caseNumber.charCodeAt(0) % 12) + 19 // 19:00 - 06:00 (night hours)
    : 21;

  return (
    <div className={cn("relative", className)}>
      {/* Teletype paper with perforated edges */}
      <div className="bg-[#f8f6e8] border border-[#d4c89a] rounded-none overflow-hidden shadow-md">
        {/* Perforated edge top */}
        <div className="h-4 bg-[#f0ead6] border-b border-dashed border-[#c4b87a] flex items-center justify-between px-2">
          <div className="flex gap-1">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#d4c89a]" />
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="p-4 font-typewriter text-[11px] leading-relaxed text-[#2a2a2a]">
          {/* Header block */}
          <div className="border-b-2 border-double border-[#8b7355] pb-3 mb-4">
            <div className="text-center tracking-[0.3em] text-[10px] text-[#5a4a3a]">
              ══════════ INCIDENT LOG ══════════
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
              <div>
                <span className="text-[#7a6a5a]">STATION:</span>{" "}
                <span className="tracking-wider">{station.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-[#7a6a5a]">CASE:</span>{" "}
                <span className="tracking-wider">{caseNumber || "PENDING"}</span>
              </div>
              <div>
                <span className="text-[#7a6a5a]">SUBJECT:</span>{" "}
                <span className="tracking-wider">{anomalyName.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-[#7a6a5a]">DATE:</span>{" "}
                <span className="tracking-wider">[REDACTED]</span>
              </div>
            </div>
          </div>

          {/* Log entries */}
          <div className="space-y-2">
            {entries.map((entry, idx) => {
              // Calculate fake timestamp for each entry
              const hour = (baseHour + Math.floor(idx / 4)) % 24;
              const minute = (idx * 7 + 13) % 60;
              const timestamp = `${hour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}`;

              return (
                <div key={idx} className="flex gap-3">
                  <span className="text-[#7a6a5a] flex-shrink-0 tabular-nums">
                    {timestamp} HRS -
                  </span>
                  <span className="uppercase tracking-wide">
                    {entry.trim()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* End transmission */}
          <div className="mt-6 pt-3 border-t-2 border-double border-[#8b7355]">
            <div className="text-center text-[10px] tracking-[0.2em] text-[#7a6a5a]">
              ─── END TRANSMISSION ───
            </div>
            <div className="text-center text-[9px] mt-2 text-[#9a8a7a]">
              CLASSIFICATION: RESTRICTED • RETAIN FOR RECORDS
            </div>
          </div>
        </div>

        {/* Perforated edge bottom */}
        <div className="h-4 bg-[#f0ead6] border-t border-dashed border-[#c4b87a] flex items-center justify-between px-2">
          <div className="flex gap-1">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#d4c89a]" />
            ))}
          </div>
        </div>
      </div>

      {/* Slight paper curl shadow */}
      <div
        className="absolute -bottom-1 left-4 right-4 h-2 bg-gradient-to-b from-black/5 to-transparent rounded-full"
        aria-hidden="true"
      />
    </div>
  );
};
