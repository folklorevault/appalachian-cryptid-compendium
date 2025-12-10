import { useState, useMemo } from "react";
import { CryptidCard } from "@/components/CryptidCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCryptids } from "@/hooks/use-sanity-cryptids";
import { StructuredData, createWebSiteSchema } from "@/components/StructuredData";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedDanger, setSelectedDanger] = useState<string>("all");

  // Fetch cryptids from Sanity (or static fallback)
  const { data: cryptids = [], isLoading, error } = useCryptids({
    region: selectedRegion,
    dangerLevel: selectedDanger,
    search: searchQuery,
  });

  // Additional client-side filtering for immediate search feedback
  const filteredCryptids = useMemo(() => {
    if (!searchQuery) return cryptids;

    const query = searchQuery.toLowerCase();
    return cryptids.filter((cryptid) =>
      cryptid.name.toLowerCase().includes(query) ||
      cryptid.location.toLowerCase().includes(query) ||
      (cryptid.description?.toLowerCase().includes(query) ?? false)
    );
  }, [cryptids, searchQuery]);

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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight font-display">
              Appalachian Cryptid
              <br />
              <span className="text-primary">Field Guide</span>
            </h2>
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

      {/* Filter & Search Section */}
      <section id="field-guide" className="py-12 px-4 border-y border-border bg-card/50">
        <div className="container mx-auto">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                Browse the Collection
              </div>
              <h3 className="text-2xl font-bold text-foreground">Find a Creature</h3>
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
                    onClick={() => setSelectedRegion(region.value)}
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
                    onClick={() => setSelectedDanger(level.value)}
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
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading creatures...
                  </span>
                ) : (
                  <>
                    Showing <span className="text-primary font-bold">{filteredCryptids.length}</span> creatures in our field guide
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
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
                }}
                variant="outline"
                className="mt-4 border-primary text-primary hover:bg-primary/10"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCryptids.map((cryptid) => (
                <CryptidCard key={cryptid._id} cryptid={cryptid} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer variant="full" />
    </div>
  );
};

export default Index;
