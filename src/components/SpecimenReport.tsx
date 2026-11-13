import Link from "next/link";
import type { PortableTextBlock } from "@portabletext/react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BulletinBody } from "@/components/BulletinBody";
import { PlateGallery } from "@/components/PlateGallery";
import { PlateViewer, type ViewerPlate } from "@/components/PlateViewer";
import { urlFor } from "@/lib/sanity/image";
import type { SanityBulletin, SanitySpecimenPlate } from "@/types/sanity";

// Specimen-report bulletins (format: 'specimen'): a photo-led ink cover with
// the wall label and accession record, the essay with a margin column,
// numbered plates, and the curator's note back on the ink.
// Mocked as direction D on the "Specimen Report Layouts" canvas.

const ROMAN: Array<[number, string]> = [
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(n: number) {
  let out = "";
  for (const [value, numeral] of ROMAN) {
    while (n >= value) {
      out += numeral;
      n -= value;
    }
  }
  return out;
}

function plateLabel(index: number) {
  return `Pl. ${toRoman(index + 1)}`;
}

function plateSrc(plate: SanitySpecimenPlate, width: number) {
  return urlFor(plate).width(width).fit("max").quality(80).url();
}

// The cover frame is 4:5. Plates near that shape fill it; tall or wide ones
// (a microscope slide) are shown whole so their labels aren't cropped off.
const FRAME_ASPECT = 4 / 5;

function toViewerPlate(plate: SanitySpecimenPlate, index: number): ViewerPlate {
  const { width = 1200, height = 900 } = plate.dimensions ?? {};
  const shapeRatio = width / height / FRAME_ASPECT;
  return {
    key: plate._key,
    label: plateLabel(index),
    src: plateSrc(plate, 1400),
    thumb: urlFor(plate).width(320).height(320).fit("crop").url(),
    width,
    height,
    alt: plate.alt ?? "",
    lqip: plate.lqip,
    caption: plate.caption,
    credit: plate.credit,
    fit: shapeRatio > 0.8 && shapeRatio < 1.25 ? "cover" : "contain",
  };
}

// The H1 drops a leading "Specimen Report:"; the cover's eyebrow says it.
function displayTitle(title: string) {
  return title.replace(/^specimen report:\s*/i, "");
}

export function SpecimenReport({ bulletin }: { bulletin: SanityBulletin }) {
  const specimen = bulletin.specimen ?? {};
  const plates = (specimen.plates ?? []).filter((p) => p.asset);
  const [cover] = plates;
  const viewerPlates = plates.map(toViewerPlate);
  const wallLabel = specimen.wallLabel ?? [];
  const accession = specimen.accession ?? [];
  const status = specimen.status ?? [];
  const noteParagraphs = (specimen.curatorsNote ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      {/* ── Cover: ink plate, photo first ────────────────────────── */}
      <section
        className="plate-stock plate-ink relative border-b border-border bg-bureau-ink text-bureau-manila-light paper-texture"
        aria-labelledby="specimen-heading"
      >
        <div className="relative z-2 mx-auto max-w-6xl px-6 lg:px-8">
          <Breadcrumb className="pt-4">
            <BreadcrumbList className="font-typewriter text-xs uppercase tracking-label text-bureau-manila-light/80">
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="hover:text-bureau-paper">
                  <Link href="/bulletins">Bureau Bulletins</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-bureau-paper">Specimen Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Phones read title → plate → record; wide screens put the
              plate in the left column beside title and record. */}
          <div
            className={`grid gap-x-16 gap-y-8 pt-9 pb-16 ${
              cover ? "lg:grid-cols-[minmax(0,1fr)_28rem] lg:grid-rows-[auto_1fr]" : "max-w-3xl"
            }`}
          >
            <div className={cover ? "lg:col-start-2 lg:row-start-1" : undefined}>
              <p className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {specimen.number && (
                  <span className="font-display text-title font-bold leading-none text-bureau-rust">
                    {specimen.number}
                  </span>
                )}
                <span className="font-typewriter text-xs uppercase tracking-eyebrow text-bureau-rust-ink">
                  Specimen Report · {bulletin.bulletinNumber}
                </span>
              </p>
              <h1
                id="specimen-heading"
                className="text-balance font-display text-hero font-bold leading-[1.08] tracking-tight text-bureau-paper"
              >
                {displayTitle(bulletin.title)}
              </h1>
            </div>

            {cover && (
              // Sticky on wide screens: the record column outruns the
              // photo, so the jar stays in view while the rows scroll by.
              <div className="lg:sticky lg:top-24 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start">
                <PlateViewer plates={viewerPlates} />
              </div>
            )}

            <div className={cover ? "lg:col-start-2 lg:row-start-2" : undefined}>
              {wallLabel.length > 0 && (
                <div className="flex flex-col gap-1.5 border-t border-b border-t-bureau-manila-light/60 border-b-bureau-manila-light/15 py-4 text-base leading-relaxed">
                  {wallLabel.map((line, i) => (
                    <span
                      key={i}
                      className={
                        i === 0
                          ? "font-semibold text-bureau-paper"
                          : i === wallLabel.length - 1 && wallLabel.length > 2
                            ? "text-bureau-manila-light/80"
                            : undefined
                      }
                    >
                      {line}
                    </span>
                  ))}
                </div>
              )}

              {bulletin.summary && (
                <p className="mt-5 mb-8 text-base leading-relaxed text-bureau-manila-light/90">
                  {bulletin.summary}
                </p>
              )}

              {accession.length > 0 && (
                <>
                  <h2 className="mb-2 flex items-center gap-3 font-typewriter text-tag font-normal uppercase tracking-label text-bureau-rust-ink">
                    <span aria-hidden="true" className="inline-block w-10 border-t border-bureau-rust-ink" />
                    Accession Record
                  </h2>
                  <dl className="border-t border-bureau-manila-light/15">
                    {accession.map((row) => (
                      <div
                        key={row._key}
                        className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3.5 border-b border-bureau-manila-light/15 py-2.5 sm:grid-cols-[8rem_minmax(0,1fr)]"
                      >
                        <dt className="pt-0.5 font-typewriter text-caption uppercase tracking-label text-bureau-manila-light/75">
                          {row.label}
                        </dt>
                        <dd className="text-sm leading-relaxed text-bureau-paper">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── The essay, with a margin column on wide screens ───────── */}
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <article className="font-sans text-base leading-relaxed text-foreground lg:max-w-2xl [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:my-6 [&_blockquote]:border-y [&_blockquote]:border-border [&_blockquote]:py-4 [&_blockquote]:font-display [&_blockquote]:text-xl [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:leading-tight [&_h3]:mt-12 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:leading-tight [&_li]:mb-2 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-5 [&_strong]:font-semibold [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-5">
          {bulletin.body && bulletin.body.length > 0 ? (
            <BulletinBody value={bulletin.body as PortableTextBlock[]} variant="specimen" />
          ) : (
            <p className="font-typewriter text-sm italic text-muted-foreground">
              Full specimen report not yet available.
            </p>
          )}
        </article>
      </div>

      {/* ── Plates ──────────────────────────────────────────────── */}
      {plates.length > 0 && (
        <section aria-labelledby="plates-heading" className="border-y border-border bg-muted/60">
          <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
            <h2 id="plates-heading" className="mb-6 font-display text-xl font-bold text-foreground">
              Plates
            </h2>
            <PlateGallery plates={viewerPlates} />
          </div>
        </section>
      )}

      {/* ── Curator's note: back on the ink ─────────────────────── */}
      {(noteParagraphs.length > 0 || status.length > 0) && (
        <section
          aria-labelledby="curators-note-heading"
          className="plate-stock plate-ink relative bg-bureau-ink text-bureau-manila-light paper-texture"
        >
          <div className="relative z-2 mx-auto max-w-3xl px-6 py-18">
            <h2
              id="curators-note-heading"
              className="mb-5 flex items-center gap-3.5 font-typewriter text-xs font-normal uppercase tracking-eyebrow text-bureau-rust-ink"
            >
              <span aria-hidden="true" className="inline-block w-14 border-t border-bureau-rust-ink" />
              Curator&apos;s Note
            </h2>
            {noteParagraphs.map((p, i) => (
              <p key={i} className="mb-4 text-xl leading-relaxed text-bureau-paper">
                {p}
              </p>
            ))}
            {status.length > 0 && (
              <dl className="mt-9 grid gap-x-6 gap-y-4 border-t border-dashed border-bureau-manila-light/30 pt-4 font-typewriter text-sm tracking-type sm:grid-cols-3">
                {status.map((item) => (
                  <div key={item._key}>
                    <dt className="mb-1 text-tag uppercase tracking-label text-bureau-manila-light/70">
                      {item.label}
                    </dt>
                    <dd className={item.emphasis ? "uppercase text-bureau-rust-ink" : "text-bureau-paper"}>
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>
      )}
    </>
  );
}
