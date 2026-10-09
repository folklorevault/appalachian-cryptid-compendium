"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

// The <html> class is the source of truth (set pre-paint by themeInitScript),
// so subscribe to it rather than mirroring it in React state.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

function applyTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next = !isDark;
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Private mode: the switch still works for this page view.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label="Night shift (dark theme)"
      title={isDark ? "Switch to day shift" : "Switch to night shift"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-sm text-foreground/70 transition-colors hover:text-primary hover:bg-primary/10 ${className}`}
    >
      {/* Both icons ship in the HTML and CSS picks one, so the right icon
          shows before hydration with no swap. */}
      <Moon className="h-4 w-4 dark:hidden" aria-hidden="true" />
      <Sun className="hidden h-4 w-4 dark:block" aria-hidden="true" />
    </button>
  );
}
