"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, MapPin, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";
import { getDangerLevelColor } from "@/lib/caseUtils";
import { Button } from "@/components/ui/button";
import { Stamp } from "@/components/Stamp";
import { CopyButton } from "@/components/bureau/CopyButton";
import {
  WITNESS_FIELDS,
  emptyWitnessValues,
  fileStatement,
  randomWitnessValues,
  type Advisory,
  type WitnessFieldKey,
  type WitnessValues,
} from "@/data/witness-form";

const eyebrow = "font-typewriter text-xs uppercase tracking-eyebrow";
const rustStamp = "border-bureau-stamp-ink text-bureau-stamp-ink";

// Reuse the site's danger-level badge colors; "Unquantified" has no level.
const ADVISORY_LEVEL: Partial<Record<Advisory, "High" | "Medium" | "Low">> = {
  Elevated: "High",
  Moderate: "Medium",
  Low: "Low",
};

function AdvisoryBadge({ advisory }: { advisory: Advisory }) {
  const level = ADVISORY_LEVEL[advisory];
  return (
    <span
      className={cn(
        "inline-block rounded-sm px-2.5 py-0.5",
        level ? getDangerLevelColor(level) : "bg-muted text-foreground",
        // Cream on ochre fails contrast at this size.
        level === "Low" && "text-bureau-ink-dark",
      )}
    >
      {advisory}
    </span>
  );
}

const HolePunches = () => (
  <>
    <span className="hole-punch top-7" aria-hidden="true" />
    <span className="hole-punch top-1/2" aria-hidden="true" />
    <span className="hole-punch bottom-7" aria-hidden="true" />
  </>
);

export function WitnessStatementForm() {
  const [values, setValues] = useState<WitnessValues>(emptyWitnessValues);
  const [filedAt, setFiledAt] = useState<Date | null>(null);
  const statementHeading = useRef<HTMLHeadingElement>(null);

  const statement = useMemo(() => (filedAt ? fileStatement(values, filedAt) : null), [values, filedAt]);

  useEffect(() => {
    if (!filedAt) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    statementHeading.current?.focus({ preventScroll: true });
  }, [filedAt]);

  const setField = (key: WitnessFieldKey, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const file = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    setFiledAt(now);
    analytics.trackEvent("statement_filed", { redactions: fileStatement(values, now).redactions });
  };

  if (statement) {
    return (
      <section className="flex flex-col items-center gap-10">
        <article
          aria-labelledby="statement-title"
          className="memo-paper memo-flat relative flex w-full max-w-[52rem] flex-col gap-6 py-10 pl-14 pr-6 sm:pl-16 sm:pr-10"
        >
          <HolePunches />
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-1.5">
              <p className={`${eyebrow} text-bureau-ink-muted`}>
                Department of Unexplained Phenomena · Field Office No. 7
              </p>
              <h2
                id="statement-title"
                ref={statementHeading}
                tabIndex={-1}
                className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground outline-none sm:text-4xl"
              >
                Witness Statement, as Received
              </h2>
            </div>
            <Stamp text={`Received ${statement.receivedDate}`} rotation={-5} className={cn(rustStamp, "mr-2 mt-2")} />
          </div>

          <dl className="relative z-10 grid gap-x-8 gap-y-3 font-typewriter text-xs uppercase tracking-type sm:grid-cols-2 sm:text-sm">
            {[
              ["Case No.", statement.caseNo],
              ["Jurisdiction", statement.jurisdiction],
              ["Classification", <span key="c" className="text-primary">{statement.classification}</span>],
              ["Advisory", <AdvisoryBadge key="a" advisory={statement.advisory} />],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-baseline gap-3 border-b border-dotted border-bureau-border pb-1.5">
                <dt className="text-bureau-ink-muted">{label}</dt>
                <dd className="ml-auto text-right text-foreground">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="relative z-10 font-typewriter text-lg leading-loose text-foreground">
            {statement.segments.map((seg, i) =>
              seg.kind === "text" ? (
                <span key={i}>{seg.text}</span>
              ) : seg.kind === "answer" ? (
                <span key={i} className="border-b-2 border-accent px-0.5 text-primary">
                  {seg.text}
                </span>
              ) : (
                <span key={i}>
                  <span aria-hidden="true" className="select-none rounded-[1px] bg-foreground px-1 text-foreground">
                    ███████
                  </span>
                  <span className="sr-only">redacted</span>
                </span>
              ),
            )}
          </p>

          <div className="relative z-10 flex flex-col gap-1.5 rounded-sm border border-bureau-border bg-bureau-manila/30 px-5 py-4">
            <h3 className={`${eyebrow} text-bureau-stamp-ink`}>Bureau determination</h3>
            <p className="text-base leading-relaxed text-foreground">{statement.determination}</p>
          </div>

          <p className={`${eyebrow} relative z-10 border-t border-dashed border-bureau-border pt-4 tracking-type text-bureau-ink-muted`}>
            Statement {statement.redactionNote} · Filed under ACD-27B · Distribution restricted
          </p>
        </article>

        <div className="flex w-full max-w-[52rem] flex-wrap items-center justify-center gap-8">
          <figure
            aria-label="Shareable case card"
            className="flex aspect-square w-full max-w-[25rem] flex-col overflow-hidden rounded-sm border-2 border-foreground/80 bg-card shadow-offset-hover"
          >
            <div className="bg-primary px-3 py-2 text-center font-typewriter text-[10px] uppercase tracking-eyebrow text-primary-foreground/85">
              Sighting on record ◆ Field Office No. 7
            </div>
            <div className="flex flex-1 flex-col gap-3.5 px-7 py-6">
              <span className={`${eyebrow} tracking-type text-bureau-ink-muted`}>
                {statement.caseNo} · {statement.jurisdiction}
              </span>
              <p className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground">{statement.shareQuote}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{statement.shareLine}</p>
              <Stamp text={statement.classification} rotation={-5} className={cn(rustStamp, "mt-auto self-end")} />
            </div>
            <figcaption className="flex justify-between gap-2 border-t border-dashed border-bureau-border px-4 py-2.5 font-typewriter text-[10px] uppercase tracking-label text-bureau-ink-muted">
              <span>Form ACD-27B</span>
              <span>appalachiancryptid.com</span>
            </figcaption>
          </figure>

          <div className="flex min-w-[16rem] flex-1 flex-col items-start gap-3">
            <h3 className={`${eyebrow} text-bureau-stamp-ink`}>For public release</h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              The Bureau has approved this card for distribution. Screenshot it, or copy the full statement to share
              with whoever was in the truck with you.
            </p>
            <CopyButton
              text={statement.plainText}
              label="Copy full statement"
              failLabel="Copy blocked: select the statement above"
              event="statement_copied"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" size="lg" onClick={() => setFiledAt(null)} className="border-primary text-base text-primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Amend statement
          </Button>
          <Button
            size="lg"
            className="text-base"
            onClick={() => {
              setValues(emptyWitnessValues());
              setFiledAt(null);
            }}
          >
            File another sighting
          </Button>
          <Button asChild variant="link" size="lg" className="text-base">
            <Link href="/map">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              See the official sightings map
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <form
        onSubmit={file}
        className="flex flex-col rounded-sm border-2 border-foreground/70 bg-card shadow-offset"
        aria-label="Supplemental witness statement"
      >
        <div className={`${eyebrow} flex flex-wrap justify-between gap-2 border-b-2 border-foreground/70 px-6 py-3.5 tracking-type text-bureau-ink-muted`}>
          <span>Section A · Particulars of the encounter</span>
          <span>Form No. ACD-27B, Rev. 10/1977</span>
        </div>

        <div className="grid gap-x-6 gap-y-5 p-6 sm:grid-cols-2 xl:grid-cols-3">
          {WITNESS_FIELDS.map((f, i) => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <label htmlFor={`acd27b-${f.key}`} className={`${eyebrow} flex items-baseline gap-2 tracking-type text-bureau-ink`}>
                <span className="text-bureau-stamp-ink">{String(i + 1).padStart(2, "0")}.</span>
                <span>{f.label}</span>
              </label>
              <input
                id={`acd27b-${f.key}`}
                type="text"
                autoComplete="off"
                value={values[f.key]}
                onChange={(e) => setField(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="min-h-11 w-full rounded-sm border border-bureau-border bg-bureau-manila/30 px-3 py-2 font-typewriter text-base text-foreground placeholder:italic placeholder:text-muted-foreground/80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-bureau-border px-6 py-5">
          <Button type="submit" size="lg" className="text-base">
            <FileText className="h-4 w-4" aria-hidden="true" />
            File statement
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setValues(randomWitnessValues())}
            className="border-primary text-base text-primary"
          >
            <Shuffle className="h-4 w-4" aria-hidden="true" />
            Let the Bureau fill it in
          </Button>
          <Button
            type="button"
            variant="link"
            size="lg"
            onClick={() => setValues(emptyWitnessValues())}
            className="px-1 font-typewriter text-sm uppercase tracking-type text-bureau-ink-muted underline"
          >
            Clear form
          </Button>
        </div>
      </form>

      <aside className="memo-paper memo-flat relative flex flex-col gap-4 py-7 pl-11 pr-7">
        <HolePunches />
        <h2 className={`${eyebrow} relative z-10 text-bureau-ink`}>Instructions to witness</h2>
        <ol className="relative z-10 flex list-decimal flex-col gap-3 pl-5 font-typewriter text-sm leading-relaxed text-bureau-ink">
          <li>Complete each blank to the best of your recollection.</li>
          <li>Blanks left empty will be redacted. The Bureau is used to this.</li>
          <li>Do not describe the entity as &ldquo;just a deer.&rdquo; The Bureau has a separate form for that.</li>
          <li>Snacks left for the entity are the responsibility of the witness.</li>
        </ol>
        <p className="relative z-10 border-t border-dashed border-bureau-border pt-3 text-base leading-relaxed text-muted-foreground">
          You don&rsquo;t have to be sure. Most of the best stories in these hills started with somebody saying
          &ldquo;I know how this sounds.&rdquo;
        </p>
      </aside>
    </section>
  );
}
