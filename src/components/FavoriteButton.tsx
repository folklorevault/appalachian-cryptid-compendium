import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  slug: string;
  name: string;
  variant?: "overlay" | "inline";
  className?: string;
}

/**
 * Heart button for favoriting/bookmarking cryptids.
 * - "overlay" variant: Positioned in top-left corner of cards
 * - "inline" variant: Button with text for detail pages
 */
export const FavoriteButton = ({
  slug,
  name,
  variant = "overlay",
  className,
}: FavoriteButtonProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(slug);
    analytics.trackEvent(favorited ? "unfavorite" : "favorite", {
      cryptid: name,
    });
  };

  if (variant === "overlay") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "absolute top-2 left-2 p-2 rounded-full",
          "bg-background/80 backdrop-blur-sm",
          "hover:bg-background hover:scale-110",
          "transition-all duration-200 z-10",
          "focus:outline-none focus:ring-2 focus:ring-primary",
          className
        )}
        aria-label={favorited ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors",
            favorited
              ? "fill-destructive text-destructive"
              : "text-muted-foreground hover:text-destructive"
          )}
        />
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={cn("gap-2", className)}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          favorited && "fill-destructive text-destructive"
        )}
      />
      {favorited ? "Saved" : "Save"}
    </Button>
  );
};
