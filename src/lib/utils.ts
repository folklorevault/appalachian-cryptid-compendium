import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncate text for use as a meta description. Collapses whitespace and, when
 * over `max`, cuts at the last word boundary (never mid-word) and appends a
 * single ellipsis. The returned string is always <= `max` characters.
 * Default 140 keeps snippets under Google's ~155-char display cutoff.
 */
export function truncateMeta(text: string, max = 140): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max - 1); // reserve one char for the ellipsis
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed = (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).replace(
    /[\s,.;:—-]+$/,
    "",
  );
  return trimmed + "…";
}

/** Format a date string as MM/DD/YY for ledger displays */
export function formatLedgerDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

/** Format a date string as "March 1, 2026" */
export function formatLongDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
