import { renderAssessmentCard, OG_SIZE } from "@/lib/og/agentIdCard";
import { CRYPTID_ORDER, RESULTS } from "@/data/assessment";

export const alt = "Form ACD-41: Which Appalachian cryptid are you?";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderAssessmentCard(CRYPTID_ORDER.map((k) => RESULTS[k].name.replace(/^The /, "")));
}
