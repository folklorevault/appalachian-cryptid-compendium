"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LabelTape } from "@/components/EvidenceChip";
import { CasefileCard } from "@/components/CasefileCard";
import {
  Search,
  FolderOpen,
  Zap,
  Ghost,
  Skull,
  Eye,
  Volume2,
  Cloud,
  Clock,
  MapPinned,
} from "lucide-react";
import type { SanityAnomalyListItem, AnomalyType } from "@/types/sanity";

const INITIAL_VISIBLE = 6;
const LOAD_MORE_COUNT = 6;

const typeIcons: Record<AnomalyType, typeof Zap> = {
  Lights: Zap,
  Hauntings: Ghost,
  Curses: Skull,
  "Omen Events": Eye,
  "Sounds/Calls": Volume2,
  "Weather Oddities": Cloud,
  "Time Weirdness": Clock,
  Places: MapPinned,
};

const anomalyTypes: { value: string; label: string; icon?: typeof Zap }[] = [
  { value: "all", label: "All" },
  { value: "Lights", label: "Lights", icon: Zap },
  { value: "Hauntings", label: "Hauntings", icon: Ghost },
  { value: "Curses", label: "Curses", icon: Skull },
  { value: "Omen Events", label: "Omens", icon: Eye },
  { value: "Sounds/Calls", label: "Sounds", icon: Volume2 },
  { value: "Weather Oddities", label: "Weather", icon: Cloud },
  { value: "Time Weirdness", label: "Time", icon: Clock },
  { value: "Places", label: "Places", icon: MapPinned },
];

const statuses = [
  { value: "all", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Open File", label: "Open" },
  { value: "Cold", label: "Cold" },
  { value: "Seasonal", label: "Seasonal" },
];

const regions = [
  { value: "all", label: "All" },
  { value: "TN", label: "TN" },
  { value: "NC", label: "NC" },
  { value: "VA", label: "VA" },
  { value: "WV", label: "WV" },
  { value: "KY", label: "KY" },
];

interface AnomalyFiltersProps {
  anomalies: SanityAnomalyListItem[];
}

export const AnomalyFilters = ({ anomalies }: AnomalyFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const filteredAnomalies = useMemo(() => {
    let results = [...anomalies];

    if (selectedType !== "all") {
      results = results.filter((a) => a.anomalyType === selectedType);
    }
    if (selectedStatus !== "all") {
      results = results.filter((a) => a.status === selectedStatus);
    }
    if (selectedRegion !== "all") {
      results = results.filter((a) => a.region === selectedRegion);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.location.toLowerCase().includes(query) ||
          (a.description?.toLowerCase().includes(query) ?? false)
      );
    }

    return results;
  }, [anomalies, searchQuery, selectedType, selectedStatus, selectedRegion]);

  const visibleAnomalies = filteredAnomalies.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAnomalies.length;

  const handleFilterChange = (
    setter: (value: string) => void,
    value: string
  ) => {
    setter(value);
    setVisibleCount(INITIAL_VISIBLE);
  };

  const hasActiveFilters =
    selectedType !== "all" ||
    selectedStatus !== "all" ||
    selectedRegion !== "all" ||
    searchQuery;

  const clearAll = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedStatus("all");
    setSelectedRegion("all");
    setVisibleCount(INITIAL_VISIBLE);
  };

  return (
    <>
      {/* Search & Filters — seamless with page background */}
      <section id="case-files" className="pt-6 pb-2 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <label
              htmlFor="anomaly-search"
              className="block text-center font-typewriter text-xs tracking-[0.18em] uppercase text-muted-foreground mb-2"
            >
              Search the Case Files
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60"
                aria-hidden="true"
              />
              <Input
                id="anomaly-search"
                type="text"
                placeholder="Search the case files..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(INITIAL_VISIBLE);
                }}
                className="pl-10 h-11 font-typewriter text-sm bg-[hsl(var(--bureau-manila)/0.3)] border border-[hsl(var(--bureau-border))] focus:border-primary placeholder:font-typewriter placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* Type Filters — compact typewriter labels */}
          <div className="flex flex-wrap gap-1.5 justify-center items-center">
            {anomalyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() =>
                    handleFilterChange(setSelectedType, type.value)
                  }
                  aria-pressed={selectedType === type.value}
                  className={`font-typewriter text-xs tracking-wide px-2.5 py-1 rounded-sm border transition-colors duration-150 inline-flex items-center gap-1 ${
                    selectedType === type.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-[hsl(var(--bureau-border)/0.5)] hover:border-[hsl(var(--bureau-border))] hover:text-foreground"
                  }`}
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Status & State Filters — compact row */}
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="font-typewriter text-xs tracking-[0.15em] uppercase text-muted-foreground/70">
                Status:
              </span>
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() =>
                    handleFilterChange(setSelectedStatus, status.value)
                  }
                  aria-pressed={selectedStatus === status.value}
                  className={`font-typewriter text-xs tracking-wide px-2 py-0.5 rounded-sm border transition-colors duration-150 ${
                    selectedStatus === status.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-[hsl(var(--bureau-border)/0.5)] hover:border-[hsl(var(--bureau-border))] hover:text-foreground"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>

            <span className="hidden md:block h-4 w-px bg-border/50" />

            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="font-typewriter text-xs tracking-[0.15em] uppercase text-muted-foreground/70">
                State:
              </span>
              {regions.map((region) => (
                <button
                  key={region.value}
                  onClick={() =>
                    handleFilterChange(setSelectedRegion, region.value)
                  }
                  aria-pressed={selectedRegion === region.value}
                  className={`font-typewriter text-xs tracking-wide px-2 py-0.5 rounded-sm border transition-colors duration-150 ${
                    selectedRegion === region.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-[hsl(var(--bureau-border)/0.5)] hover:border-[hsl(var(--bureau-border))] hover:text-foreground"
                  }`}
                >
                  {region.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 justify-center items-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter">
                Filing:
              </span>
              {selectedType !== "all" && (
                <LabelTape
                  onRemove={() =>
                    handleFilterChange(setSelectedType, "all")
                  }
                >
                  {selectedType}
                </LabelTape>
              )}
              {selectedStatus !== "all" && (
                <LabelTape
                  onRemove={() =>
                    handleFilterChange(setSelectedStatus, "all")
                  }
                >
                  {selectedStatus}
                </LabelTape>
              )}
              {selectedRegion !== "all" && (
                <LabelTape
                  onRemove={() =>
                    handleFilterChange(setSelectedRegion, "all")
                  }
                >
                  {regions.find((r) => r.value === selectedRegion)?.label ||
                    selectedRegion}
                </LabelTape>
              )}
              {searchQuery && (
                <LabelTape onRemove={() => setSearchQuery("")}>
                  &ldquo;{searchQuery}&rdquo;
                </LabelTape>
              )}
              <button
                onClick={clearAll}
                className="text-xs font-typewriter text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            </div>
          )}

          {/* File Count — tight above cards */}
          <p className="text-center text-xs text-muted-foreground font-typewriter tracking-wide">
            Drawer contains{" "}
            <span className="text-primary font-bold">
              {filteredAnomalies.length}
            </span>{" "}
            case files
            {visibleAnomalies.length < filteredAnomalies.length && (
              <>
                {" "}· Viewing first{" "}
                <span className="text-primary font-bold">
                  {visibleAnomalies.length}
                </span>
              </>
            )}
          </p>
        </div>
      </section>

      {/* Anomaly Grid — tighter top padding */}
      <section className="pt-4 pb-16 px-6 lg:pb-20 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {filteredAnomalies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                No case files found matching your criteria.
              </p>
              <Button
                onClick={clearAll}
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
                  <CasefileCard
                    key={anomaly._id}
                    type="anomaly"
                    data={anomaly}
                  />
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-10">
                  <Button
                    onClick={() =>
                      setVisibleCount((prev) => prev + LOAD_MORE_COUNT)
                    }
                    size="lg"
                    variant="outline"
                    className="border-2 border-[hsl(var(--bureau-border))] text-foreground hover:bg-muted/50 gap-2"
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
    </>
  );
};
