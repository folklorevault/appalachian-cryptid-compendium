import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";
import type { SanityCryptidListItem } from "@/types/sanity";

interface FeaturedCryptidProps {
  cryptid: SanityCryptidListItem;
}

export function FeaturedCryptid({ cryptid }: FeaturedCryptidProps) {
  const {
    name,
    slug,
    scientificName,
    classification,
    location,
    description,
    gridImage,
    imageAlt,
    tags,
  } = cryptid;

  const imageUrl = gridImage
    ? urlFor(gridImage).width(272).height(392).fit("crop").quality(70).auto("format").url()
    : null;

  const blurUrl = gridImage
    ? urlFor(gridImage).width(20).height(28).blur(12).quality(30).auto("format").url()
    : null;

  return (
    <Link
      href={`/cryptid/${slug.current}`}
      className="group flex flex-col h-full rotate-[-0.35deg] motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-0.5"
      aria-label={`Read full case file for ${name}`}
    >
      {/* Die-cut folder tab */}
      <span className="case-folder-tab self-start font-typewriter text-[10px] tracking-[0.18em] uppercase text-bureau-ink dark:text-foreground">
        Case File <span aria-hidden="true">—</span> No. ACB-
        {slug.current.slice(0, 4).replace(/-+$/, "").toUpperCase()}
      </span>

      {/* Folder body */}
      <div className="case-folder flex-1 flex flex-col sm:flex-row gap-5 p-[22px] pb-[18px]">
        {/* Photo as paperclipped print */}
        <div className="relative flex-none self-center sm:self-start rotate-[1.6deg]">
          <div className="paper-clip" aria-hidden="true" />
          <div className="photo-mat">
            <div className="relative w-[136px] h-[196px] overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt || name}
                  fill
                  sizes="136px"
                  priority
                  placeholder="blur"
                  blurDataURL={blurUrl ?? undefined}
                  className="object-cover object-top sepia-light"
                />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-end justify-center pb-1">
                  <span className="font-typewriter text-[8px] uppercase tracking-widest text-muted-foreground text-center leading-tight">
                    Photo
                    <br />
                    Unavailable
                  </span>
                </div>
              )}
            </div>
          </div>
          {classification && (
            <span
              className="classification-stamp absolute -bottom-2.5 -right-4 z-[2]"
              aria-hidden="true"
            >
              <span style={{ filter: "url(#__svg-stamp-texture)" }}>
                {classification}
              </span>
            </span>
          )}
        </div>

        {/* Text column (relative so folder grain never overlays copy) */}
        <div className="relative z-[2] flex-1 min-w-0 flex flex-col">
          <h2 className="font-display font-bold text-[26px] leading-[1.05] text-foreground">
            {name}
          </h2>

          {scientificName && (
            <p className="font-serif italic text-[13px] text-bureau-ink-muted dark:text-muted-foreground mt-0.5">
              {scientificName}
            </p>
          )}

          {/* Catalog rows */}
          <dl className="font-typewriter text-[11px] mt-2 mb-2 border-t border-dotted border-foreground/30">
            <div className="flex gap-2 py-1 border-b border-dotted border-foreground/30">
              <dt className="uppercase tracking-type text-bureau-ink-muted dark:text-muted-foreground shrink-0 w-14">
                Region
              </dt>
              <dd className="text-foreground flex items-center gap-1 min-w-0 truncate">
                <MapPin className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
                <span className="truncate">{location}</span>
              </dd>
            </div>
            {tags && tags.length > 0 && (
              <div className="flex gap-2 py-1 border-b border-dotted border-foreground/30">
                <dt className="uppercase tracking-type text-bureau-ink-muted dark:text-muted-foreground shrink-0 w-14">
                  Class
                </dt>
                <dd className="text-foreground min-w-0 truncate">
                  {tags.slice(0, 3).join(" · ")}
                </dd>
              </div>
            )}
          </dl>

          {description && (
            <p className="font-sans text-[12.5px] text-foreground/85 leading-[1.6] line-clamp-3 mb-3">
              {description}
            </p>
          )}

          <span className="mt-auto self-start font-typewriter text-xs text-primary tracking-type border-b border-dotted border-primary/60 group-hover:border-solid">
            View Full Case File →
          </span>
        </div>
      </div>
    </Link>
  );
}
