import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/lib/sanity/image";
import type { SanityCryptidListItem } from "@/types/sanity";

interface FeaturedCryptidProps {
  cryptid: SanityCryptidListItem;
}

export function FeaturedCryptid({ cryptid }: FeaturedCryptidProps) {
  const { name, slug, location, description, gridImage, imageAlt, tags } = cryptid;

  const imageUrl = gridImage
    ? urlFor(gridImage).width(280).height(380).fit("crop").quality(70).auto("format").url()
    : null;

  const blurUrl = gridImage
    ? urlFor(gridImage).width(20).height(28).blur(12).quality(30).auto("format").url()
    : null;

  return (
    <Link
      href={`/cryptid/${slug.current}`}
      className="group block bg-card border-2 border-foreground/70 rounded-sm overflow-hidden h-full flex flex-col shadow-[2px_2px_0_hsl(var(--foreground)/0.15)] hover:shadow-[3px_3px_0_hsl(var(--foreground)/0.2)] transition-shadow"
      aria-label={`Read full case file for ${name}`}
    >
      {/* Catalog tab */}
      <div className="bg-bureau-manila border-b-2 border-foreground/70 px-4 py-1.5 flex items-baseline justify-between gap-3">
        <span className="font-typewriter text-[10px] tracking-[0.18em] uppercase text-bureau-ink">
          Case File
        </span>
        <span className="font-typewriter text-[10px] tracking-[0.15em] uppercase text-bureau-ink-muted">
          No. ACB-{slug.current.slice(0, 4).toUpperCase()}
        </span>
      </div>

      {/* Body */}
      <div className="flex gap-4 p-4 flex-1">
        {/* Image */}
        <div className="shrink-0 w-[120px]">
          <div className="relative aspect-[2/3] overflow-hidden border border-foreground/40 sepia-light">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt || name}
                fill
                sizes="120px"
                placeholder="blur"
                blurDataURL={blurUrl ?? undefined}
                className="object-cover object-top"
              />
            ) : (
              <div className="absolute inset-0 bg-muted flex items-end justify-center pb-1">
                <span className="font-typewriter text-[8px] uppercase tracking-widest text-muted-foreground text-center leading-tight">
                  Photo<br />Unavailable
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h2 className="font-display font-bold text-xl text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">
            {name}
          </h2>

          {/* Catalog rows */}
          <dl className="font-typewriter text-[11px] mb-2 border-t border-dotted border-foreground/25">
            <div className="flex gap-2 py-1 border-b border-dotted border-foreground/25">
              <dt className="uppercase tracking-wider text-bureau-ink-muted shrink-0 w-14">
                Region
              </dt>
              <dd className="text-foreground flex items-center gap-1 min-w-0 truncate">
                <MapPin className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
                <span className="truncate">{location}</span>
              </dd>
            </div>
            {tags && tags.length > 0 && (
              <div className="flex gap-2 py-1 border-b border-dotted border-foreground/25">
                <dt className="uppercase tracking-wider text-bureau-ink-muted shrink-0 w-14">
                  Class
                </dt>
                <dd className="flex flex-wrap gap-1">
                  {tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[9px] py-0 px-1.5 border-primary/40 text-primary font-typewriter tracking-wider"
                    >
                      {tag}
                    </Badge>
                  ))}
                </dd>
              </div>
            )}
          </dl>

          {description && (
            <p className="font-sans text-xs text-foreground/85 leading-relaxed line-clamp-3 mb-3">
              {description}
            </p>
          )}

          <span className="mt-auto font-typewriter text-xs text-primary tracking-wider group-hover:underline">
            View Full Case File →
          </span>
        </div>
      </div>
    </Link>
  );
}
