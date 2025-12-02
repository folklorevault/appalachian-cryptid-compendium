import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Key } from "lucide-react";
import { cryptids } from "@/data/cryptids";

// Coordinates for cryptid locations
const cryptidLocations: Record<string, { lat: number; lng: number }> = {
  mothman: { lat: 38.8451, lng: -82.1371 }, // Point Pleasant, WV
  "wampus-cat": { lat: 35.9606, lng: -83.9207 }, // Eastern Tennessee
  "moon-eyed-people": { lat: 35.4676, lng: -83.5174 }, // Cherokee National Forest, NC
  "skunk-ape": { lat: 25.9543, lng: -81.0503 }, // Everglades, FL
  "lizard-man": { lat: 34.2018, lng: -80.2307 }, // Scape Ore Swamp, SC
  "fouke-monster": { lat: 33.2681, lng: -93.8930 }, // Fouke, AR
  tailypo: { lat: 36.6002, lng: -81.2198 }, // Blue Ridge Mountains, VA
  "grafton-monster": { lat: 39.3429, lng: -80.0187 }, // Grafton, WV
  "white-screamer": { lat: 34.8000, lng: -87.6769 }, // White Screamer location, AL
};

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

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedCryptid, setSelectedCryptid] = useState<string | null>(null);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  const initializeMap = useCallback(() => {
    if (!mapContainer.current) return;

    if (!mapboxToken) {
      setMapError("Mapbox token not configured. Please add VITE_MAPBOX_TOKEN to your .env file.");
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [-84.5, 35.5], // Center on Appalachia
        zoom: 5,
        pitch: 30,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        "top-right"
      );

      map.current.on("load", () => {
        setIsMapLoaded(true);

        // Add markers for each cryptid
        cryptids.forEach((cryptid) => {
          const coords = cryptidLocations[cryptid.id];
          if (!coords || !map.current) return;

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
          el.addEventListener("mouseenter", () => {
            el.style.transform = "scale(1.2)";
          });
          el.addEventListener("mouseleave", () => {
            el.style.transform = "scale(1)";
          });
          el.addEventListener("click", () => {
            setSelectedCryptid(cryptid.id);
            map.current?.flyTo({
              center: [coords.lng, coords.lat],
              zoom: 8,
              duration: 1500,
            });
          });

          new mapboxgl.Marker(el)
            .setLngLat([coords.lng, coords.lat])
            .addTo(map.current!);
        });
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to load map. Please check your Mapbox token.");
    }
  }, [mapboxToken]);

  useEffect(() => {
    // Auto-initialize map if token is available
    if (mapboxToken && !isMapLoaded && !mapError) {
      initializeMap();
    }
    
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, isMapLoaded, mapError, initializeMap]);

  const selectedCryptidData = selectedCryptid
    ? cryptids.find((c) => c.id === selectedCryptid)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header badge="Sighting Map" />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link to="/">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {mapError && (
          <Card className="border-2 border-destructive/50 mb-6">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-destructive">
                <Key className="h-5 w-5" />
                <span className="font-bold">Map Configuration Required</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {mapError}
              </p>
              <p className="text-xs text-muted-foreground">
                Get a free Mapbox token at{" "}
                <a
                  href="https://mapbox.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  mapbox.com
                </a>
                {" "}and add it to your environment variables.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Map Container */}
          <div className="relative">
            <div
              ref={mapContainer}
              className="w-full h-[500px] lg:h-[600px] rounded-lg border-2 border-border bg-card"
            />
            {!isMapLoaded && !mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-lg">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto animate-pulse" />
                  <p className="text-muted-foreground font-typewriter">
                    Loading sighting map...
                  </p>
                </div>
              </div>
            )}
            {!isMapLoaded && mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-lg">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Map unavailable
                  </p>
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
                    <div className="w-4 h-4 rounded-full bg-destructive" />
                    <span className="text-sm text-foreground">Advisory: Elevated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-secondary" />
                    <span className="text-sm text-foreground">
                      Advisory: Moderate
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-accent" />
                    <span className="text-sm text-foreground">Advisory: Low</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedCryptidData ? (
              <Card className="border-2 border-primary">
                <CardContent className="p-4 space-y-3">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter">
                    SELECTED CASE FILE
                  </div>
                  <div className="flex items-start gap-3">
                    <img
                      src={selectedCryptidData.image}
                      alt={selectedCryptidData.name}
                      className="w-16 h-16 object-cover rounded border border-border"
                    />
                    <div>
                      <h3 className="font-bold text-foreground">
                        {selectedCryptidData.name}
                      </h3>
                      <p className="text-xs text-muted-foreground italic">
                        {selectedCryptidData.scientificName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-foreground">
                      {selectedCryptidData.location}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80">
                    {selectedCryptidData.description}
                  </p>
                  <Link to={`/cryptid/${selectedCryptidData.id}`}>
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
                      key={cryptid.id}
                      onClick={() => {
                        setSelectedCryptid(cryptid.id);
                        const coords = cryptidLocations[cryptid.id];
                        if (coords && map.current) {
                          map.current.flyTo({
                            center: [coords.lng, coords.lat],
                            zoom: 8,
                            duration: 1500,
                          });
                        }
                      }}
                      className={`w-full text-left p-2 rounded transition-colors ${
                        selectedCryptid === cryptid.id
                          ? "bg-primary/20 border border-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: getDangerColor(
                              cryptid.dangerLevel
                            ),
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
      </div>
    </div>
  );
};

export default Map;