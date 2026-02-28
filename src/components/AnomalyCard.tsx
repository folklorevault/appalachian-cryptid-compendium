"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, Ghost, Skull, Eye, Volume2, Cloud, Clock, MapPinned } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import type { SanityAnomalyListItem, AnomalyType, AnomalyStatus } from "@/types/sanity";

interface AnomalyCardProps {
  anomaly: SanityAnomalyListItem;
}

// Icon mapping for anomaly types
const typeIcons: Record<AnomalyType, typeof Zap> = {
  'Lights': Zap,
  'Hauntings': Ghost,
  'Curses': Skull,
  'Omen Events': Eye,
  'Sounds/Calls': Volume2,
  'Weather Oddities': Cloud,
  'Time Weirdness': Clock,
  'Places': MapPinned,
};

export const AnomalyCard = ({ anomaly }: AnomalyCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const {
    name,
    slug,
    location,
    anomalyType,
    status,
    description,
    gridImage,
    imageAlt,
    tags,
  } = anomaly;

  const cardWidths = [320, 400, 480] as const;

  // Only render if gridImage is available from Sanity
  if (!gridImage) {
    return null;
  }

  const imageUrl = urlFor(gridImage)
    .width(400)
    .height(600)
    .fit("crop")
    .quality(60)
    .url();

  const srcSet = cardWidths
    .map((w) => {
      const h = Math.round(w * 1.5); // 2:3 aspect
      const u = urlFor(gridImage)
        .width(w)
        .height(h)
        .fit("crop")
        .quality(60)
        .url();
      return `${u} ${w}w`;
    })
    .join(", ");

  const blurUrl = urlFor(gridImage).width(24).height(36).blur(12).quality(30).url();

  const getStatusColor = (caseStatus: AnomalyStatus) => {
    switch (caseStatus) {
      case "Active":
        return "bg-destructive text-destructive-foreground";
      case "Open File":
        return "bg-secondary text-secondary-foreground";
      case "Cold":
        return "bg-muted text-muted-foreground";
      case "Seasonal":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const TypeIcon = typeIcons[anomalyType] || Zap;

  return (
    <Link href={`/anomaly/${slug.current}`}>
      <Card className="overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg group cursor-pointer">
        <div className="relative aspect-[2/3] overflow-hidden bg-muted border-4 border-border group-hover:border-primary transition-colors duration-300">
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
            src={imageUrl}
            srcSet={srcSet}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 33vw"
            alt={imageAlt || name}
            loading="lazy"
            decoding="async"
            width="400"
            height="600"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-110 sepia-light sepia-hover ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className="absolute top-2 right-2">
            <Badge className={getStatusColor(status)}>{status}</Badge>
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-primary/50">
              <TypeIcon className="h-3 w-3 mr-1" />
              {anomalyType}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="border-b border-border pb-3">
            <h3 className="text-xl font-bold text-foreground font-display">{name}</h3>
            <p className="text-sm text-muted-foreground font-typewriter uppercase tracking-wide">
              Case File
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-foreground">{location}</span>
          </div>

          {description && (
            <div className="border-t border-border pt-3">
              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{description}</p>
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs border-primary/30 text-primary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
