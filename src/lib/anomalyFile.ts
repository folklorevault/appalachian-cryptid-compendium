// Shared formatting for Anomalies Desk files: the ledger (/anomalies), the
// detail page cover, and its "More from the desk" rows all read from here so
// a file's number and dates never disagree between pages.

/** "6" → "006". Numbers come from creation order (oldest file = 1). */
export function formatFileNo(n: number, width = 3): string {
  return String(n).padStart(width, "0");
}

/** A few words for ledger columns: the short field, else the start of the long one. */
export function ledgerDate(a: {
  firstDocumented?: string;
  firstDocumentedShort?: string;
}): string {
  if (a.firstDocumentedShort) return a.firstDocumentedShort;
  const head = a.firstDocumented?.split(/\s\(|;|\.\s/)[0]?.trim() ?? "";
  if (head.length <= 36) return head;
  // Cut at a word boundary so the ledger never shows half a word.
  return `${head.slice(0, 35).replace(/\s+\S*$/, "")}…`;
}

export interface WitnessParts {
  name: string;
  role?: string;
  location?: string;
}

/**
 * Witness lines are written as "Name — role, detail (Location)". Split them
 * for the archive column; anything that doesn't fit the pattern stays whole
 * in `name` so nothing the editor wrote is ever dropped.
 */
export function parseWitness(raw: string): WitnessParts {
  let rest = raw.trim();
  let location: string | undefined;
  const loc = rest.match(/\(([^()]+)\)\s*$/);
  if (loc) {
    location = loc[1].trim();
    rest = rest.slice(0, loc.index).trim();
  }
  const [name, ...role] = rest.split(/\s+[—–]\s+/);
  return {
    name: name.trim(),
    role: role.length ? role.join(" — ").trim() : undefined,
    location,
  };
}

export interface TitledBlock {
  title?: string;
  body: string;
}

const BULLET = /^[•*\-–]\s+/;
const MAX_TITLE = 120;

/** Capitalise the first letter of a body split off an inline title. */
function sentence(text: string): string {
  const t = text.trim();
  return t ? t[0].toUpperCase() + t.slice(1) : t;
}

/**
 * Split "Title: body", "Title — body" or "Title - body" written on one line.
 * The title must be short and read like a label (no sentence punctuation),
 * and there must be a body after it; otherwise the line stays whole.
 */
function splitInline(line: string): TitledBlock {
  for (const sep of [": ", " — ", " – ", " - "]) {
    const at = line.indexOf(sep);
    if (at <= 0) continue;
    const head = line.slice(0, at).trim();
    const body = line.slice(at + sep.length).trim();
    if (body && head.length <= MAX_TITLE && !/[.!?]/.test(head)) {
      return { title: head, body: sentence(body) };
    }
  }
  return { body: line };
}

/**
 * Theories and related-location fields arrive in a few hand-written shapes;
 * all of them become title/body pairs where a title can be found:
 *
 *   Title line            "Title: body"           • Title - body
 *   body on the next      (one per paragraph)     - plain bullet
 *
 * Intro lines ("Scientific hypotheses have included:") and closing prose
 * stay as untitled paragraphs, so nothing the editor wrote is dropped.
 */
export function parseTitledBlocks(text: string): TitledBlock[] {
  const out: TitledBlock[] = [];
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .split("\n")
        .map((line) => line.replace(/\s{2,}/g, " ").trim())
        .filter(Boolean)
    )
    .filter((lines) => lines.length > 0);

  for (const lines of blocks) {
    if (lines.some((line) => BULLET.test(line))) {
      for (const line of lines) {
        out.push(BULLET.test(line) ? splitInline(line.replace(BULLET, "")) : { body: line });
      }
      continue;
    }
    const [first, ...rest] = lines;
    if (rest.length > 0 && first.length <= 80 && !/[.!?:]$/.test(first)) {
      out.push({ title: first, body: rest.join(" ") });
    } else {
      out.push(splitInline(lines.join(" ")));
    }
  }
  return out;
}

/** Single-newline prose (how the phenomenon field is written) → paragraphs. */
export function splitLines(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.replace(/\s{2,}/g, " ").trim())
    .filter(Boolean);
}
