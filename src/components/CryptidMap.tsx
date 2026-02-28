"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type mapboxgl from "mapbox-gl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Key, Loader2 } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import type { SanityCryptidMapItem } from "@/types/sanity";
import "mapbox-gl/dist/mapbox-gl.css";

interface CryptidMapProps {
  cryptids: SanityCryptidMapItem[];
}

const getDangerColor = (level: string) => {
  switch (level) {
    case "High":
      return "#ef4444";
    case "Medium":
      return "#f59e0b";
    case "Low":
      return "#22c55e";
    default:
      return "#6b7280";
  }
};

export function CryptidMap({ cryptids }: CryptidMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedCryptidId, setSelectedCryptidId] = useState<string | null>(
    null
  );
  const [mapboxLib, setMapboxLib] = useState<any>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const initializeMap = useCallback(() => {
    if (!mapboxLib) return;
    if (!mapContainer.current) {
      console.log("Map container not ready");
      return;
    }

    if (!mapboxToken) {
      console.log("No Mapbox token found");
      setMapError(
        "Mapbox token not configured. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env file."
      );
      return;
    }

    console.log(
      "Initializing map with token:",
      mapboxToken.substring(0, 15) + "..."
    );
    mapboxLib.accessToken = mapboxToken;

    try {
      map.current = new mapboxLib.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [-84.5, 35.5], // Center on Appalachia
        zoom: 5,
        pitch: 30,
      });

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e);
        setMapError(`Map error: ${e.error?.message || "Unknown error"}`);
      });

      map.current.addControl(
        new mapboxLib.NavigationControl({
          visualizePitch: true,
        }),
        "top-right"
      );

      map.current.on("load", () => {
        console.log("Map loaded successfully!");
        setIsMapLoaded(true);

        // Add markers for each cryptid
        cryptids.forEach((cryptid) => {
          if (!cryptid.coordinates || !map.current) return;

          // Create custom marker element
          const el = document.createElement("div");
          el.className = "cryptid-marker";
          el.style.cssText = `
            width: 30px;
            height: 30px;
            background-color: ${getDangerColor(cryptid.dangerLevel)};
            border: 3px solid white;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            transition: transform 0.2s;
          `;
          el.setAttribute("tabindex", "0");
          el.setAttribute("role", "button");
          el.setAttribute("aria-label", `${cryptid.name} — ${cryptid.location}`);
          const selectMarker = () => {
            setSelectedCryptidId(cryptid._id);
            map.current?.flyTo({
              center: [cryptid.coordinates!.lng, cryptid.coordinates!.lat],
              zoom: 8,
              duration: 1500,
            });
          };
          el.addEventListener("mouseenter", () => {
            el.style.transform = "scale(1.2)";
          });
          el.addEventListener("mouseleave", () => {
            el.style.transform = "scale(1)";
          });
          el.addEventListener("click", selectMarker);
          el.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              selectMarker();
            }
          });

          new mapboxLib.Marker(el)
            .setLngLat([cryptid.coordinates.lng, cryptid.coordinates.lat])
            .addTo(map.current!);
        });
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to load map. Please check your Mapbox token.");
    }
  }, [mapboxLib, mapboxToken, cryptids]);

  useEffect(() => {
    // Load Mapbox only when the page is visited to keep the main bundle lean
    if (mapboxToken && !mapboxLib && !mapError) {
      import("mapbox-gl")
        .then((module) => {
          setMapboxLib(module.default || module);
        })
        .catch((error) => {
          console.error("Error loading Mapbox:", error);
          setMapError("Failed to load map library. Please try again.");
        });
    }

    if (
      mapboxToken &&
      mapboxLib &&
      !map.current &&
      !mapError &&
      cryptids.length > 0
    ) {
      initializeMap();
    }

    // Cleanup only on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, mapError, initializeMap, mapboxLib, cryptids]);

  const selectedCryptid = selectedCryptidId
    ? cryptids.find((c) => c._id === selectedCryptidId)
    : null;

  // Get image URL for selected cryptid
  const selectedCryptidImage =
    selectedCryptid?.gridImage
      ? urlFor(selectedCryptid.gridImage)
          .width(64)
          .height(64)
          .fit("crop")
          .quality(55)
          .url()
      : "";

  return (
    <>
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Button>
        </Link>
      </div>

      {mapError && (
        <Card className="border-2 border-destructive/50 mb-6">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-destructive">
              <Key className="h-5 w-5" />
              <span className="font-bold">Map Configuration Required</span>
            </div>
            <p className="text-sm text-muted-foreground">{mapError}</p>
            <p className="text-xs text-muted-foreground">
              Get a free Mapbox token at{" "}
              <a
                href="https://mapbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>{" "}
              and add it to your environment variables.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        {/* Map Container */}
        <div className="relative">
          <div
            ref={mapContainer}
            role="application"
            aria-label="Interactive sighting map"
            className="w-full h-[500px] lg:h-[600px] rounded-lg border-2 border-border bg-card"
          />
          <div role="status" aria-live="polite" aria-atomic="true">
            {!isMapLoaded && !mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-lg">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto animate-pulse" aria-hidden="true" />
                  <p className="text-muted-foreground font-typewriter">
                    Loading sighting map...
                  </p>
                </div>
              </div>
            )}
          </div>
          {!isMapLoaded && mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-lg">
              <div className="text-center space-y-2">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Map unavailable</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="border-2 border-border">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-3">
                MAP LEGEND
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-destructive" aria-hidden="true" />
                  <span className="text-sm text-foreground">
                    Advisory: Elevated
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-secondary" aria-hidden="true" />
                  <span className="text-sm text-foreground">
                    Advisory: Moderate
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-accent" aria-hidden="true" />
                  <span className="text-sm text-foreground">Advisory: Low</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedCryptid ? (
            <Card className="border-2 border-primary">
              <CardContent className="p-4 space-y-3">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter">
                  SELECTED CASE FILE
                </div>
                <div className="flex items-start gap-3">
                  {selectedCryptidImage && (
                    <img
                      src={selectedCryptidImage}
                      alt={selectedCryptid.name}
                      loading="lazy"
                      decoding="async"
                      width="64"
                      height="64"
                      className="w-16 h-16 object-cover object-top rounded border border-border"
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-foreground">
                      {selectedCryptid.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-foreground">
                    {selectedCryptid.location}
                  </span>
                </div>
                {selectedCryptid.description && (
                  <p className="text-sm text-foreground/80">
                    {selectedCryptid.description}
                  </p>
                )}
                <Link href={`/cryptid/${selectedCryptid.slug.current}`}>
                  <Button
                    size="sm"
                    className="w-full bg-primary text-primary-foreground"
                  >
                    View Case File
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-border">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Click a marker on the map to view cryptid details
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border-2 border-border">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-3">
                ALL LOCATIONS ({cryptids.length})
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {cryptids.map((cryptid) => (
                  <button
                    key={cryptid._id}
                    onClick={() => {
                      setSelectedCryptidId(cryptid._id);
                      if (cryptid.coordinates && map.current) {
                        map.current.flyTo({
                          center: [
                            cryptid.coordinates.lng,
                            cryptid.coordinates.lat,
                          ],
                          zoom: 8,
                          duration: 1500,
                        });
                      }
                    }}
                    className={`w-full text-left p-2 rounded transition-colors ${
                      selectedCryptidId === cryptid._id
                        ? "bg-primary/20 border border-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        aria-hidden="true"
                        style={{
                          backgroundColor: getDangerColor(cryptid.dangerLevel),
                        }}
                      />
                      <span className="text-sm text-foreground">
                        {cryptid.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
