import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";
import { LabelTape } from "@/components/EvidenceChip";
import type { SanityCryptidListItem, SanityAnomalyListItem } from "@/types/sanity";

type CasefileType = "cryptid" | "anomaly";

interface CasefileCardProps {
  type: CasefileType;
  data: SanityCryptidListItem | SanityAnomalyListItem;
  /** When true, loads image eagerly with high fetch priority (use for above-the-fold cards) */
  priority?: boolean;
}

export const CasefileCard = ({ type, data, priority = false }: CasefileCardProps) => {
  const {
    name,
    slug,
    location,
    description,
    gridImage,
  } = data;

  const region = data.region;

  const linkTo = type === "cryptid" ? `/cryptid/${slug.current}` : `/anomaly/${slug.current}`;

  if (!gridImage) {
    return null;
  }

  const imageUrl = urlFor(gridImage)
    .width(480)
    .height(480)
    .fit("crop")
    .quality(60)
    .auto("format")
    .url();

  const blurUrl = urlFor(gridImage).width(24).height(24).blur(12).quality(30).auto("format").url();

  // File number based on slug
  const fileNumber = `${slug.current?.slice(0, 3).toUpperCase() || 'UNK'}-${String(slug.current?.length || 0).padStart(3, '0')}`;

  return (
    <Link href={linkTo} className="group">
      <Card className="overflow-hidden border-2 border-border hover:border-bureau-border hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(42,42,42,0.1)] transition-all duration-200 ease-out cursor-pointer bg-card">
        {/* Image Section - Square aspect */}
        <div className="relative aspect-square overflow-hidden bg-muted border-b-4 border-border group-hover:border-bureau-border transition-colors duration-200">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 33vw"
            priority={priority}
            placeholder="blur"
            blurDataURL={blurUrl}
            className="object-cover object-top transition-all duration-500 group-hover:scale-105 sepia-light sepia-hover"
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
              <h3 className="text-xl font-bold text-foreground leading-tight truncate group-hover:text-[hsl(25,30%,12%)] transition-colors duration-200">
                {name}
              </h3>
            </div>
          </div>

          {/* Location with region chip */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span className="text-foreground truncate">{location}</span>
            {region && (
              <LabelTape className="ml-auto shrink-0">{region}</LabelTape>
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
