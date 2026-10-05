"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { AssessmentResultPanel } from "@/components/bureau/AssessmentResultPanel";
import type { AssessmentResults } from "@/lib/assessment";
import {
  ASSESSMENT_PATH,
  QUESTIONS,
  agentNumber,
  resultPath,
  scoreAnswers,
} from "@/data/assessment";

type Screen = "intro" | "question" | "result";

const LETTERS = "ABCD";
const eyebrow = "font-typewriter text-xs uppercase tracking-eyebrow";

function formatIssued(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}.${dd}.${d.getFullYear()}`;
}

export function AffinityAssessment({ results }: { results: AssessmentResults }) {
  const [screen, setScreen] = useState<Screen>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [issued, setIssued] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Move focus to the new heading on every screen/question change so keyboard
  // and screen reader users land on the question, not at the end of the page.
  useEffect(() => {
    if (screen === "intro") return;
    const target = screen === "result" ? document.getElementById("acd-result") : headingRef.current;
    target?.focus({ preventScroll: true });
    topRef.current?.scrollIntoView({ block: "start" });
  }, [screen, step]);

  const start = () => {
    setAnswers([]);
    setStep(0);
    setScreen("question");
  };

  const pick = (optionIndex: number) => {
    const next = answers.slice(0, step);
    next[step] = optionIndex;
    setAnswers(next);

    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
      return;
    }

    const { key } = scoreAnswers(next);
    setIssued(formatIssued(new Date()));
    setScreen("result");
    analytics.trackEvent("assessment_complete", { result: key });
    // Point the address bar at the shareable result page without a navigation,
    // so a copied link unfurls with this cryptid's card.
    window.history.replaceState(null, "", resultPath(results[key].slug));
  };

  const retake = () => {
    window.history.replaceState(null, "", ASSESSMENT_PATH);
    setAnswers([]);
    setStep(0);
    setScreen("intro");
  };

  const current = QUESTIONS[step];

  return (
    <div ref={topRef} className="scroll-mt-24">
      {screen === "intro" && (
        <section className="flex flex-col items-start gap-6">
          <span className="drawer-chip">ACD-41 · Field Agent Affinity Assessment</span>
          <h1 className="font-display text-hero font-bold leading-tight text-foreground">
            Which Appalachian cryptid are you?
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Every new field agent is matched with the entity they most resemble. It&rsquo;s for your own
            protection. Seven questions. Answer honestly. The Bureau can tell.
          </p>
          <div className="memo-paper memo-flat relative w-full py-6 pl-11 pr-6">
            <span className="hole-punch top-6" aria-hidden="true" />
            <span className="hole-punch bottom-6" aria-hidden="true" />
            <h2 className={`${eyebrow} relative z-10 mb-2 text-bureau-stamp-ink`}>Notice to applicant</h2>
            <p className="relative z-10 font-typewriter text-base leading-relaxed text-foreground">
              Six entities are currently accepting matches: Mothman, Not Deer, Tailypo, the Flatwoods Monster,
              Sheepsquatch, and the Grafton Monster. Applicants may not request a different entity. Applicants may
              retake the assessment.
            </p>
          </div>
          <Button size="lg" onClick={start} className="text-base">
            Begin assessment
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </section>
      )}

      {screen === "question" && current && (
        <section aria-labelledby="acd-q" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <div className={`${eyebrow} flex justify-between gap-3 text-bureau-ink-muted`}>
              <span>
                Question {step + 1} of {QUESTIONS.length}
              </span>
              <span className="hidden sm:inline">Form ACD-41, Rev. 06/1971</span>
            </div>
            <div aria-hidden="true" className="grid grid-cols-7 gap-1.5">
              {QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-sm",
                    i < step ? "bg-primary" : i === step ? "bg-accent" : "bg-border",
                  )}
                />
              ))}
            </div>
          </div>

          <h2
            id="acd-q"
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground outline-none sm:text-4xl"
          >
            {current.q}
          </h2>

          <div className="flex flex-col gap-3">
            {current.options.map((opt, i) => (
              <button
                key={opt.text}
                type="button"
                onClick={() => pick(i)}
                aria-pressed={answers[step] === i}
                className={cn(
                  "flex min-h-14 w-full items-center gap-4 rounded-sm border-2 border-foreground/60 bg-card px-4 py-3.5 text-left text-lg leading-snug text-foreground shadow-offset",
                  "transition-[box-shadow,transform,border-color] duration-200 ease-out",
                  "hover:-translate-y-0.5 hover:border-primary hover:shadow-offset-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  answers[step] === i && "border-primary",
                )}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-bureau-border bg-bureau-manila font-typewriter text-base text-bureau-ink"
                >
                  {LETTERS[i]}
                </span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>

          {step > 0 && (
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              className="min-h-11 self-start px-1 font-typewriter text-sm uppercase tracking-type text-bureau-ink-muted"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Previous question
            </Button>
          )}
        </section>
      )}

      {screen === "result" && (() => {
        const { key, matchPct } = scoreAnswers(answers);
        return (
          <AssessmentResultPanel
            result={results[key]}
            agentNo={agentNumber(answers)}
            matchPct={matchPct}
            issued={issued}
            onRetake={retake}
          />
        );
      })()}
    </div>
  );
}
