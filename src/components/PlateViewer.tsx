"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ViewerPlate {
  key: string;
  label: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
  lqip?: string;
  caption?: string;
  credit?: string;
  // Close to the 4:5 frame → fill it; much taller or wider → show it whole.
  fit: "cover" | "contain";
}

// The specimen cover's photo frame. A scroll-snap track does the sliding, so
// phones get native swipe and momentum; the arrows and thumbnails just scroll
// the track to a plate.
export function PlateViewer({ plates }: { plates: ViewerPlate[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const multiple = plates.length > 1;

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: index * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
  }, []);

  // Swipes and arrow-key scrolling move the track directly, so the active
  // plate is read back from the scroll position rather than set on click.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !multiple) return;
    const onScroll = () => setActive(Math.round(track.scrollLeft / track.clientWidth));
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [multiple]);

  const current = plates[active] ?? plates[0];

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Specimen plates">
      <div className="aspect-4/5 border border-bureau-manila-light/35 p-1.5">
        <div
          ref={trackRef}
          tabIndex={multiple ? 0 : undefined}
          aria-label={multiple ? "Plates, scroll sideways" : undefined}
          className="scrollbar-none flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-bureau-ink-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bureau-rust-ink"
        >
          {plates.map((plate, i) => (
            <figure
              key={plate.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${plates.length}`}
              className="relative h-full w-full shrink-0 snap-center"
            >
              <Image
                src={plate.src}
                alt={plate.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 640px, 100vw"
                placeholder={plate.lqip ? "blur" : "empty"}
                blurDataURL={plate.lqip}
                className={plate.fit === "cover" ? "object-cover" : "object-contain p-4"}
              />
              <figcaption className="sr-only">
                {plate.label}. {plate.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-start gap-4">
        <p className="min-w-0 flex-1 text-sm leading-relaxed text-bureau-manila-light" aria-live="polite">
          <span className="font-semibold text-bureau-paper">{current.label}.</span>
          {current.caption && <> {current.caption}</>}
          {current.credit && <span className="block text-bureau-manila-light/70">{current.credit}</span>}
        </p>
        {multiple && (
          <div className="flex shrink-0 items-center gap-2">
            <span className="font-typewriter text-xs uppercase tracking-label text-bureau-manila-light/80">
              {active + 1} / {plates.length}
            </span>
            <ArrowButton label="Previous plate" disabled={active === 0} onClick={() => goTo(active - 1)}>
              <ChevronLeft className="size-5" aria-hidden />
            </ArrowButton>
            <ArrowButton
              label="Next plate"
              disabled={active === plates.length - 1}
              onClick={() => goTo(active + 1)}
            >
              <ChevronRight className="size-5" aria-hidden />
            </ArrowButton>
          </div>
        )}
      </div>

      {multiple && (
        <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {plates.map((plate, i) => (
            <li key={plate.key}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === active ? "true" : undefined}
                className={`relative block aspect-square w-full overflow-hidden bg-bureau-ink-dark -outline-offset-1 ${
                  i === active
                    ? "outline-2 outline-bureau-rust"
                    : "outline-1 outline-bureau-manila-light/20 opacity-70 hover:opacity-100 hover:outline-bureau-rust-ink"
                }`}
              >
                <Image src={plate.thumb} alt="" fill sizes="160px" className="object-cover" />
                <span className="sr-only">
                  Show {plate.label}
                  {plate.caption ? `: ${plate.caption}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ArrowButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-11 items-center justify-center border border-bureau-manila-light/35 text-bureau-paper hover:border-bureau-rust-ink hover:text-bureau-rust-ink disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
