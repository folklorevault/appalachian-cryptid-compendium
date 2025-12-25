import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Skeleton loading state for CryptidDetail page.
 * Matches the layout of the actual detail page for a smooth transition.
 */
export const CryptidDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-background paper-texture">
      <Header badge="Case File" />

      {/* Back Button Skeleton */}
      <div className="container mx-auto px-4 py-4">
        <div className="h-10 w-40 bg-muted-foreground/10 rounded animate-pulse" />
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Hero Image & Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
          {/* Image Skeleton */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted animate-pulse">
            <div className="absolute top-4 right-4 h-6 w-28 bg-muted-foreground/20 rounded" />
            <div className="absolute bottom-4 left-4 h-16 w-24 bg-muted-foreground/20 rounded rotate-[-8deg]" />
          </div>

          {/* Info Skeleton */}
          <div className="space-y-6">
            {/* Case File Number */}
            <div>
              <div className="h-3 w-32 bg-muted-foreground/20 rounded animate-pulse mb-3" />
              <div className="h-10 w-3/4 bg-muted-foreground/20 rounded animate-pulse mb-2" />
              <div className="h-5 w-1/2 bg-muted-foreground/10 rounded animate-pulse" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-muted-foreground/20 rounded animate-pulse mt-1" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-24 bg-muted-foreground/10 rounded animate-pulse" />
                    <div className="h-4 w-40 bg-muted-foreground/20 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-6 bg-muted-foreground/10 rounded animate-pulse"
                  style={{ width: `${60 + i * 20}px` }}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border">
              <div className="h-9 w-20 bg-muted-foreground/10 rounded animate-pulse" />
              <div className="h-8 w-32 bg-muted-foreground/10 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Detail Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-2 border-border">
              <CardContent className="p-6 space-y-3">
                <div className="h-3 w-32 bg-muted-foreground/20 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted-foreground/10 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-muted-foreground/10 rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-muted-foreground/10 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonies Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted-foreground/20 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="border-2 border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="h-4 w-32 bg-muted-foreground/10 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-muted-foreground/10 rounded animate-pulse" />
                    <div className="h-4 w-28 bg-muted-foreground/10 rounded animate-pulse" />
                  </div>
                  <div className="border-l-2 border-muted-foreground/20 pl-4 space-y-2">
                    <div className="h-4 w-full bg-muted-foreground/10 rounded animate-pulse" />
                    <div className="h-4 w-11/12 bg-muted-foreground/10 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-muted-foreground/10 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
