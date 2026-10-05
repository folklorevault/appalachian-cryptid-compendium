import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { AffinityAssessment } from "@/components/bureau/AffinityAssessment";
import { getAssessmentResults } from "@/lib/assessment";
import { ASSESSMENT_PATH } from "@/data/assessment";

const description =
  "Take Form ACD-41, the Bureau's seven-question cryptid quiz, and find out if you're Mothman, Not Deer, Tailypo, the Flatwoods Monster, Sheepsquatch, or the Grafton Monster.";

export const metadata: Metadata = {
  title: "Which Appalachian Cryptid Are You? (Quiz)",
  description,
  alternates: { canonical: ASSESSMENT_PATH },
  openGraph: {
    title: "Which Appalachian Cryptid Are You?",
    description,
    url: ASSESSMENT_PATH,
  },
};

export default async function AssessmentPage() {
  const results = await getAssessmentResults();

  return (
    <div className="flex min-h-screen flex-col bg-background paper-texture">
      <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-6 pb-20 pt-12 sm:pt-16">
        <AffinityAssessment results={results} />
      </main>
      <Footer variant="full" />
    </div>
  );
}
