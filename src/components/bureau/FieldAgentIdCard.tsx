import Image from "next/image";
import { CameraOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDangerLevelColor, getDangerLevelLabel } from "@/lib/caseUtils";
import type { AssessmentResult } from "@/lib/assessment";

interface FieldAgentIdCardProps {
  result: AssessmentResult;
  headingId: string;
  /** Present only after the visitor takes the quiz; a direct visit shows a redaction bar. */
  agentNo?: string;
  matchPct?: number;
  issued?: string;
}

const Redacted = () => (
  <>
    <span aria-hidden="true" className="inline-block h-[0.9em] w-16 translate-y-[0.1em] bg-foreground" />
    <span className="sr-only">Redacted</span>
  </>
);

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-baseline gap-3 border-b border-dotted border-bureau-border pb-1.5">
    <dt className="shrink-0 text-bureau-ink-muted">{label}</dt>
    <dd className="ml-auto text-right text-foreground">{children}</dd>
  </div>
);

export function FieldAgentIdCard({ result, headingId, agentNo, matchPct, issued }: FieldAgentIdCardProps) {
  return (
    <article
      aria-labelledby={headingId}
      className="memo-paper memo-flat overflow-hidden rounded-lg border-2 border-foreground/60"
    >
      <div className="flex items-center justify-between gap-3 bg-primary px-4 py-2 font-typewriter text-[10px] uppercase tracking-eyebrow text-primary-foreground/85">
        <span>Appalachian Cryptid Division</span>
        <span className="hidden sm:inline">Field Agent Identification</span>
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:p-7">
        <div className="relative mx-auto w-40 sm:mx-0 sm:w-full">
          <div className="relative aspect-[4/5] overflow-hidden border-2 border-foreground/60 bg-muted">
            {result.photoUrl ? (
              <Image
                src={result.photoUrl}
                alt={`Bureau file photo of ${result.name}`}
                fill
                sizes="(max-width: 640px) 160px, 176px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center font-typewriter text-[10px] uppercase tracking-label text-bureau-ink-muted">
                <CameraOff className="h-7 w-7" aria-hidden="true" />
                Photo unavailable
                <br />
                Evidence redacted
              </div>
            )}
          </div>
          <span aria-hidden="true" className="classification-stamp absolute -bottom-3 -right-4">
            Assigned
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <p className="font-typewriter text-xs uppercase tracking-eyebrow text-bureau-ink-muted">Assigned entity</p>
          <h2 id={headingId} tabIndex={-1} className="outline-none font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            {result.name}
          </h2>
          <p className="font-serif text-lg italic text-bureau-ink-muted">{result.scientificName}</p>

          <dl className="mt-3 flex flex-col gap-2 font-typewriter text-xs uppercase tracking-type sm:text-sm">
            <Row label="Agent No.">{agentNo ? `AGT-${agentNo}` : <Redacted />}</Row>
            <Row label="Classification">
              <span className="text-primary">{result.classification}</span>
            </Row>
            <Row label="Danger level">
              <span
                className={cn(
                  "inline-block rounded-sm px-2.5 py-0.5",
                  getDangerLevelColor(result.dangerLevel),
                  // Cream on ochre fails contrast at this size; the design inks Low in dark brown.
                  result.dangerLevel === "Low" && "text-bureau-ink-dark",
                )}
              >
                {getDangerLevelLabel(result.dangerLevel)}
              </span>
            </Row>
            <Row label="Territory">{result.territory}</Row>
            {matchPct !== undefined && <Row label="Match strength">{matchPct}%</Row>}
          </dl>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-dashed border-bureau-border px-5 py-3 font-typewriter text-[10px] uppercase tracking-label text-bureau-ink-muted sm:px-7">
        <span>
          File {result.fileNo}
          {issued && ` · Issued ${issued}`}
        </span>
        <span>Form ACD-41 · appalachiancryptid.com</span>
      </div>
    </article>
  );
}
