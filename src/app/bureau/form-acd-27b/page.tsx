import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Stamp } from "@/components/Stamp";
import { WitnessStatementForm } from "@/components/bureau/WitnessStatementForm";
import { ASSESSMENT_PATH, WITNESS_FORM_PATH } from "@/data/assessment";

// Unlisted on purpose: reachable only from the footer stamp, the 404 page,
// the quiz results, and the console. Kept out of the sitemap too.
export const metadata: Metadata = {
  title: "Form ACD-27B: Supplemental Witness Statement",
  description: "Some sightings don't fit on the regular report form. Fill in the blanks and the Bureau will type up your statement.",
  robots: { index: false, follow: true },
  alternates: { canonical: WITNESS_FORM_PATH },
};

export default function WitnessFormPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background paper-texture">
      <main id="main-content" className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 pb-20 pt-12 sm:pt-16">
        <header className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex min-w-0 max-w-2xl flex-col items-start gap-4">
            <span className="drawer-chip">ACD-27B · Supplemental Witness Statement</span>
            <h1 className="font-display text-hero font-bold leading-tight text-foreground">
              Tell the Bureau what you saw.
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Some sightings don&rsquo;t fit on the regular report form. Fill in the blanks below and the Bureau will
              type up your statement, assign it a case number, and file it with the rest of the front-porch stories.
            </p>
          </div>
          <Stamp
            text="Unlisted Form"
            rotation={-6}
            className="mx-auto border-bureau-stamp-ink text-bureau-stamp-ink sm:mx-8"
          />
        </header>

        <WitnessStatementForm />

        <p className="max-w-2xl border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
          If you found this page, you are now a field agent. Congratulations. There is no pay. New agents are asked to
          complete{" "}
          <Link href={ASSESSMENT_PATH} className="text-primary underline underline-offset-4">
            Form ACD-41, the Field Agent Affinity Assessment
          </Link>
          .
        </p>
      </main>
      <Footer variant="full" />
    </div>
  );
}
