import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, Ghost, Skull, Eye, Volume2, Cloud, Clock, MapPinned } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import { getAnomalyStatusColor } from "@/lib/caseUtils";
import type { SanityAnomalyListItem, AnomalyType } from "@/types/sanity";

interface AnomalyCardProps {
  anomaly: SanityAnomalyListItem;
}

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

  if (!gridImage) {
    return null;
  }

  const imageUrl = urlFor(gridImage)
    .width(480)
    .height(720)
    .fit("crop")
    .quality(60)
    .auto("format")
    .url();

  const blurUrl = urlFor(gridImage).width(24).height(36).blur(12).quality(30).auto("format").url();

  const TypeIcon = typeIcons[anomalyType] || Zap;

  return (
    <Link href={`/anomaly/${slug.current}`}>
      <Card className="overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg group cursor-pointer">
        <div className="relative aspect-2/3 overflow-hidden bg-muted border-4 border-border group-hover:border-primary transition-colors duration-300">
          <Image
            src={imageUrl}
            alt={imageAlt || name}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 33vw"
            placeholder="blur"
            blurDataURL={blurUrl}
            className="object-cover object-top transition-all duration-500 group-hover:scale-110 sepia-light sepia-hover"
          />
          <div className="absolute top-2 right-2">
            <Badge className={getAnomalyStatusColor(status)}>{status}</Badge>
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-xs border-primary/50">
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
