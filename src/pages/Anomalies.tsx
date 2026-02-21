import { useState, useMemo, useEffect } from "react";
import { CasefileCard } from "@/components/CasefileCard";
import { CryptidCardSkeleton } from "@/components/CryptidCardSkeleton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LabelTape } from "@/components/EvidenceChip";
import { Search, X, Heart, Zap, Ghost, Skull, Eye, Volume2, Cloud, Clock, MapPinned, FolderOpen } from "lucide-react";
import { useAnomalies } from "@/hooks/use-sanity-anomalies";
import { useFavorites } from "@/hooks/use-favorites";
import { StructuredData, createWebSiteSchema } from "@/components/StructuredData";
import { analytics } from "@/lib/analytics";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { useSEO } from "@/hooks/use-seo";
import type { AnomalyType, AnomalyStatus, AnomalyRegion } from "@/types/sanity";

const INITIAL_VISIBLE = 6;
const LOAD_MORE_COUNT = 6;

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

const Anomalies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  // SEO
  useSEO({
    title: "Anomalies Desk | Appalachian Cryptid Compendium",
    description: "Lights, hauntings, curses, and other unresolved Appalachian incidents, cataloged like field reports.",
  });

  // Favorites hook
  const { favorites, count: favoritesCount } = useFavorites();

  // Fetch anomalies from Sanity
  const { data: anomalies = [], isLoading, error } = useAnomalies({
    anomalyType: selectedType,
    status: selectedStatus,
    region: selectedRegion,
    search: searchQuery,
  });

  // Filter anomalies
  const filteredAnomalies = useMemo(() => {
    let results = [...anomalies];

    // Filter by favorites if enabled
    if (showFavoritesOnly) {
      results = results.filter((anomaly) =>
        favorites.includes(`anomaly-${anomaly.slug?.current}` || "")
      );
    }

    if (!searchQuery) return results;

    const query = searchQuery.toLowerCase();
    return results.filter((anomaly) =>
      anomaly.name.toLowerCase().includes(query) ||
      anomaly.location.toLowerCase().includes(query) ||
      (anomaly.description?.toLowerCase().includes(query) ?? false)
    );
  }, [anomalies, searchQuery, showFavoritesOnly, favorites]);

  // Slice to only show visible count
  const visibleAnomalies = useMemo(() => {
    return filteredAnomalies.slice(0, visibleCount);
  }, [filteredAnomalies, visibleCount]);

  const hasMore = visibleCount < filteredAnomalies.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
    analytics.trackEvent("load_more_anomalies", {
      visible_count: visibleCount + LOAD_MORE_COUNT,
      total: filteredAnomalies.length,
    });
  };

  // Reset visible count when filters change
  const handleFilterChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setVisibleCount(INITIAL_VISIBLE);
  };

  // Track search queries
  useEffect(() => {
    if (searchQuery) {
      const timeout = setTimeout(() => {
        analytics.trackEvent("anomaly_search", {
          query: searchQuery,
          results: filteredAnomalies.length,
        });
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery, filteredAnomalies.length]);

  const anomalyTypes: { value: string; label: string; icon?: typeof Zap }[] = [
    { value: "all", label: "All Types" },
    { value: "Lights", label: "Lights", icon: Zap },
    { value: "Hauntings", label: "Hauntings", icon: Ghost },
    { value: "Curses", label: "Curses", icon: Skull },
    { value: "Omen Events", label: "Omen Events", icon: Eye },
    { value: "Sounds/Calls", label: "Sounds", icon: Volume2 },
    { value: "Weather Oddities", label: "Weather", icon: Cloud },
    { value: "Time Weirdness", label: "Time", icon: Clock },
    { value: "Places", label: "Places", icon: MapPinned },
  ];

  const statuses: { value: string; label: string }[] = [
    { value: "all", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Open File", label: "Open File" },
    { value: "Cold", label: "Cold" },
    { value: "Seasonal", label: "Seasonal" },
  ];

  const regions: { value: string; label: string }[] = [
    { value: "all", label: "All States" },
    { value: "TN", label: "Tennessee" },
    { value: "NC", label: "N. Carolina" },
    { value: "VA", label: "Virginia" },
    { value: "WV", label: "W. Virginia" },
    { value: "KY", label: "Kentucky" },
    { value: "GA", label: "Georgia" },
    { value: "SC", label: "S. Carolina" },
    { value: "AL", label: "Alabama" },
  ];

  // Count anomalies with favorites prefix
  const anomalyFavoritesCount = favorites.filter(f => f.startsWith("anomaly-")).length;

  return (
    <div className="min-h-screen bg-background paper-texture">
      <StructuredData type="website" data={createWebSiteSchema()} />
      <Header badge="Anomalies Desk" />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight font-display">
              Anomalies Desk
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A field guide to Appalachian phenomena
            </p>
            <p className="text-sm sm:text-base text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Lights, hauntings, curses, and other unresolved incidents from the mountains
              and hollers—cataloged from witness reports, local legends, and ongoing investigations.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section id="case-files" className="py-12 px-4 border-y border-border bg-card/50">
        <div className="container mx-auto">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                Browse the Case Files
              </div>
              <h3 className="text-2xl font-bold text-foreground">Find an Anomaly</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
                Search the Bureau's catalog of unexplained Appalachian phenomena.
                Filter by type, status, or region to narrow your investigation.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, location, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-background border-2 border-border focus:border-primary"
                />
              </div>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter self-center mr-2">
                Type:
              </span>
              {anomalyTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.value}
                    variant={selectedType === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange(setSelectedType, type.value)}
                    className={
                      selectedType === type.value
                        ? "bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }
                  >
                    {Icon && <Icon className="h-3 w-3 mr-1" />}
                    {type.label}
                  </Button>
                );
              })}
            </div>

            {/* Status & Region Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter self-center">
                  Status:
                </span>
                {statuses.map((status) => (
                  <Button
                    key={status.value}
                    variant={selectedStatus === status.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange(setSelectedStatus, status.value)}
                    className={
                      selectedStatus === status.value
                        ? "bg-secondary text-secondary-foreground"
                        : "border-border hover:border-secondary"
                    }
                  >
                    {status.label}
                  </Button>
                ))}
              </div>

              <div className="hidden md:block h-8 w-px bg-border" />

              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter self-center">
                  State:
                </span>
                {regions.slice(0, 5).map((region) => (
                  <Button
                    key={region.value}
                    variant={selectedRegion === region.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange(setSelectedRegion, region.value)}
                    className={
                      selectedRegion === region.value
                        ? "bg-accent text-accent-foreground"
                        : "border-border hover:border-accent"
                    }
                  >
                    {region.label}
                  </Button>
                ))}
              </div>

              <div className="hidden md:block h-8 w-px bg-border" />

              {/* Favorites Toggle */}
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setShowFavoritesOnly(!showFavoritesOnly);
                  setVisibleCount(INITIAL_VISIBLE);
                }}
                className={
                  showFavoritesOnly
                    ? "bg-destructive text-destructive-foreground"
                    : "border-border hover:border-destructive"
                }
                disabled={anomalyFavoritesCount === 0}
              >
                <Heart className={`h-4 w-4 mr-1 ${showFavoritesOnly ? "fill-current" : ""}`} />
                Saved ({anomalyFavoritesCount})
              </Button>
            </div>

            {/* Active Filter Chips */}
            {(selectedType !== "all" || selectedStatus !== "all" || selectedRegion !== "all" || searchQuery || showFavoritesOnly) && (
              <div className="flex flex-wrap gap-2 justify-center items-center">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-typewriter">Filing:</span>
                {showFavoritesOnly && (
                  <LabelTape onRemove={() => setShowFavoritesOnly(false)}>
                    Saved Files
                  </LabelTape>
                )}
                {selectedType !== "all" && (
                  <LabelTape onRemove={() => handleFilterChange(setSelectedType, "all")}>
                    {selectedType}
                  </LabelTape>
                )}
                {selectedStatus !== "all" && (
                  <LabelTape onRemove={() => handleFilterChange(setSelectedStatus, "all")}>
                    {selectedStatus}
                  </LabelTape>
                )}
                {selectedRegion !== "all" && (
                  <LabelTape onRemove={() => handleFilterChange(setSelectedRegion, "all")}>
                    {regions.find(r => r.value === selectedRegion)?.label || selectedRegion}
                  </LabelTape>
                )}
                {searchQuery && (
                  <LabelTape onRemove={() => setSearchQuery("")}>
                    "{searchQuery}"
                  </LabelTape>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("all");
                    setSelectedStatus("all");
                    setSelectedRegion("all");
                    setShowFavoritesOnly(false);
                    setVisibleCount(INITIAL_VISIBLE);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
                >
                  Clear Cabinet
                </Button>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground font-typewriter">
                {isLoading ? (
                  "Opening file cabinet..."
                ) : (
                  <>
                    Drawer contains <span className="text-primary font-bold">{filteredAnomalies.length}</span> case files
                    {visibleAnomalies.length < filteredAnomalies.length && (
                      <> · Viewing first <span className="text-primary font-bold">{visibleAnomalies.length}</span></>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Anomaly Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CryptidCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-xl text-destructive">Error loading case files. Please try again.</p>
            </div>
          ) : filteredAnomalies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No case files found matching your criteria.</p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Case files are added via Sanity CMS. Check back soon for new entries.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setSelectedStatus("all");
                  setSelectedRegion("all");
                  setVisibleCount(INITIAL_VISIBLE);
                }}
                variant="outline"
                className="mt-4 border-primary text-primary hover:bg-primary/10"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleAnomalies.map((anomaly) => (
                  <CasefileCard key={anomaly._id} type="anomaly" data={anomaly} />
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-10">
                  <Button
                    onClick={handleLoadMore}
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary/10 gap-2"
                  >
                    <FolderOpen className="h-4 w-4" />
                    Next Drawer
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 font-typewriter">
                    {filteredAnomalies.length - visibleCount} files remaining
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
              Email Newsletter
            </div>
            <h3 className="text-2xl font-bold text-foreground font-display">
              Get New Cryptid Alerts
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Sign up and we'll email you when new creatures are added to the guide
              or the Bureau has news to report.
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </section>

      <Footer variant="full" />
      <BackToTop />
    </div>
  );
};

export default Anomalies;
