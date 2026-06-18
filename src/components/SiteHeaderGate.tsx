"use client";

import { usePathname } from "next/navigation";

// Routes that render standalone (e.g. the link-in-bio directory) without the
// global site header/nav, so the page stands on its own from a social profile.
const BARE_ROUTES = ["/links"];

export function SiteHeaderGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname && BARE_ROUTES.includes(pathname)) return null;
  return <>{children}</>;
}
