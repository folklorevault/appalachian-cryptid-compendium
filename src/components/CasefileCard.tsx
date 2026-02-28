"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import { LabelTape } from "@/components/EvidenceChip";
import type { SanityCryptidListItem, SanityAnomalyListItem } from "@/types/sanity";

type CasefileType = "cryptid" | "anomaly";

interface CasefileCardProps {
  type: CasefileType;
  data: SanityCryptidListItem | SanityAnomalyListItem;
  /** When true, loads image eagerly with high fetch priority (use for above-the-fold cards) */
  priority?: boolean;
}

// Type guard for cryptid
function isCryptid(data: SanityCryptidListItem | SanityAnomalyListItem): data is SanityCryptidListItem {
  return 'dangerLevel' in data;
}

// Type guard for anomaly
function isAnomaly(data: SanityCryptidListItem | SanityAnomalyListItem): data is SanityAnomalyListItem {
  return 'anomalyType' in data;
}

export const CasefileCard = ({ type, data, priority = false }: CasefileCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the image loaded before React hydrated, onLoad never fires.
  // Check img.complete on mount to catch this race condition.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, []);

  const {
    name,
    slug,
    location,
    description,
    gridImage,
  } = data;

  const region = isCryptid(data) ? data.region : isAnomaly(data) ? data.region : '';

  // Determine link and favorite slug
  const linkTo = type === "cryptid" ? `/cryptid/${slug.current}` : `/anomaly/${slug.current}`;
  const cardWidths = [320, 400, 480] as const;

  if (!gridImage) {
    return null;
  }

  const imageUrl = urlFor(gridImage)
    .width(400)
    .height(400)
    .fit("crop")
    .quality(60)
    .url();

  const srcSet = cardWidths
    .map((w) => {
      const u = urlFor(gridImage)
        .width(w)
        .height(w)
        .fit("crop")
        .quality(60)
        .url();
      return `${u} ${w}w`;
    })
    .join(", ");

  const blurUrl = urlFor(gridImage).width(24).height(24).blur(12).quality(30).url();

  // File number based on slug
  const fileNumber = `${slug.current?.slice(0, 3).toUpperCase() || 'UNK'}-${String(slug.current?.length || 0).padStart(3, '0')}`;

  return (
    <Link href={linkTo} className="group">
      <Card className="overflow-hidden border-2 border-border hover:border-[hsl(var(--bureau-border))] hover:-translate-y-[3px] hover:shadow-[0_6px_20px_rgba(42,42,42,0.12)] transition-all duration-200 ease-out cursor-pointer bg-card">
        {/* Image Section - Square aspect */}
        <div className="relative aspect-square overflow-hidden bg-muted border-b-4 border-border group-hover:border-[hsl(var(--bureau-border))] transition-colors duration-200">
          {/* Blur placeholder */}
          {!imageLoaded && (
            <img
              src={blurUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-top scale-110 blur-sm"
            />
          )}
          <img
            ref={imgRef}
            src={imageUrl}
            srcSet={srcSet}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 33vw"
            alt={name}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : undefined}
            width="400"
            height="400"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 sepia-light sepia-hover ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* File number - bottom left */}
          <div className="absolute bottom-2 left-2">
            <LabelTape>FILE {fileNumber}</LabelTape>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-4 space-y-3">
          {/* Header with case type indicator */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-1">
                {type === "cryptid" ? "Creature File" : "Case File"}
              </div>
              <h3 className="text-xl font-bold text-foreground leading-tight truncate group-hover:text-[hsl(var(--bureau-ink))] transition-colors duration-200">
                {name}
              </h3>
            </div>
          </div>

          {/* Location with region chip */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-foreground truncate">{location}</span>
            {region && (
              <LabelTape className="ml-auto flex-shrink-0">{region}</LabelTape>
            )}
          </div>

          {/* Excerpt */}
          {description && (
            <p className="text-sm text-foreground/70 leading-relaxed line-clamp-2">
              {description}
            </p>
          )}

          {/* View Casefile CTA */}
          <div className="pt-2 border-t border-border">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
              View casefile
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
