// Form ACD-27B, Supplemental Witness Statement.
// Field definitions plus the pure logic that types up a filed statement.
// Nothing here is stored or sent anywhere; the form lives entirely in the browser.

export type WitnessFieldKey =
  | "time"
  | "relative"
  | "county"
  | "vehicle"
  | "number"
  | "color"
  | "bodyPart"
  | "sound"
  | "verbing"
  | "adjective"
  | "snack"
  | "evidence";

export interface WitnessField {
  key: WitnessFieldKey;
  label: string;
  placeholder: string;
  pool: string[];
}

export type WitnessValues = Record<WitnessFieldKey, string>;

export const WITNESS_FIELDS: WitnessField[] = [
  { key: "time", label: "A time of day", placeholder: "just past dusk", pool: ["just past dusk", "a quarter till midnight", "second shift letting out", "the hour the whippoorwills quit", "church traffic on a Sunday"] },
  { key: "relative", label: "A relative or neighbor", placeholder: "my mamaw", pool: ["my mamaw", "my cousin Dale", "the neighbor with the goats", "my ex-brother-in-law", "Aunt Brenda"] },
  { key: "county", label: "An Appalachian county", placeholder: "Unicoi", pool: ["Unicoi", "Greenbrier", "Watauga", "Mason", "Hawkins", "Braxton", "Carter"] },
  { key: "vehicle", label: "A vehicle", placeholder: "1994 Ford Ranger", pool: ["1994 Ford Ranger", "church van", "riding mower", "Buick with one working headlight", "golf cart of uncertain registration"] },
  { key: "number", label: "A number", placeholder: "8", pool: ["4", "7", "9", "11", "13"] },
  { key: "color", label: "A color", placeholder: "wet-cardboard gray", pool: ["wet-cardboard gray", "Mountain Dew green", "rust", "gravy brown", "a white you could only see sideways"] },
  { key: "bodyPart", label: "A body part, plural", placeholder: "elbows", pool: ["elbows", "knees", "eyebrows", "thumbs", "shoulders"] },
  { key: "sound", label: "A sound", placeholder: "hrrrmmp", pool: ["hrrrmmp", "a dial-up modem", "whoo-eee", "a screen door, but sad", "kettle at full boil"] },
  { key: "verbing", label: "A verb ending in -ing", placeholder: "moonwalking", pool: ["moonwalking", "backing", "sidestepping", "shuffling", "apologizing"] },
  { key: "adjective", label: "An adjective", placeholder: "disappointed", pool: ["disappointed", "damp", "familiar", "polite", "tired of all this"] },
  { key: "snack", label: "A snack food", placeholder: "a pack of nabs", pool: ["a pack of nabs", "half a moon pie", "a jar of chow-chow", "a sleeve of saltines", "one fried apple pie"] },
  { key: "evidence", label: "Something from a junk drawer", placeholder: "a single AA battery", pool: ["a single AA battery", "a church key", "three twist ties", "a dried-up ink pen", "a key nobody can explain"] },
];

export function emptyWitnessValues(): WitnessValues {
  return Object.fromEntries(WITNESS_FIELDS.map((f) => [f.key, ""])) as WitnessValues;
}

export function randomWitnessValues(): WitnessValues {
  return Object.fromEntries(
    WITNESS_FIELDS.map((f) => [f.key, f.pool[Math.floor(Math.random() * f.pool.length)]]),
  ) as WitnessValues;
}

export type StatementSegment =
  | { kind: "text"; text: string }
  | { kind: "answer"; text: string }
  | { kind: "redacted" };

export type Advisory = "Elevated" | "Moderate" | "Low" | "Unquantified";

export interface FiledStatement {
  segments: StatementSegment[];
  redactions: number;
  caseNo: string;
  receivedDate: string;
  jurisdiction: string;
  classification: string;
  advisory: Advisory;
  determination: string;
  redactionNote: string;
  shareQuote: string;
  shareLine: string;
  plainText: string;
}

const CLASSIFICATIONS = ["Visitor", "Harbinger", "Cultural Record", "Roadside Nuisance", "Unfiled Oddity", "Porch Lurker"];

const DETERMINATIONS = [
  "Statement is consistent with prior reports from the region. No further action at this time.",
  "The Bureau has no reason to doubt the witness. The Bureau has no particular reason to believe the witness either. Statement filed.",
  "Statement forwarded to Field Office No. 7. Agents advise the witness to stop leaving snacks out.",
  "Entity matches no existing case file. A new manila folder has been requisitioned.",
  "Witness is commended for a thorough account and advised to take the long way home for a while.",
];

const MOSTLY_BLANK_DETERMINATION =
  "Statement was submitted almost entirely blank. The Bureau respects a witness who knows when to keep quiet. Filed as received.";

/** Blanks at or above this count make the statement "Redacted in Full". */
const MOSTLY_BLANK = 8;

export function hashString(str: string): number {
  let h = 7;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function advisoryFor(raw: string): Advisory {
  const n = parseFloat(raw);
  if (Number.isNaN(n)) return "Unquantified";
  if (n >= 10) return "Elevated";
  if (n >= 6) return "Moderate";
  return "Low";
}

export function fileStatement(values: WitnessValues, now: Date): FiledStatement {
  const t = (k: WitnessFieldKey) => (values[k] ?? "").trim();
  const segments: StatementSegment[] = [];
  let redactions = 0;

  const lit = (text: string) => segments.push({ kind: "text", text });
  const blank = (k: WitnessFieldKey, transform?: (s: string) => string) => {
    const raw = t(k);
    if (!raw) {
      redactions++;
      segments.push({ kind: "redacted" });
      return;
    }
    segments.push({ kind: "answer", text: transform ? transform(raw) : raw });
  };

  lit("On or about "); blank("time"); lit(", the witness and "); blank("relative");
  lit(" were proceeding along a back road in "); blank("county"); lit(" County in a "); blank("vehicle");
  lit(" when an entity was observed at the tree line. Subject stood approximately "); blank("number");
  lit(" feet tall, was "); blank("color"); lit(" in coloration, and possessed an unusual number of "); blank("bodyPart");
  lit('. Witness reports the entity emitted a sound best transcribed as "'); blank("sound");
  lit('" before '); blank("verbing"); lit(" into the laurel. "); blank("relative", cap);
  lit(" stated, for the record, that it looked "); blank("adjective");
  lit(". As a courtesy, the witness left "); blank("snack");
  lit(" on the guardrail. It was gone by morning. "); blank("evidence", cap);
  lit(" was recovered at the scene and has been entered into evidence.");

  const seed = hashString(WITNESS_FIELDS.map((f) => t(f.key)).join("|"));
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const yyyy = now.getFullYear();
  const caseNo = `SIG-${yyyy}-${mm}${dd}-${String(seed % 10000).padStart(4, "0")}`;

  const mostlyBlank = redactions >= MOSTLY_BLANK;
  const classification = mostlyBlank ? "Redacted in Full" : CLASSIFICATIONS[seed % CLASSIFICATIONS.length];
  const determination = mostlyBlank
    ? MOSTLY_BLANK_DETERMINATION
    : DETERMINATIONS[(seed >>> 3) % DETERMINATIONS.length];
  const advisory = advisoryFor(t("number"));

  const redactionNote =
    redactions === 0
      ? "complete"
      : `${redactions} ${redactions === 1 ? "redaction" : "redactions"} applied`;

  const plainStatement = segments
    .map((s) => (s.kind === "redacted" ? "[REDACTED]" : s.text))
    .join("");

  const shareQuote = t("adjective") ? `"It looked ${t("adjective")}."` : '"No comment."';
  const shareLine =
    (t("relative")
      ? `Statement of ${t("relative")}, as relayed by the witness.`
      : "Statement withheld at the request of the witness.") + ` Advisory: ${advisory}.`;

  const jurisdiction = t("county") ? `${t("county")} County` : "Withheld";

  const plainText = [
    "APPALACHIAN CRYPTID DIVISION · FORM ACD-27B",
    `Case ${caseNo} · ${t("county") ? jurisdiction : "Jurisdiction withheld"}`,
    `Classification: ${classification} · Advisory: ${advisory}`,
    "",
    plainStatement,
    "",
    `Bureau determination: ${determination}`,
    "",
    "File your own: appalachiancryptid.com",
  ].join("\n");

  return {
    segments,
    redactions,
    caseNo,
    receivedDate: `${mm}.${dd}.${yyyy}`,
    jurisdiction,
    classification,
    advisory,
    determination,
    redactionNote,
    shareQuote,
    shareLine,
    plainText,
  };
}
