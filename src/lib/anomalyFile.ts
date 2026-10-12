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
  return head.length > 36 ? `${head.slice(0, 34).trimEnd()}…` : head;
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
