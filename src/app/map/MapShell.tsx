"use client";

import dynamic from "next/dynamic";
import type { SanityCryptidMapItem } from "@/types/sanity";

const CryptidMap = dynamic(
  () => import("@/components/CryptidMap").then((m) => m.CryptidMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] lg:h-[600px] rounded-lg border-2 border-border bg-card flex items-center justify-center">
        <p className="text-muted-foreground font-typewriter">
          Loading sighting map…
        </p>
      </div>
    ),
  }
);

export function MapShell({ cryptids }: { cryptids: SanityCryptidMapItem[] }) {
  return <CryptidMap cryptids={cryptids} />;
}
