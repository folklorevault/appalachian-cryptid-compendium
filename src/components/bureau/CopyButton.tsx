"use client";

import { useEffect, useRef, useState } from "react";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

interface CopyButtonProps {
  text: string;
  label: string;
  failLabel: string;
  /** Rybbit event fired on a successful copy. */
  event: string;
  className?: string;
}

export function CopyButton({ text, label, failLabel, event, className }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "ok" | "fail">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const settle = (next: "ok" | "fail") => {
    setStatus(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      settle("ok");
      analytics.trackEvent(event);
    } catch {
      settle("fail");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-foreground/70 bg-bureau-manila px-4 py-2.5",
        "font-typewriter text-sm uppercase tracking-type text-bureau-ink shadow-offset",
        "transition-colors hover:bg-bureau-manila-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <Copy className="h-4 w-4" aria-hidden="true" />
      <span aria-live="polite">
        {status === "ok" ? "Copied to clipboard" : status === "fail" ? failLabel : label}
      </span>
    </button>
  );
}
