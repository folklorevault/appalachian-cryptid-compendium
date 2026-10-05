import { renderAgentIdCard, OG_SIZE } from "@/lib/og/agentIdCard";
import { getAssessmentResult } from "@/lib/assessment";
import { RESULT_SLUGS, resultBySlug } from "@/data/assessment";

export const alt = "Field Agent ID card from Form ACD-41, the Appalachian cryptid quiz";
export const size = OG_SIZE;
export const contentType = "image/png";

// Prebuild all six so link-preview crawlers never wait on a cold render.
export function generateStaticParams() {
  return RESULT_SLUGS.map((slug) => ({ slug }));
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderAgentIdCard(await getAssessmentResult(resultBySlug(slug)?.key ?? "mothman"));
}
