import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Eye, Calendar } from "lucide-react";

interface CryptidCardProps {
  name: string;
  scientificName: string;
  location: string;
  lastSighting: string;
  dangerLevel: "Low" | "Medium" | "High";
  sightings: number;
  description: string;
  image: string;
  tags: string[];
}

interface CryptidCardWithIdProps extends CryptidCardProps {
  id: string;
}

export const CryptidCard = ({
  id,
  name,
  scientificName,
  location,
  lastSighting,
  dangerLevel,
  sightings,
  description,
  image,
  tags,
}: CryptidCardWithIdProps) => {
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
    <Link to={`/cryptid/${id}`}>
      <Card className="overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg group cursor-pointer">
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 sepia-light sepia-hover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={getDangerColor()}>Advisory: {getAdvisoryLabel()}</Badge>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="border-b border-border pb-3">
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          <p className="text-sm italic text-muted-foreground font-serif">{scientificName}</p>
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
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-secondary" />
            <span className="text-foreground">Most Recent: {lastSighting}</span>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <p className="text-sm text-foreground/80 leading-relaxed">{description}</p>
        </div>

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
      </CardContent>
    </Card>
    </Link>
  );
};