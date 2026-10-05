import { fetchCryptidBySlug } from "@/lib/sanity/fetchers";
import { urlFor } from "@/lib/sanity/image";
import { getCaseFileNumber } from "@/lib/caseUtils";
import {
  CRYPTID_ORDER,
  RESULTS,
  type AssessmentResultCopy,
  type CryptidKey,
} from "@/data/assessment";

export interface AssessmentResult extends AssessmentResultCopy {
  fileNo: string;
  /** Portrait crop for the Field Agent ID card, or null when Sanity has no image. */
  photoUrl: string | null;
  /** JPEG variant for next/og, which can't decode webp. */
  ogPhotoUrl: string | null;
}

export type AssessmentResults = Record<CryptidKey, AssessmentResult>;

// Binomial names start with a capital genus, whatever casing the CMS holds.
const binomial = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Result copy from src/data/assessment.ts with the published case-file facts
 * layered on top, so the quiz never contradicts the cryptid entries. Falls
 * back to the snapshot values when Sanity is unreachable.
 */
export async function getAssessmentResult(key: CryptidKey): Promise<AssessmentResult> {
  const copy = RESULTS[key];
  const cryptid = await fetchCryptidBySlug(copy.slug);
  const image = cryptid?.gridImage ?? cryptid?.image;

  return {
    ...copy,
    scientificName: binomial(cryptid?.scientificName || copy.scientificName),
    classification: cryptid?.classification || copy.classification,
    dangerLevel: cryptid?.dangerLevel ?? copy.dangerLevel,
    fileNo: getCaseFileNumber(copy.slug),
    photoUrl: image
      ? urlFor(image).width(480).height(600).fit("crop").quality(70).auto("format").url()
      : null,
    ogPhotoUrl: image
      ? urlFor(image).width(420).height(525).fit("crop").format("jpg").quality(80).url()
      : null,
  };
}

export async function getAssessmentResults(): Promise<AssessmentResults> {
  const entries = await Promise.all(
    CRYPTID_ORDER.map(async (k) => [k, await getAssessmentResult(k)] as const),
  );
  return Object.fromEntries(entries) as AssessmentResults;
}
