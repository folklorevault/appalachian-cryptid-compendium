"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ArrowButton, type ViewerPlate } from "@/components/PlateViewer";

// The numbered plates grid. Each plate opens full-screen in a native
// <dialog>, which brings focus trapping, Esc to close and focus return
// without another dependency.
export function PlateGallery({ plates }: { plates: ViewerPlate[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const plate = open === null ? null : plates[open];
  const multiple = plates.length > 1;

  const show = (index: number) => {
    setOpen(index);
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  };

  // The dialog blocks interaction with the page but not its scrolling.
  useEffect(() => {
    if (open === null) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (open === null) return;
    if (event.key === "ArrowRight" && open < plates.length - 1) show(open + 1);
    if (event.key === "ArrowLeft" && open > 0) show(open - 1);
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plates.map((p, i) => (
          <figure key={p.key} id={`plate-${i + 1}`} className="scroll-mt-28">
            {/* Fixed-height frame: tall specimens (slides) scale down to
                match their neighbours instead of stretching the row,
                and captions line up across the grid. */}
            <button
              type="button"
              onClick={() => show(i)}
              aria-label={`Enlarge ${p.label}`}
              aria-haspopup="dialog"
              className="group flex h-96 w-full cursor-zoom-in items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={p.width}
                height={p.height}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                placeholder={p.lqip ? "blur" : "empty"}
                blurDataURL={p.lqip}
                className="h-auto max-h-full w-auto max-w-full motion-safe:transition-opacity group-hover:opacity-85"
              />
            </button>
            <figcaption className="mt-2.5 text-sm leading-relaxed text-foreground">
              <strong className="font-semibold">{p.label}.</strong>
              {p.caption && <> {p.caption}</>}
              {p.credit && <span className="block text-muted-foreground">{p.credit}</span>}
            </figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="plate-dialog-caption"
        onClose={() => setOpen(null)}
        onKeyDown={onKeyDown}
        className="plate-stock plate-ink m-0 h-dvh max-h-none w-full max-w-none bg-bureau-ink-dark p-0 text-bureau-manila-light"
      >
        {plate && open !== null && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-6">
              <span className="font-typewriter text-xs uppercase tracking-label text-bureau-manila-light/80">
                {plate.label}
                {multiple && ` · ${open + 1} / ${plates.length}`}
              </span>
              <ArrowButton label="Close" disabled={false} onClick={() => dialogRef.current?.close()}>
                <X className="size-5" aria-hidden />
              </ArrowButton>
            </div>

            {/* Tapping the photo closes it, like putting the plate back. */}
            <div
              className="relative mx-4 my-4 min-h-0 flex-1 cursor-zoom-out sm:mx-6"
              onClick={() => dialogRef.current?.close()}
            >
              <Image
                key={plate.key}
                src={plate.src}
                alt={plate.alt}
                fill
                sizes="100vw"
                placeholder={plate.lqip ? "blur" : "empty"}
                blurDataURL={plate.lqip}
                className="object-contain"
              />
            </div>

            <div className="mx-auto flex w-full max-w-3xl items-start gap-4 px-4 pb-6 sm:px-6">
              <p
                id="plate-dialog-caption"
                className="min-w-0 flex-1 text-sm leading-relaxed text-bureau-manila-light"
                aria-live="polite"
              >
                <span className="font-semibold text-bureau-paper">{plate.label}.</span>
                {plate.caption && <> {plate.caption}</>}
                {plate.credit && <span className="block text-bureau-manila-light/70">{plate.credit}</span>}
              </p>
              {multiple && (
                <div className="flex shrink-0 items-center gap-2">
                  <ArrowButton label="Previous plate" disabled={open === 0} onClick={() => show(open - 1)}>
                    <ChevronLeft className="size-5" aria-hidden />
                  </ArrowButton>
                  <ArrowButton
                    label="Next plate"
                    disabled={open === plates.length - 1}
                    onClick={() => show(open + 1)}
                  >
                    <ChevronRight className="size-5" aria-hidden />
                  </ArrowButton>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
