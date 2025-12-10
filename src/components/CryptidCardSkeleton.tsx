import { Card, CardContent } from "@/components/ui/card";

export const CryptidCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-2 border-border">
      <div className="relative aspect-[2/3] overflow-hidden bg-muted border-4 border-border animate-pulse">
        <div className="absolute top-2 right-2 h-6 w-24 bg-muted-foreground/20 rounded" />
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="border-b border-border pb-3 space-y-2">
          <div className="h-6 w-3/4 bg-muted-foreground/20 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-muted-foreground/10 rounded animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted-foreground/20 rounded animate-pulse" />
            <div className="h-4 w-32 bg-muted-foreground/20 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted-foreground/20 rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted-foreground/20 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted-foreground/20 rounded animate-pulse" />
            <div className="h-4 w-28 bg-muted-foreground/20 rounded animate-pulse" />
          </div>
        </div>

        <div className="border-t border-border pt-3 space-y-2">
          <div className="h-4 w-full bg-muted-foreground/10 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-muted-foreground/10 rounded animate-pulse" />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <div className="h-5 w-16 bg-muted-foreground/10 rounded animate-pulse" />
          <div className="h-5 w-20 bg-muted-foreground/10 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
};
