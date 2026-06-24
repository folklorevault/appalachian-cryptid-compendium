"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LabelTape } from "@/components/EvidenceChip";
import { CasefileCard } from "@/components/CasefileCard";
import { Search, FolderOpen } from "lucide-react";
import type { SanityCryptidListItem } from "@/types/sanity";

const INITIAL_VISIBLE = 6;
const LOAD_MORE_COUNT = 6;

interface CryptidFiltersProps {
  cryptids: SanityCryptidListItem[];
}

const regions = [
  { value: "all", label: "All" },
  { value: "Appalachia", label: "Appalachia" },
  { value: "Southeast", label: "Southeast" },
  { value: "Southern", label: "Southern" },
];

export const CryptidFilters = ({ cryptids }: CryptidFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  // Preserve Sanity's _createdAt desc order, then apply client-side filters
  const filteredCryptids = useMemo(() => {
    let results = cryptids;

    if (selectedRegion !== "all") {
      results = results.filter(
        (c) => c.region?.toLowerCase() === selectedRegion.toLowerCase()
      );
    }

    if (!searchQuery) return results;

    const query = searchQuery.toLowerCase();
    return results.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query) ||
        (c.description?.toLowerCase().includes(query) ?? false)
    );
  }, [cryptids, searchQuery, selectedRegion]);

  const visibleCryptids = filteredCryptids.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCryptids.length;

  const handleFilterChange = (value: string) => {
    setSelectedRegion(value);
    setVisibleCount(INITIAL_VISIBLE);
  };

  const hasActiveFilters = selectedRegion !== "all" || searchQuery;

  return (
    <>
      {/* Search & Filters — seamless with page background */}
      <section id="field-guide" className="pt-6 pb-2 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <h2 className="sr-only">Cryptid Case Files</h2>
          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <label
              htmlFor="cryptid-search"
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
                id="cryptid-search"
                type="text"
                placeholder="Search the case files..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(INITIAL_VISIBLE);
                }}
                className="pl-10 h-11 font-typewriter text-sm bg-[hsl(var(--bureau-manila)/0.3)] border border-bureau-border focus:border-primary placeholder:font-typewriter placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* Region Filters — compact typewriter labels */}
          <div className="flex flex-wrap gap-1.5 justify-center items-center">
            {regions.map((region) => (
              <button
                key={region.value}
                onClick={() => handleFilterChange(region.value)}
                aria-pressed={selectedRegion === region.value}
                aria-label={`Filter by region: ${region.label}`}
                className={`font-typewriter text-xs tracking-wide px-2.5 py-1 rounded-sm border transition-colors duration-150 ${
                  selectedRegion === region.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-[hsl(var(--bureau-border)/0.5)] hover:border-bureau-border hover:text-foreground"
                }`}
              >
                {region.label}
              </button>
            ))}
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 justify-center items-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter">
                Filing:
              </span>
              {selectedRegion !== "all" && (
                <LabelTape onRemove={() => handleFilterChange("all")}>
                  {selectedRegion}
                </LabelTape>
              )}
              {searchQuery && (
                <LabelTape onRemove={() => setSearchQuery("")}>
                  &ldquo;{searchQuery}&rdquo;
                </LabelTape>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRegion("all");
                  setVisibleCount(INITIAL_VISIBLE);
                }}
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
              {filteredCryptids.length}
            </span>{" "}
            files
            {visibleCryptids.length < filteredCryptids.length && (
              <>
                {" "}· Viewing first{" "}
                <span className="text-primary font-bold">
                  {visibleCryptids.length}
                </span>
              </>
            )}
          </p>
        </div>
      </section>

      {/* Cryptid Grid — tighter top padding */}
      <section className="pt-4 pb-16 px-6 lg:pb-20 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {filteredCryptids.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                No cryptids found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
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
                {visibleCryptids.map((cryptid, index) => (
                  <CasefileCard
                    key={cryptid._id}
                    type="cryptid"
                    data={cryptid}
                    priority={index < 3}
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
                    className="border-2 border-bureau-border text-foreground hover:bg-muted/50 gap-2"
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
    </>
  );
};
