import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Eye, Calendar } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import { getStaticImagePath } from "@/lib/sanity-provider";
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
    lastSighting,
    dangerLevel,
    sightings,
    description,
    gridImage,
    imageAlt,
    tags,
  } = cryptid;

  // Get image URL - from Sanity if available, otherwise static fallback
  const imageUrl = gridImage
    ? urlFor(gridImage).width(600).height(900).url()
    : getStaticImagePath(slug.current, 'grid');

  // Low quality placeholder for blur-up effect (Sanity only)
  const blurUrl = gridImage
    ? urlFor(gridImage).width(20).height(30).blur(10).url()
    : undefined;

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
        {blurUrl && !imageLoaded && (
          <img
            src={blurUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
          />
        )}
        <img
          src={imageUrl}
          alt={imageAlt || name}
          loading="lazy"
          decoding="async"
          width="600"
          height="900"
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
          {lastSighting && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-secondary" />
              <span className="text-foreground">Most Recent: {lastSighting}</span>
            </div>
          )}
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
