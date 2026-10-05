// Form ACD-41, Field Agent Affinity Assessment ("Which Appalachian cryptid are you?").
// Questions, scoring, and the playful per-result copy. Case-file facts
// (scientific name, classification, danger level, photo) are merged in from
// Sanity by src/lib/assessment.ts; the values here are the fallback snapshot.

export type CryptidKey = "mothman" | "notdeer" | "tailypo" | "flatwoods" | "sheep" | "grafton";

export type DangerLevel = "Low" | "Medium" | "High";

export interface AssessmentOption {
  text: string;
  points: CryptidKey[];
}

export interface AssessmentQuestion {
  q: string;
  options: AssessmentOption[];
}

export interface AssessmentResultCopy {
  key: CryptidKey;
  /** Real Sanity slug, used for the result route and the case file link. */
  slug: string;
  name: string;
  territory: string;
  assessment: string;
  note: string;
  partner: CryptidKey;
  partnerLine: string;
  /** Fallback case-file facts, snapshot of Sanity on 2026-10-05. */
  scientificName: string;
  classification: string;
  dangerLevel: DangerLevel;
}

export const ASSESSMENT_PATH = "/bureau/which-cryptid-are-you";

/** Tie-break priority when two cryptids also tie on the most recent answer. */
export const CRYPTID_ORDER: CryptidKey[] = ["mothman", "notdeer", "tailypo", "flatwoods", "sheep", "grafton"];

export const QUESTIONS: AssessmentQuestion[] = [
  {
    q: "It’s Friday night. Where are you?",
    options: [
      { text: "Somewhere high up, watching the town lights", points: ["mothman"] },
      { text: "At a get-together, nodding along, running the small-talk script I practiced", points: ["notdeer"] },
      { text: "Making an entrance. Leaving in fifteen minutes.", points: ["flatwoods"] },
      { text: "Home. Lights off. Please do not knock.", points: ["grafton", "sheep"] },
    ],
  },
  {
    q: "Someone borrowed something of yours and never gave it back.",
    options: [
      { text: "I will be at their window every night until they do", points: ["tailypo"] },
      { text: "I say it’s fine. It is not fine.", points: ["notdeer"] },
      { text: "I stand at the end of their driveway, saying nothing", points: ["grafton"] },
      { text: "They will learn, and they will remember", points: ["sheep", "tailypo"] },
    ],
  },
  {
    q: "Pick a gas station snack.",
    options: [
      { text: "A pepperoni roll, still warm from the case", points: ["mothman"] },
      { text: "Salted peanuts poured into a glass-bottle Coke, like a normal person", points: ["notdeer"] },
      { text: "Jerky. Don’t ask what kind.", points: ["tailypo"] },
      { text: "A Moon Pie and an RC Cola", points: ["flatwoods"] },
      { text: "Pickled egg from the jar on the counter. Nobody else ever touches it.", points: ["sheep"] },
      { text: "I’ll just stand by the hot case a while.", points: ["grafton"] },
    ],
  },
  {
    q: "Your friends would describe you as:",
    options: [
      { text: "Shows up right before something happens", points: ["mothman"] },
      { text: "Soft-looking, but don’t push it", points: ["sheep"] },
      { text: "Impossible to read", points: ["grafton"] },
      { text: "A lot. In a good way.", points: ["flatwoods"] },
    ],
  },
  {
    q: "How’s your eye contact?",
    options: [
      { text: "Intense, red, and unforgettable", points: ["mothman"] },
      { text: "I studied it. I still do it slightly wrong.", points: ["notdeer"] },
      { text: "Hard to make eye contact without a head", points: ["grafton"] },
      { text: "Only when I’m making a point", points: ["tailypo", "sheep"] },
    ],
  },
  {
    q: "Pick a place to spend the afternoon.",
    options: [
      { text: "The old TNT bunkers", points: ["mothman"] },
      { text: "The shoulder of the road, right at dusk", points: ["notdeer"] },
      { text: "A hilltop where something just landed", points: ["flatwoods"] },
      { text: "The holler past the last mailbox", points: ["sheep", "tailypo"] },
    ],
  },
  {
    q: "Last one. Your catchphrase:",
    options: [
      { text: "All I want is what’s mine.", points: ["tailypo"] },
      { text: "I am a normal deer.", points: ["notdeer"] },
      { text: "...", points: ["grafton"] },
      { text: "You’ll know when I’ve arrived.", points: ["flatwoods"] },
    ],
  },
];

export const RESULTS: Record<CryptidKey, AssessmentResultCopy> = {
  mothman: {
    key: "mothman",
    slug: "mothman",
    name: "Mothman",
    territory: "Point Pleasant, WV",
    assessment:
      "Subject arrives early, notices everything, and is routinely blamed for events it only attempted to warn people about. Strong preference for high places. Frequently observed staring out windows after dark.",
    note: "You see trouble coming before anybody else does. That isn’t gloom. That’s paying attention.",
    partner: "flatwoods",
    partnerLine: "One makes the entrance. The other saw it coming.",
    scientificName: "Lepidoptera giganteus",
    classification: "Harbinger",
    dangerLevel: "Medium",
  },
  notdeer: {
    key: "notdeer",
    slug: "not-deer",
    name: "Not Deer",
    territory: "Western North Carolina roadsides, after dusk",
    assessment:
      "Subject has carefully studied how a regular deer behaves and reproduces it with great effort and only minor errors. Field agents describe the overall effect as almost.",
    note: "You’ve learned the script so well most folks never notice. You’re allowed to set it down around the people who’d love you either way.",
    partner: "sheep",
    partnerLine: "Both look harmless from a distance. Both know it.",
    scientificName: "Cervus inversus",
    classification: "Mimicry Entity",
    dangerLevel: "Medium",
  },
  tailypo: {
    key: "tailypo",
    slug: "tailypo",
    name: "Tailypo",
    territory: "Porches and cabins, Tennessee and western North Carolina",
    assessment:
      "Subject does not forget. Subject will return to the cabin wall nightly, stating its request clearly and at volume, until all property is returned in full.",
    note: "You know what’s yours, and you’re not shy about asking for it back. Repeatedly. Out loud.",
    partner: "grafton",
    partnerLine: "One says everything. One says nothing. The porch is never boring.",
    scientificName: "Caudatus revenire",
    classification: "Retaliatory Revenant",
    dangerLevel: "Medium",
  },
  flatwoods: {
    key: "flatwoods",
    slug: "flatwoods-monster",
    name: "The Flatwoods Monster",
    territory: "Braxton County, WV",
    assessment:
      "Subject arrived on a hilltop in a bright light, wearing a large and memorable outfit, and made a lasting impression on all present in a remarkably short visit.",
    note: "You don’t do quiet entrances, and folks are still talking about the last one.",
    partner: "mothman",
    partnerLine: "One makes the entrance. The other saw it coming.",
    scientificName: "Monstrum flatwoodensis",
    classification: "Visitor",
    dangerLevel: "Medium",
  },
  sheep: {
    key: "sheep",
    slug: "sheepsquatch",
    name: "Sheepsquatch",
    territory: "West Virginia backwoods",
    assessment:
      "Subject is large, white, woolly, and horned. Witnesses report mistaking it for something cuddly exactly once.",
    note: "Soft on the outside, firm about your boundaries. People figure that out quick.",
    partner: "notdeer",
    partnerLine: "Both look harmless from a distance. Both know it.",
    scientificName: "Ovisquatchia montivaga",
    classification: "Behavioral Aggressor",
    dangerLevel: "Medium",
  },
  grafton: {
    key: "grafton",
    slug: "grafton-monster",
    name: "The Grafton Monster",
    territory: "Grafton, WV",
    assessment:
      "Subject is tall, pale, and reportedly without a head. Subject has never once explained itself and does not appear to feel it owes anyone an explanation.",
    note: "You don’t owe anybody a performance. Standing quietly by the river road is a perfectly good way to spend an evening.",
    partner: "tailypo",
    partnerLine: "One says everything. One says nothing. The porch is never boring.",
    scientificName: "Corpus albidus",
    classification: "Watcher",
    dangerLevel: "Low",
  },
};

export const RESULT_SLUGS = CRYPTID_ORDER.map((k) => RESULTS[k].slug);

export function resultBySlug(slug: string): AssessmentResultCopy | undefined {
  return CRYPTID_ORDER.map((k) => RESULTS[k]).find((r) => r.slug === slug);
}

export function resultPath(slug: string): string {
  return `${ASSESSMENT_PATH}/${slug}`;
}

/** answers[i] is the chosen option index for QUESTIONS[i]. */
export function scoreAnswers(answers: number[]): { key: CryptidKey; matchPct: number } {
  const pts = Object.fromEntries(CRYPTID_ORDER.map((k) => [k, 0])) as Record<CryptidKey, number>;
  const picked = (i: number) => QUESTIONS[i]?.options[answers[i]]?.points ?? [];

  answers.forEach((_, i) => picked(i).forEach((k) => (pts[k] += 1)));

  let best = CRYPTID_ORDER[0];
  for (const k of CRYPTID_ORDER) if (pts[k] > pts[best]) best = k;

  const tied = CRYPTID_ORDER.filter((k) => pts[k] === pts[best]);
  if (tied.length > 1) {
    // Most recent answer wins the tie.
    for (let i = answers.length - 1; i >= 0; i--) {
      const hit = picked(i).find((k) => tied.includes(k));
      if (hit) {
        best = hit;
        break;
      }
    }
  }

  const answered = answers.filter((a) => a !== undefined).length || 1;
  return { key: best, matchPct: Math.min(99, Math.round(58 + 41 * (pts[best] / answered))) };
}

/** Four-digit agent number derived from the answers, so the same answers get the same badge. */
export function agentNumber(answers: number[]): string {
  let h = 7;
  for (const a of answers.join("")) h = (h * 31 + a.charCodeAt(0)) >>> 0;
  return String(h % 10000).padStart(4, "0");
}
