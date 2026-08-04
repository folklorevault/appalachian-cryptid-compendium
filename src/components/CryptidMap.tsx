"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type mapboxgl from "mapbox-gl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Key } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";
import type {
  SanityCryptidMapItem,
  SanityAnomalyMapItem,
} from "@/types/sanity";
import "mapbox-gl/dist/mapbox-gl.css";

interface CryptidMapProps {
  cryptids: SanityCryptidMapItem[];
  anomalies?: SanityAnomalyMapItem[];
}

// Deliberate marker hexes (see project memory: CryptidMap marker/legend hexes
// are intentional and not design tokens).
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

// Anomalies are one flat layer. They're set apart from cryptids by marker
// SHAPE (a diamond vs. the cryptid circle) as well as this violet, so the two
// datasets stay distinguishable without relying on color alone.
const ANOMALY_COLOR = "#8b5cf6";

type Selected =
  | { kind: "cryptid"; id: string }
  | { kind: "anomaly"; id: string }
  | null;

export function CryptidMap({ cryptids, anomalies = [] }: CryptidMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const cryptidMarkers = useRef<mapboxgl.Marker[]>([]);
  const anomalyMarkers = useRef<mapboxgl.Marker[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Selected>(null);
  const [showCryptids, setShowCryptids] = useState(true);
  const [showAnomalies, setShowAnomalies] = useState(true);
  const [mapboxLib, setMapboxLib] = useState<any>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const initializeMap = useCallback(() => {
    if (!mapboxLib) return;
    if (!mapContainer.current) return;

    if (!mapboxToken) {
      setMapError(
        "Mapbox token not configured. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env file."
      );
      return;
    }

    try {
      // Pass the token per-map instead of mutating the shared mapbox-gl module
      // (mapboxLib.accessToken = ...), which the react-hooks immutability rule flags.
      map.current = new mapboxLib.Map({
        accessToken: mapboxToken,
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
        setIsMapLoaded(true);

        // Cryptid markers — circles, colored by danger advisory.
        cryptidMarkers.current = cryptids
          .filter((c) => c.coordinates)
          .map((cryptid) => {
            const el = document.createElement("div");
            el.className = "cryptid-marker";
            el.style.cssText = `
              width: 28px;
              height: 28px;
              background-color: ${getDangerColor(cryptid.dangerLevel)};
              border: 3px solid white;
              border-radius: 50%;
              cursor: pointer;
              box-shadow: 0 2px 10px rgba(0,0,0,0.5);
              transition: transform 0.2s;
            `;
            el.setAttribute("tabindex", "0");
            el.setAttribute("role", "button");
            el.setAttribute(
              "aria-label",
              `Cryptid: ${cryptid.name} — ${cryptid.location}`
            );
            const select = () => {
              setSelected({ kind: "cryptid", id: cryptid._id });
              map.current?.flyTo({
                center: [cryptid.coordinates.lng, cryptid.coordinates.lat],
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
            el.addEventListener("click", select);
            el.addEventListener("keydown", (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                select();
              }
            });

            return new mapboxLib.Marker(el)
              .setLngLat([cryptid.coordinates.lng, cryptid.coordinates.lat])
              .addTo(map.current!);
          });

        // Anomaly markers — diamonds (rotated squares) in violet. The rotation
        // lives on an inner node so mapbox's own position transform on the outer
        // marker element is never overwritten.
        anomalyMarkers.current = anomalies
          .filter((a) => a.coordinates)
          .map((anomaly) => {
            const el = document.createElement("div");
            el.className = "anomaly-marker";
            el.style.cssText = `
              width: 26px;
              height: 26px;
              cursor: pointer;
              transition: transform 0.2s;
            `;
            const glyph = document.createElement("div");
            glyph.style.cssText = `
              width: 100%;
              height: 100%;
              background-color: ${ANOMALY_COLOR};
              border: 3px solid white;
              border-radius: 4px;
              transform: rotate(45deg);
              box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            `;
            el.appendChild(glyph);
            el.setAttribute("tabindex", "0");
            el.setAttribute("role", "button");
            el.setAttribute(
              "aria-label",
              `Anomaly: ${anomaly.name} — ${anomaly.location}`
            );
            const select = () => {
              setSelected({ kind: "anomaly", id: anomaly._id });
              map.current?.flyTo({
                center: [anomaly.coordinates.lng, anomaly.coordinates.lat],
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
            el.addEventListener("click", select);
            el.addEventListener("keydown", (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                select();
              }
            });

            return new mapboxLib.Marker(el)
              .setLngLat([anomaly.coordinates.lng, anomaly.coordinates.lat])
              .addTo(map.current!);
          });
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to load map. Please check your Mapbox token.");
    }
  }, [mapboxLib, mapboxToken, cryptids, anomalies]);

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
      (cryptids.length > 0 || anomalies.length > 0)
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
  }, [mapboxToken, mapError, initializeMap, mapboxLib, cryptids, anomalies]);

  // Toggle each layer's markers without tearing down the map.
  useEffect(() => {
    cryptidMarkers.current.forEach((m) => {
      m.getElement().style.display = showCryptids ? "" : "none";
    });
  }, [showCryptids, isMapLoaded]);

  useEffect(() => {
    anomalyMarkers.current.forEach((m) => {
      m.getElement().style.display = showAnomalies ? "" : "none";
    });
  }, [showAnomalies, isMapLoaded]);

  const selectedCryptid =
    selected?.kind === "cryptid"
      ? cryptids.find((c) => c._id === selected.id) ?? null
      : null;
  const selectedAnomaly =
    selected?.kind === "anomaly"
      ? anomalies.find((a) => a._id === selected.id) ?? null
      : null;

  const selectedItem = selectedCryptid ?? selectedAnomaly;

  const selectedImage = selectedItem?.gridImage
    ? urlFor(selectedItem.gridImage)
        .width(64)
        .height(64)
        .fit("crop")
        .quality(55)
        .auto("format")
        .url()
    : "";

  const flyTo = (coords: { lng: number; lat: number }) => {
    map.current?.flyTo({
      center: [coords.lng, coords.lat],
      zoom: 8,
      duration: 1500,
    });
  };

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
                  <div className="w-4 h-4 rounded-full bg-[#ef4444]" aria-hidden="true" />
                  <span className="text-sm text-foreground">
                    Cryptid — Advisory: Elevated
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#f59e0b]" aria-hidden="true" />
                  <span className="text-sm text-foreground">
                    Cryptid — Advisory: Moderate
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#22c55e]" aria-hidden="true" />
                  <span className="text-sm text-foreground">
                    Cryptid — Advisory: Low
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rotate-45 rounded-[2px] bg-[#8b5cf6] ml-0.5 mr-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-foreground">Anomaly</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Layer filters — cryptids and anomalies toggle independently */}
          <Card className="border-2 border-border">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-3">
                LAYERS
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCryptids}
                    onChange={(e) => setShowCryptids(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm text-foreground">
                    Cryptids ({cryptids.length})
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAnomalies}
                    onChange={(e) => setShowAnomalies(e.target.checked)}
                    className="h-4 w-4 accent-[#8b5cf6]"
                  />
                  <span className="text-sm text-foreground">
                    Anomalies ({anomalies.length})
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          {selectedItem ? (
            <Card className="border-2 border-primary">
              <CardContent className="p-4 space-y-3">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter">
                  {selectedCryptid ? "SELECTED CASE FILE" : "SELECTED ANOMALY"}
                </div>
                <div className="flex items-start gap-3">
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt={selectedItem.name}
                      loading="lazy"
                      decoding="async"
                      width="64"
                      height="64"
                      className="w-16 h-16 object-cover object-top rounded border border-border"
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-foreground">
                      {selectedItem.name}
                    </h3>
                    {selectedAnomaly && (
                      <p className="text-xs text-muted-foreground font-typewriter uppercase tracking-wider mt-0.5">
                        {selectedAnomaly.anomalyType}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-foreground">
                    {selectedItem.location}
                  </span>
                </div>
                {selectedItem.description && (
                  <p className="text-sm text-foreground/80">
                    {selectedItem.description}
                  </p>
                )}
                {selectedCryptid ? (
                  <Link href={`/cryptid/${selectedCryptid.slug.current}`}>
                    <Button
                      size="sm"
                      className="w-full bg-primary text-primary-foreground"
                    >
                      View Case File
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/anomaly/${selectedAnomaly!.slug.current}`}>
                    <Button
                      size="sm"
                      className="w-full bg-primary text-primary-foreground"
                    >
                      View Case File
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-border">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Click a marker on the map to view details
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border-2 border-border">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-3">
                ALL LOCATIONS ({(showCryptids ? cryptids.length : 0) +
                  (showAnomalies ? anomalies.length : 0)})
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {showCryptids &&
                  cryptids.map((cryptid) => (
                    <button
                      key={cryptid._id}
                      onClick={() => {
                        setSelected({ kind: "cryptid", id: cryptid._id });
                        if (cryptid.coordinates) flyTo(cryptid.coordinates);
                      }}
                      className={`w-full text-left p-2 rounded transition-colors ${
                        selected?.kind === "cryptid" &&
                        selected.id === cryptid._id
                          ? "bg-primary/20 border border-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
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
                {showAnomalies &&
                  anomalies.map((anomaly) => (
                    <button
                      key={anomaly._id}
                      onClick={() => {
                        setSelected({ kind: "anomaly", id: anomaly._id });
                        if (anomaly.coordinates) flyTo(anomaly.coordinates);
                      }}
                      className={`w-full text-left p-2 rounded transition-colors ${
                        selected?.kind === "anomaly" &&
                        selected.id === anomaly._id
                          ? "bg-primary/20 border border-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rotate-45 rounded-[2px] shrink-0 ml-0.5 mr-0.5 bg-[#8b5cf6]"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-foreground">
                          {anomaly.name}
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
