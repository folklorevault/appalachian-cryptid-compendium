import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import type {
  AnomalyType,
  SanityAnomalyListItem,
  SanityHomepageAnomaliesDesk,
} from "@/types/sanity";

interface AnomaliesDeskBandProps {
  desk: SanityHomepageAnomaliesDesk;
  anomalies: SanityAnomalyListItem[];
}

/**
 * Homepage band for the Anomalies Desk: an ink plate (same stock as the
 * sightings-map frame) that introduces the desk in large type, lists what it
 * holds, then features one anomaly. Copy and the featured file are edited in
 * the "Homepage: Anomalies Desk" singleton in Sanity.
 */
export function AnomaliesDeskBand({ desk, anomalies }: AnomaliesDeskBandProps) {
  const paragraphs = desk.intro
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Register: anomalies grouped by type, largest group first.
  const groups = new Map<AnomalyType, SanityAnomalyListItem[]>();
  for (const a of anomalies) {
    groups.set(a.anomalyType, [...(groups.get(a.anomalyType) ?? []), a]);
  }
  const register = [...groups.entries()].sort(
    ([aType, a], [bType, b]) => b.length - a.length || aType.localeCompare(bType)
  );

  return (
    <section
      className="relative overflow-hidden border-b border-border bg-bureau-ink text-bureau-manila-light paper-texture"
      aria-labelledby="anomalies-desk-heading"
    >
      <div className="relative z-[2] max-w-6xl mx-auto px-6 lg:px-8 pt-12 pb-12 lg:pt-16 lg:pb-14">
        <p className="flex items-center gap-3.5 mb-4.5 font-typewriter text-xs tracking-eyebrow uppercase text-bureau-rust-ink">
          <span className="block w-10 h-px bg-current opacity-70" aria-hidden="true" />
          {desk.eyebrow}
        </p>

        {/* ── The desk ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-14 lg:items-end">
          <div>
            <h2
              id="anomalies-desk-heading"
              className="font-display font-bold text-plate leading-none tracking-tight text-bureau-paper text-balance max-w-[14ch] mb-6"
            >
              {desk.headline}
            </h2>

            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-sans text-base leading-[1.7] text-bureau-manila-light/90 max-w-[54ch] mb-3.5"
              >
                {p}
              </p>
            ))}

            {desk.typedLine && (
              <p className="font-typewriter text-sm tracking-type max-w-[54ch] mb-3.5">
                {desk.typedLine}
              </p>
            )}

            {anomalies.length > 0 && (
              <p className="mt-5 mb-5.5 pt-3.5 max-w-[54ch] border-t border-dashed border-bureau-manila-light/30 font-typewriter text-sm tracking-type">
                <span className="font-display font-bold text-2xl text-bureau-rust mr-1 tabular-nums">
                  {anomalies.length}
                </span>{" "}
                {anomalies.length === 1 ? "anomaly" : "anomalies"} currently under
                investigation.
                {desk.countSuffix && (
                  <span className="text-bureau-manila-light/70"> {desk.countSuffix}</span>
                )}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5">
              <Link
                href="/anomalies"
                className="stamp-btn text-xs sm:text-sm px-5.5 py-3 text-bureau-rust-ink"
                style={{ "--stamp-rot": "-1.5deg" } as React.CSSProperties}
              >
                <span style={{ filter: "url(#__svg-stamp-texture)" }}>
                  {desk.buttonLabel}
                  <span aria-hidden="true">{"\u00A0→"}</span>
                </span>
              </Link>
              {desk.briefingBulletin?.slug?.current && (
                <Link
                  href={`/bulletin/${desk.briefingBulletin.slug.current}`}
                  className="font-typewriter text-xs tracking-type text-bureau-manila-light border-b border-dotted border-bureau-manila-light/60 hover:border-solid"
                >
                  What is the Anomalies Desk?
                </Link>
              )}
            </div>
          </div>

          {register.length > 0 && (
            <nav aria-label="Anomalies on the desk, by type">
              <p className="font-typewriter text-tag tracking-label uppercase text-bureau-manila-light/70 mb-2">
                On the desk
              </p>
              <ul className="border-t border-bureau-manila-light/30">
                {register.map(([type, items]) => (
                  <li
                    key={type}
                    className="flex items-baseline justify-between gap-3 py-2.5 border-b border-bureau-manila-light/20"
                  >
                    <div className="min-w-0">
                      <p className="font-typewriter text-sm tracking-type uppercase">
                        {type.replace("/", " / ")}
                      </p>
                      <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        {items.map((a) => (
                          <li key={a._id}>
                            <Link
                              href={`/anomaly/${a.slug.current}`}
                              className="font-typewriter text-xs tracking-type text-bureau-manila-light/80 border-b border-dotted border-bureau-manila-light/45 hover:text-bureau-manila-light hover:border-solid"
                            >
                              {a.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="font-display font-bold text-3xl leading-none text-bureau-rust tabular-nums">
                      <span aria-hidden="true">{items.length}</span>
                      <span className="sr-only">{items.length} on file</span>
                    </span>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {desk.featuredAnomaly && (
          <>
            <div
              className="flex items-center gap-4 mt-12 mb-8 text-bureau-manila-light/70"
              aria-hidden="true"
            >
              <span className="flex-1 border-t border-dashed border-bureau-manila-light/30" />
              <span className="font-typewriter text-tag tracking-eyebrow uppercase whitespace-nowrap">
                Featured from the desk
              </span>
              <span className="flex-1 border-t border-dashed border-bureau-manila-light/30" />
            </div>
            <FeaturedAnomaly desk={desk} anomaly={desk.featuredAnomaly} />
          </>
        )}
      </div>
    </section>
  );
}

function FeaturedAnomaly({
  desk,
  anomaly,
}: {
  desk: SanityHomepageAnomaliesDesk;
  anomaly: SanityAnomalyListItem;
}) {
  const source = desk.featureImage?.asset
    ? desk.featureImage
    : anomaly.gridImage ?? anomaly.image;
  const alt = (desk.featureImage?.asset && desk.featureImage.alt) || anomaly.imageAlt || anomaly.name;
  const imageUrl = source
    ? urlFor(source).width(560).height(747).fit("crop").quality(70).url()
    : null;
  const blurUrl = source
    ? urlFor(source).width(18).height(24).blur(12).quality(30).url()
    : null;

  const headline = desk.featureHeadline || anomaly.name;
  const blurb = desk.featureBlurb || anomaly.description;
  const rules = desk.featureRules?.filter(Boolean) ?? [];

  return (
    <Link
      href={`/anomaly/${anomaly.slug.current}`}
      className="group grid grid-cols-1 gap-7 md:grid-cols-[280px_minmax(0,1fr)] md:gap-11 md:items-center"
      aria-label={`Read the full anomaly file for ${anomaly.name}`}
    >
      <div className="relative w-full max-w-[220px] md:max-w-[280px]">
        <div className="aspect-3/4 max-w-full border border-bureau-manila-light/35 p-1.5">
          <div className="relative h-full w-full overflow-hidden bg-bureau-ink-dark">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={alt}
                fill
                sizes="(min-width: 768px) 280px, 220px"
                placeholder="blur"
                blurDataURL={blurUrl ?? undefined}
                className="object-cover sepia-light motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
              />
            ) : (
              <span className="absolute inset-0 flex items-end justify-center pb-2 font-typewriter text-tag uppercase tracking-widest text-bureau-manila-light/60">
                Photo unavailable
              </span>
            )}
          </div>
        </div>
        <span
          className="absolute -right-3.5 bottom-6 -rotate-8 rounded-[3px] border-[2.5px] border-current bg-bureau-ink/70 px-2 py-1 font-typewriter text-caption font-bold uppercase tracking-[0.16em] text-bureau-rust-ink"
          aria-hidden="true"
        >
          <span style={{ filter: "url(#__svg-stamp-texture)" }}>{anomaly.status}</span>
        </span>
      </div>

      <div className="min-w-0">
        <p className="font-typewriter text-xs tracking-label uppercase text-bureau-rust-ink mb-3">
          {anomaly.anomalyType.replace("/", " / ")}
        </p>
        <h3 className="font-display font-bold text-hero leading-[1.02] text-bureau-paper text-balance mb-4">
          {headline}
          {desk.featureHeadline && desk.featureHeadlineEmphasis && (
            <>
              {" "}
              <span className="text-bureau-rust">{desk.featureHeadlineEmphasis}</span>
            </>
          )}
        </h3>
        {desk.featureHeadline && (
          <p className="font-typewriter text-sm tracking-eyebrow uppercase mb-3">
            {anomaly.name}
          </p>
        )}
        {blurb && (
          <p className="font-sans text-[15px] leading-[1.7] text-bureau-manila-light/90 max-w-[56ch] mb-4.5 line-clamp-4">
            {blurb}
          </p>
        )}
        {rules.length > 0 && (
          <ol className="grid gap-1.5 mb-5.5 font-typewriter text-sm tracking-type">
            {rules.map((rule, i) => (
              <li key={i} className="flex gap-3.5">
                <span className="min-w-[62px] text-bureau-rust-ink">Rule {i + 1}</span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        )}
        <span className="font-typewriter text-sm tracking-type border-b border-dotted border-bureau-manila-light/70 group-hover:border-solid">
          Read the full file →
        </span>
      </div>
    </Link>
  );
}
