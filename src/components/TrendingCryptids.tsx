import { Link } from "react-router-dom";
import { Flame, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTrending } from "@/hooks/use-trending";

/**
 * Displays the top trending cryptids based on view analytics.
 * Shows a horizontal list with fire icons for popular cryptids.
 */
export const TrendingCryptids = () => {
  const { data: trending = [], isLoading, error } = useTrending();

  // Don't show section if no data or error
  if (isLoading || error || trending.length === 0) {
    return null;
  }

  return (
    <div className="py-6 px-4 border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-typewriter">
            Trending This Week
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {trending.map((item, index) => (
            <Link
              key={item.cryptid}
              to={`/cryptid/${item.cryptid}`}
              className="group"
            >
              <Badge
                variant="outline"
                className="px-3 py-2 text-sm border-2 border-border hover:border-accent hover:bg-accent/10 transition-all duration-200"
              >
                <span className="flex items-center gap-1">
                  {index === 0 && <Flame className="h-4 w-4 text-destructive" />}
                  <span className="font-medium text-foreground group-hover:text-accent capitalize">
                    {item.cryptid.replace(/-/g, " ")}
                  </span>
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
