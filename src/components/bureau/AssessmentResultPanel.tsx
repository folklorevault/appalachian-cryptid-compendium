import Link from "next/link";
import { FolderOpen, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { FieldAgentIdCard } from "@/components/bureau/FieldAgentIdCard";
import { CopyButton } from "@/components/bureau/CopyButton";
import { getDangerLevelLabel } from "@/lib/caseUtils";
import type { AssessmentResult } from "@/lib/assessment";
import { RESULTS, SITE_URL, WITNESS_FORM_PATH, resultPath } from "@/data/assessment";

interface AssessmentResultPanelProps {
  result: AssessmentResult;
  /** Personal fields, only known right after the visitor finishes the quiz. */
  agentNo?: string;
  matchPct?: number;
  issued?: string;
  /** Quiz flow only; the static result page has its own "Take the assessment" CTA. */
  onRetake?: () => void;
}

const eyebrow = "font-typewriter text-xs uppercase tracking-eyebrow";

export function AssessmentResultPanel({ result, agentNo, matchPct, issued, onRetake }: AssessmentResultPanelProps) {
  const partner = RESULTS[result.partner];
  const shareUrl = `${SITE_URL}${resultPath(result.slug)}`;
  const copyText = [
    `Form ACD-41 has matched me with ${result.name} (${result.scientificName}).`,
    `Classification: ${result.classification} · Danger level: ${getDangerLevelLabel(result.dangerLevel)}`,
    "",
    result.assessment,
    "",
    `Find out which Appalachian cryptid you are: ${shareUrl}`,
  ].join("\n");

  return (
    <section aria-labelledby="acd-result" className="flex flex-col gap-8">
      <p className={`${eyebrow} text-bureau-ink-muted`}>
        {onRetake ? "Assessment complete · Applicant has been matched" : "Form ACD-41 · Assessment result on file"}
      </p>

      <FieldAgentIdCard result={result} headingId="acd-result" agentNo={agentNo} matchPct={matchPct} issued={issued} />

      <div className="memo-paper memo-flat flex flex-col gap-6 rounded-sm px-6 py-6 sm:px-8">
        {/* The assessment is the Bureau's dry file voice; the lesson is the heart of the result, so it reads loudest. */}
        <div className="relative z-10 flex flex-col gap-2">
          <h3 className={`${eyebrow} text-bureau-ink-muted`}>Bureau assessment</h3>
          <p className="font-typewriter text-sm leading-relaxed text-bureau-ink-muted sm:text-base">{result.assessment}</p>
        </div>
        {/* A torn-off slip clipped to the file: the cryptid's own advice, set apart from the Bureau's paperwork.
            The clip and shadow live on the wrapper so the torn-edge mask doesn't cut them off. */}
        <div className="relative z-10 mx-auto mt-4 mb-2 w-full max-w-xl -rotate-1 drop-shadow-md motion-reduce:rotate-0 dark:brightness-90">
          <div className="paper-clip" aria-hidden="true" />
          <figure className="torn-slip rounded-t-sm bg-bureau-manila-light px-6 pt-8 pb-9 sm:px-8">
            <figcaption className={`${eyebrow} text-bureau-stamp`}>A lesson from {result.name}</figcaption>
            <blockquote className="mt-3 text-xl leading-relaxed text-bureau-ink-dark sm:text-2xl sm:leading-snug">{result.note}</blockquote>
          </figure>
        </div>
        <p className="relative z-10 border-t border-dashed border-bureau-border pt-4 text-base leading-relaxed text-bureau-ink-muted">
          <span className={`${eyebrow} mr-2 text-bureau-ink dark:text-foreground`}>Works well with</span>
          <Link
            href={resultPath(partner.slug)}
            className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
          >
            {partner.name}
          </Link>
          . {result.partnerLine}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild size="lg" className="text-base">
          <Link href={`/cryptid/${result.slug}`}>
            <FolderOpen className="h-4 w-4" aria-hidden="true" />
            Read your full case file
          </Link>
        </Button>
        <CopyButton
          text={copyText}
          label="Copy my result"
          failLabel="Copy blocked: try a screenshot"
          event="result_copied"
          className="border border-bureau-border bg-transparent shadow-none! hover:bg-bureau-manila/40"
        />
        {onRetake && (
          <Button variant="link" size="lg" onClick={onRetake} className="px-1 font-typewriter text-sm uppercase tracking-type text-bureau-ink-muted underline">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Retake assessment
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-8">
        <h3 className="font-display text-xl font-bold text-foreground">Receive your field briefings</h3>
        <p className="text-base leading-relaxed text-muted-foreground">
          New agents get an email when the Bureau opens a new case file. No more than that.
        </p>
        {/* The compact signup centers itself; this page reads left-aligned. */}
        <div className="[&>div]:mx-0">
          <NewsletterSignup variant="compact" />
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Seen something yourself?{" "}
        <Link href={WITNESS_FORM_PATH} className="text-primary underline underline-offset-4">
          File a supplemental witness statement
        </Link>{" "}
        on Form ACD-27B.
      </p>
    </section>
  );
}
