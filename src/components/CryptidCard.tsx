import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Eye } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import type { SanityCryptidListItem } from "@/types/sanity";

interface CryptidCardProps {
  cryptid: SanityCryptidListItem;
}

export const CryptidCard = ({ cryptid }: CryptidCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const {
    _id,
    name,
    slug,
    scientificName,
    location,
    dangerLevel,
    sightings,
    description,
    gridImage,
    imageAlt,
    tags,
  } = cryptid;

  // Responsive card image:
  // - Keep bytes low on mobile by using srcset/sizes
  // - Let Sanity serve modern formats via urlFor().auto('format') in src/lib/sanity.ts
  const cardWidths = [320, 420, 540] as const;

  // Only render if gridImage is available from Sanity
  if (!gridImage) {
    return null;
  }

  const imageUrl = urlFor(gridImage)
    .width(420)
    .height(630)
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

  // Low quality placeholder for blur-up effect
  const blurUrl = urlFor(gridImage).width(24).height(36).blur(12).quality(30).url();

  const getDangerColor = () => {
    switch (dangerLevel) {
      case "High":
        return "bg-destructive text-destructive-foreground";
      case "Medium":
        return "bg-secondary text-secondary-foreground";
      case "Low":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getAdvisoryLabel = () => {
    switch (dangerLevel) {
      case "High":
        return "Elevated";
      case "Medium":
        return "Moderate";
      case "Low":
        return "Low";
      default:
        return dangerLevel;
    }
  };

  return (
    <Link to={`/cryptid/${slug.current}`}>
      <Card className="overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg group cursor-pointer">
      <div className="relative aspect-[2/3] overflow-hidden bg-muted border-4 border-border group-hover:border-primary transition-colors duration-300">
        {/* Blur placeholder */}
        {!imageLoaded && (
          <img
            src={blurUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
          />
        )}
        <img
          src={imageUrl}
          srcSet={srcSet}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 420px"
          alt={imageAlt || name}
          loading="lazy"
          decoding="async"
          width="420"
          height="630"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 sepia-light sepia-hover ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute top-2 right-2">
          <Badge className={getDangerColor()}>Advisory: {getAdvisoryLabel()}</Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="border-b border-border pb-3">
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          {scientificName && (
            <p className="text-sm italic text-muted-foreground font-serif">{scientificName}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-foreground">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4 text-accent" />
            <span className="text-foreground">{sightings} Filed Reports</span>
          </div>
        </div>

        {description && (
          <div className="border-t border-border pt-3">
            <p className="text-sm text-foreground/80 leading-relaxed">{description}</p>
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
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
