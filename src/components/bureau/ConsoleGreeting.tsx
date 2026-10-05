"use client";

import { useEffect } from "react";

// Module scope survives client-side navigations, so this logs once per page load.
let greeted = false;

/** Easter egg for people who open dev tools. Renders nothing. */
export function ConsoleGreeting() {
  useEffect(() => {
    if (greeted) return;
    greeted = true;
    console.log(
      "%cField Office No. 7 acknowledges your curiosity.%c\nForm ACD-27B is located at /bureau/form-acd-27b.",
      "font-family: 'Courier New', monospace; font-weight: bold; color: #683027;",
      "font-family: 'Courier New', monospace;",
    );
  }, []);

  return null;
}
