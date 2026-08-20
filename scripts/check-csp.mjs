#!/usr/bin/env node
/**
 * CSP guard — fails if the Content-Security-Policy is missing the directives
 * BotID's bot-detection challenge needs to run.
 *
 * Why this exists: on 2026-03-31 a BotID deploy shipped without a `frame-src`
 * directive. The CSP fell back to `child-src`, which blocked BotID's
 * same-origin challenge iframe. The challenge could never complete, so
 * checkBotId() flagged EVERY real visitor as a bot and both /api/newsletter
 * and /api/sightings silently dropped submissions for ~2.5 months.
 *
 * Modes:
 *   node scripts/check-csp.mjs                 # source mode: inspect next.config.ts (pre-merge)
 *   node scripts/check-csp.mjs --url <url>     # live mode: inspect a deployed CSP header
 *
 * Exits non-zero (and prints what's missing) on failure.
 */

import { readFile } from "node:fs/promises";

// Directives the BotID challenge depends on. Each must be present AND grant
// 'self' so the same-origin challenge script + fingerprint iframe can load.
const REQUIRED = [
  { name: "frame-src", token: "'self'", why: "BotID loads a same-origin challenge iframe (/<proxy>/fp)" },
  { name: "script-src", token: "'self'", why: "BotID's challenge scripts (c.js, p.js) are served same-origin" },
  { name: "connect-src", token: "'self'", why: "BotID proxies challenge requests through your own domain" },
];

/** Returns an array of failure messages (empty = pass) for a CSP string. */
function validateCsp(csp) {
  const failures = [];
  for (const { name, token, why } of REQUIRED) {
    // Match the directive and the values up to the next `;` (or end).
    const re = new RegExp(`${name}\\b([^;]*)`, "i");
    const m = csp.match(re);
    if (!m) {
      failures.push(`Missing "${name}" directive — ${why}.`);
      continue;
    }
    const values = m[1];
    if (!values.includes(token) && !values.includes("*")) {
      failures.push(`"${name}" does not allow ${token} — ${why}.`);
    }
  }
  return failures;
}

async function getCspFromSource() {
  const src = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");
  // The config builds the CSP from a `cspDirectives` array of string literals.
  // Pull everything between the array brackets and flatten quotes/commas so the
  // directive tokens sit in one searchable string.
  const start = src.indexOf("cspDirectives");
  if (start === -1) throw new Error("Could not find cspDirectives in next.config.ts");
  const open = src.indexOf("[", start);
  const close = src.indexOf("];", open);
  if (open === -1 || close === -1) throw new Error("Could not parse cspDirectives array");
  return src.slice(open + 1, close).replace(/[`"']/g, (q) => (q === "`" || q === '"' ? "" : q));
}

async function getCspFromUrl(url) {
  // Vercel's managed Bot Protection ruleset (flipped Log -> Challenge on
  // 2026-08-05, after the rotating-proxy scraper incident) challenges every
  // non-browser client, CI runners included. The WAF rule "Bypass: CSP guard
  // monitor" waves us through when this header carries the right secret.
  const token = process.env.CSP_GUARD_TOKEN;
  const res = await fetch(url, {
    redirect: "manual",
    headers: token ? { "x-csp-guard": token } : {},
  });

  const csp = res.headers.get("content-security-policy");
  if (csp) return csp;

  // A challenge response legitimately carries no CSP header. That is NOT a CSP
  // regression, and reporting it as one turns this tripwire into noise — the
  // exact failure mode it was built to prevent. Name the real cause instead.
  if (res.headers.get("x-vercel-mitigated") === "challenge") {
    throw new Error(
      `Vercel WAF challenged this request (status ${res.status}), so there is no CSP header to read. ` +
        (token
          ? "A bypass header was sent but the WAF did not honour it. Check, in this order:\n" +
            "    1. Does the rule exist LIVE?  `vercel firewall rules ls`\n" +
            "       `rules add` only stages a draft — it is inert until `vercel firewall publish`.\n" +
            "       This exact gap broke the guard from 2026-08-06 to 2026-08-19.\n" +
            "    2. Is its action `bypass`?  Lesser actions skip only other custom rules,\n" +
            "       not the managed Bot Protection ruleset that issues this challenge.\n" +
            "    3. Does the secret still match GitHub secret CSP_GUARD_TOKEN, and does\n" +
            "       the rule's path condition still cover the URL above?"
          : "CSP_GUARD_TOKEN is unset, so no bypass header was sent."),
    );
  }

  throw new Error(`No Content-Security-Policy header on ${url} (status ${res.status})`);
}

async function main() {
  const urlFlag = process.argv.indexOf("--url");
  const mode = urlFlag !== -1 ? "live" : "source";
  const target = urlFlag !== -1 ? process.argv[urlFlag + 1] : "next.config.ts";

  let csp;
  try {
    csp = mode === "live" ? await getCspFromUrl(target) : await getCspFromSource();
  } catch (err) {
    console.error(`✖ CSP guard could not read ${mode} CSP: ${err.message}`);
    process.exit(2);
  }

  const failures = validateCsp(csp);
  if (failures.length > 0) {
    console.error(`✖ CSP guard FAILED (${mode}: ${target})`);
    for (const f of failures) console.error(`  - ${f}`);
    console.error("\nThis CSP would break BotID — real users would be flagged as bots.");
    process.exit(1);
  }

  console.log(`✓ CSP guard passed (${mode}: ${target}) — BotID challenge directives present.`);
}

main();
