import { useState, useMemo, useEffect } from "react";
import { CasefileCard } from "@/components/CasefileCard";
import { CryptidCardSkeleton } from "@/components/CryptidCardSkeleton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { TrendingCryptids } from "@/components/TrendingCryptids";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LabelTape } from "@/components/EvidenceChip";
import { Search, X, Heart, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useCryptids } from "@/hooks/use-sanity-cryptids";
import { useFavorites } from "@/hooks/use-favorites";
import { StructuredData, createWebSiteSchema } from "@/components/StructuredData";
import { analytics } from "@/lib/analytics";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const INITIAL_VISIBLE = 6;
const LOAD_MORE_COUNT = 6;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedDanger, setSelectedDanger] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  // Favorites hook
  const { favorites, count: favoritesCount } = useFavorites();

  // Fetch cryptids from Sanity (or static fallback)
  const { data: cryptids = [], isLoading, error } = useCryptids({
    region: selectedRegion,
    dangerLevel: selectedDanger,
    search: searchQuery,
  });

  // Sort cryptids with Mothman pinned to top, then filter
  const filteredCryptids = useMemo(() => {
    // Pin Mothman to the top
    let sorted = [...cryptids].sort((a, b) => {
      const aIsMothman = a.slug?.current === "mothman" || a.name.toLowerCase() === "mothman";
      const bIsMothman = b.slug?.current === "mothman" || b.name.toLowerCase() === "mothman";
      if (aIsMothman && !bIsMothman) return -1;
      if (bIsMothman && !aIsMothman) return 1;
      return 0;
    });

    // Filter by favorites if enabled
    if (showFavoritesOnly) {
      sorted = sorted.filter((cryptid) =>
        favorites.includes(cryptid.slug?.current || "")
      );
    }

    if (!searchQuery) return sorted;

    const query = searchQuery.toLowerCase();
    return sorted.filter((cryptid) =>
      cryptid.name.toLowerCase().includes(query) ||
      cryptid.location.toLowerCase().includes(query) ||
      (cryptid.description?.toLowerCase().includes(query) ?? false)
    );
  }, [cryptids, searchQuery, showFavoritesOnly, favorites]);

  // Slice to only show visible count
  const visibleCryptids = useMemo(() => {
    return filteredCryptids.slice(0, visibleCount);
  }, [filteredCryptids, visibleCount]);

  const hasMore = visibleCount < filteredCryptids.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
    analytics.trackEvent("load_more_cryptids", {
      visible_count: visibleCount + LOAD_MORE_COUNT,
      total: filteredCryptids.length,
    });
  };

  // Reset visible count when filters change
  const handleFilterChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setVisibleCount(INITIAL_VISIBLE);
  };

  // Track search queries (with debounce)
  useEffect(() => {
    if (searchQuery) {
      const timeout = setTimeout(() => {
        analytics.trackEvent("search", {
          query: searchQuery,
          results: filteredCryptids.length,
        });
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery, filteredCryptids.length]);

  // Track filter usage
  useEffect(() => {
    if (selectedRegion !== "all" || selectedDanger !== "all") {
      analytics.trackEvent("filter_applied", {
        region: selectedRegion,
        danger: selectedDanger,
        results: filteredCryptids.length,
      });
    }
  }, [selectedRegion, selectedDanger, filteredCryptids.length]);

  const regions = [
    { value: "all", label: "All Regions" },
    { value: "Appalachia", label: "Appalachia" },
    { value: "Southeast", label: "Southeast" },
    { value: "Southern", label: "Southern" },
  ];

  const dangerLevels = [
    { value: "all", label: "All Threats" },
    { value: "Low", label: "Low Threat" },
    { value: "Medium", label: "Medium Threat" },
    { value: "High", label: "High Threat" },
  ];

  return (
    <div className="min-h-screen bg-background paper-texture">
      <StructuredData type="website" data={createWebSiteSchema()} />
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight font-display">
              Appalachian Cryptids List
              <br />
              <span className="text-primary">Field Guide</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Creatures of the Mountains & American South
            </p>
            <p className="text-sm sm:text-base text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
              A field guide to the creatures that haunt the ridgelines, backroads, and hollers
              of the Appalachian Mountains and American South—compiled from witness reports,
              local legends, and ongoing research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <a href="#field-guide">Explore the Guide</a>
              </Button>
              <Link to="/report">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/10"
                >
                  Report a Sighting
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Cryptids */}
      <TrendingCryptids />

      {/* Filter & Search Section */}
      <section id="field-guide" className="py-12 px-4 border-y border-border bg-card/50">
        <div className="container mx-auto">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                Browse the Collection
              </div>
              <h3 className="text-2xl font-bold text-foreground">Find a Creature</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
                Browse the Bureau's working list of Appalachian cryptids, monsters, and strange creatures.
                Use the search bar and filters to find case files by name, location, or threat level.
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

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter self-center">
                  Region:
                </span>
                {regions.map((region) => (
                  <Button
                    key={region.value}
                    variant={selectedRegion === region.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange(setSelectedRegion, region.value)}
                    className={
                      selectedRegion === region.value
                        ? "bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }
                  >
                    {region.label}
                  </Button>
                ))}
              </div>

              <div className="hidden md:block h-8 w-px bg-border" />

              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter self-center">
                  Threat:
                </span>
                {dangerLevels.map((level) => (
                  <Button
                    key={level.value}
                    variant={selectedDanger === level.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange(setSelectedDanger, level.value)}
                    className={
                      selectedDanger === level.value
                        ? "bg-secondary text-secondary-foreground"
                        : "border-border hover:border-secondary"
                    }
                  >
                    {level.label}
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
                disabled={favoritesCount === 0}
              >
                <Heart className={`h-4 w-4 mr-1 ${showFavoritesOnly ? "fill-current" : ""}`} />
                Saved ({favoritesCount})
              </Button>
            </div>

            {/* Active Filter Chips */}
            {(selectedRegion !== "all" || selectedDanger !== "all" || searchQuery || showFavoritesOnly) && (
              <div className="flex flex-wrap gap-2 justify-center items-center">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-typewriter">Filing:</span>
                {showFavoritesOnly && (
                  <LabelTape onRemove={() => setShowFavoritesOnly(false)}>
                    Saved Files
                  </LabelTape>
                )}
                {selectedRegion !== "all" && (
                  <LabelTape onRemove={() => handleFilterChange(setSelectedRegion, "all")}>
                    {selectedRegion}
                  </LabelTape>
                )}
                {selectedDanger !== "all" && (
                  <LabelTape onRemove={() => handleFilterChange(setSelectedDanger, "all")}>
                    {selectedDanger}
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
                    setSelectedRegion("all");
                    setSelectedDanger("all");
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
                    Drawer contains <span className="text-primary font-bold">{filteredCryptids.length}</span> files
                    {visibleCryptids.length < filteredCryptids.length && (
                      <> · Viewing first <span className="text-primary font-bold">{visibleCryptids.length}</span></>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cryptid Grid */}
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
              <p className="text-xl text-destructive">Error loading cryptids. Please try again.</p>
            </div>
          ) : filteredCryptids.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No cryptids found matching your criteria.</p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRegion("all");
                  setSelectedDanger("all");
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
                {visibleCryptids.map((cryptid) => (
                  <CasefileCard key={cryptid._id} type="cryptid" data={cryptid} />
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
                    {filteredCryptids.length - visibleCount} files remaining
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

export default Index;
