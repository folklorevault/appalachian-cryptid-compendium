// State filing for cryptid case files. Values mirror the `states` field options
// in sanity/appalachian-cryptid/schemaTypes/cryptid.ts — keep the two in sync.

export const ACROSS_APPALACHIA = "across-appalachia";
export const ELSEWHERE = "elsewhere";

export const STATE_NAMES: Record<string, string> = {
  [ACROSS_APPALACHIA]: "Across Appalachia",
  WV: "West Virginia",
  NC: "North Carolina",
  VA: "Virginia",
  TN: "Tennessee",
  KY: "Kentucky",
  PA: "Pennsylvania",
  MD: "Maryland",
  OH: "Ohio",
  NY: "New York",
  SC: "South Carolina",
  GA: "Georgia",
  AL: "Alabama",
  MS: "Mississippi",
  LA: "Louisiana",
  AR: "Arkansas",
  FL: "Florida",
};

export const stateName = (code: string) => STATE_NAMES[code] ?? code;

export interface StateChip {
  value: string;
  label: string;
  count: number;
}

/**
 * Builds filter chips from the data rather than a fixed list: a state earns its
 * own chip once it holds two or more files; single-file states share an
 * "Elsewhere" chip so the row doesn't fill with ones. "Across Appalachia"
 * (legends with no single home) always sorts after the states.
 */
export function buildStateChips(items: { states?: string[] }[]) {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const code of new Set(item.states ?? [])) {
      counts.set(code, (counts.get(code) ?? 0) + 1);
    }
  }

  const across = counts.get(ACROSS_APPALACHIA) ?? 0;
  counts.delete(ACROSS_APPALACHIA);

  const chips: StateChip[] = [];
  const singles = new Set<string>();
  for (const [code, count] of [...counts].sort(
    (a, b) => b[1] - a[1] || stateName(a[0]).localeCompare(stateName(b[0]))
  )) {
    if (count >= 2) chips.push({ value: code, label: stateName(code), count });
    else singles.add(code);
  }

  if (across > 0) {
    chips.push({ value: ACROSS_APPALACHIA, label: stateName(ACROSS_APPALACHIA), count: across });
  }

  const elsewhereCount = items.filter((item) =>
    item.states?.some((code) => singles.has(code))
  ).length;
  if (elsewhereCount > 0) {
    chips.push({ value: ELSEWHERE, label: "Elsewhere", count: elsewhereCount });
  }

  return { chips, singles };
}

export function matchesStateFilter(
  states: string[] | undefined,
  filter: string,
  singles: Set<string>
) {
  if (filter === "all") return true;
  if (!states?.length) return false;
  if (filter === ELSEWHERE) return states.some((code) => singles.has(code));
  return states.includes(filter);
}
