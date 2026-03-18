import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import { getDangerLevelColor, getDangerLevelLabel } from "@/lib/caseUtils";
import type { SanityCryptidListItem } from "@/types/sanity";

interface CryptidCardProps {
  cryptid: SanityCryptidListItem;
}

export const CryptidCard = ({ cryptid }: CryptidCardProps) => {
  const {
    name,
    slug,
    scientificName,
    location,
    dangerLevel,
    description,
    gridImage,
    imageAlt,
    tags,
  } = cryptid;

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

  return (
    <Link href={`/cryptid/${slug.current}`}>
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
          <Badge className={getDangerLevelColor(dangerLevel)}>Advisory: {getDangerLevelLabel(dangerLevel)}</Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="border-b border-border pb-3">
          <h3 className="text-xl font-bold text-foreground font-display">{name}</h3>
          {scientificName && (
            <p className="text-sm italic text-muted-foreground font-serif">{scientificName}</p>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-foreground">{location}</span>
        </div>

        {description && (
          <div className="border-t border-border pt-3">
            <p className="text-sm text-foreground/80 leading-relaxed">{description}</p>
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
