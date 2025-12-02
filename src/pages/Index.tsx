import { useState, useMemo } from "react";
import { CryptidCard } from "@/components/CryptidCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cryptids } from "@/data/cryptids";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedDanger, setSelectedDanger] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredCryptids = useMemo(() => {
    return cryptids.filter((cryptid) => {
      const matchesSearch =
        cryptid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cryptid.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cryptid.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion =
        selectedRegion === "all" || cryptid.region === selectedRegion;

      const matchesDanger =
        selectedDanger === "all" || cryptid.dangerLevel === selectedDanger;

      return matchesSearch && matchesRegion && matchesDanger;
    });
  }, [searchQuery, selectedRegion, selectedDanger]);

  const regions = [
    { value: "all", label: "All Regions" },
    { value: "appalachia", label: "Appalachia" },
    { value: "southeast", label: "Southeast" },
    { value: "southern", label: "Southern" },
  ];

  const dangerLevels = [
    { value: "all", label: "All Threats" },
    { value: "Low", label: "Low Threat" },
    { value: "Medium", label: "Medium Threat" },
    { value: "High", label: "High Threat" },
  ];

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary font-display tracking-tight">
              CRYPTID_DIRECTORY
            </h1>
              <Badge variant="outline" className="hidden sm:inline-flex border-primary text-primary">
                v2.4.1
              </Badge>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <nav className="hidden lg:flex items-center gap-6">
              <a href="#directory" className="text-sm text-foreground hover:text-primary transition-colors">
                Directory
              </a>
              <Link to="/about" className="text-sm text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/map" className="text-sm text-foreground hover:text-primary transition-colors">
                Map
              </Link>
              <Link to="/report" className="text-sm text-foreground hover:text-primary transition-colors">
                Report
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-card">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <a
              href="#directory"
              className="text-sm text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Directory
            </a>
            <Link
              to="/about"
              className="text-sm text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/map"
              className="text-sm text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Map
            </Link>
            <Link
              to="/report"
              className="text-sm text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Report Sighting
            </Link>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <Badge className="bg-primary/10 text-primary border-primary mb-4" variant="outline">
                FIELD RESEARCH DIVISION
              </Badge>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight font-display">
              Appalachian & Southern
              <br />
              <span className="text-primary">Cryptid Field Guide</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive catalog of documented cryptid sightings across the Appalachian Mountains
              and Southern United States. Compiled from field reports, eyewitness accounts, and ongoing research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <a href="#directory">Explore Directory</a>
              </Button>
              <Link to="/report">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/10"
                >
                  Report Sighting
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section id="directory" className="py-12 px-4 border-y border-border bg-card/50">
        <div className="container mx-auto">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                SEARCH DATABASE
              </div>
              <h3 className="text-2xl font-bold text-foreground">Filter Specimens</h3>
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
                Showing <span className="text-primary font-bold">{filteredCryptids.length}</span> of{" "}
                <span className="text-primary font-bold">{cryptids.length}</span> documented specimens
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cryptid Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {filteredCryptids.length === 0 ? (
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
                <CryptidCard key={cryptid.id} {...cryptid} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold text-foreground mb-3 font-display">CRYPTID_DIRECTORY</h4>
              <p className="text-sm text-muted-foreground">
                Documenting unknown species across the Appalachian and Southern United States since 1987.
              </p>
            </div>
            <div>
              <h5 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    About the Project
                  </Link>
                </li>
                <li>
                  <a href="#submit" className="text-muted-foreground hover:text-primary transition-colors">
                    Submit a Sighting
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact Research Team
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Disclaimer</h5>
              <p className="text-xs text-muted-foreground">
                All specimens documented for research purposes only. Do not approach or attempt to capture any
                cryptids. Report all sightings to local authorities and our research team.
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-6">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 Cryptid Directory. All field notes and specimen data classified.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
