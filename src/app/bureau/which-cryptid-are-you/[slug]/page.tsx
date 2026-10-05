import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AssessmentResultPanel } from "@/components/bureau/AssessmentResultPanel";
import { getAssessmentResult } from "@/lib/assessment";
import { ASSESSMENT_PATH, RESULT_SLUGS, resultBySlug, resultPath } from "@/data/assessment";

export const dynamicParams = false;

export function generateStaticParams() {
  return RESULT_SLUGS.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

/** "The Grafton Monster" reads as "I'm the Grafton Monster" mid-sentence. */
const inSentence = (name: string) => name.replace(/^The /, "the ");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const copy = resultBySlug(slug);
  if (!copy) return {};

  const title = `I'm ${inSentence(copy.name)}. Which Appalachian Cryptid Are You?`;
  const description = `${copy.note} Take Form ACD-41, the Bureau's seven-question cryptid quiz.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: resultPath(slug) },
    openGraph: { title, description, url: resultPath(slug) },
    twitter: { title, description },
  };
}

export default async function AssessmentResultPage({ params }: Props) {
  const { slug } = await params;
  const copy = resultBySlug(slug);
  if (!copy) notFound();

  const result = await getAssessmentResult(copy.key);

  return (
    <div className="flex min-h-screen flex-col bg-background paper-texture">
      <main id="main-content" className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 pb-20 pt-12 sm:pt-16">
        <header className="flex flex-col items-start gap-4">
          <span className="drawer-chip">ACD-41 · Field Agent Affinity Assessment</span>
          <h1 className="font-display text-[clamp(2.2rem,5.5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-foreground">
            An agent was matched with {inSentence(copy.name)}.
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Which Appalachian cryptid are you? Seven questions. Answer honestly. The Bureau can tell.
          </p>
          <Button asChild size="lg" className="min-h-12 px-7 text-base">
            <Link href={ASSESSMENT_PATH}>
              Take the assessment
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </header>

        <AssessmentResultPanel result={result} />
      </main>
      <Footer variant="full" />
    </div>
  );
}
