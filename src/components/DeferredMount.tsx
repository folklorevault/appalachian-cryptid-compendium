"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface DeferredMountProps {
  children: ReactNode;
  /**
   * Reserved height (px) for the placeholder so the layout does not shift
   * when the real content mounts. Set this to the component's natural height.
   */
  minHeight: number;
  /**
   * How far before the placeholder enters the viewport to begin mounting.
   * A generous margin means content is ready before the user scrolls to it,
   * so there is no visible pop-in.
   */
  rootMargin?: string;
  className?: string;
}

/**
 * Renders its children only once the placeholder scrolls near the viewport.
 *
 * Why: below-the-fold client components (newsletter form, share buttons) would
 * otherwise hydrate during the initial page load, lengthening the main-thread
 * long tasks that dominate mobile INP. Gating their mount on visibility keeps
 * them out of that critical window without dropping them from the page.
 *
 * The children are NOT server-rendered (the server emits only the reserved
 * placeholder), which is fine here because these widgets carry no SEO value.
 */
export function DeferredMount({
  children,
  minHeight,
  rootMargin = "300px",
  className,
}: DeferredMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver is unavailable, mount on the next tick as a
    // fallback (deferred so it never mounts during the initial commit).
    if (typeof IntersectionObserver === "undefined") {
      const id = setTimeout(() => setShow(true), 0);
      return () => clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [show, rootMargin]);

  if (show) return <>{children}</>;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ minHeight }}
    />
  );
}
