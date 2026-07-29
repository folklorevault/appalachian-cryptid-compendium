"use client";

import { useEffect, useRef, useState } from "react";
import type mapboxgl from "mapbox-gl";
import { MapPin } from "lucide-react";
import type { SanitySighting } from "@/types/sanity";
import "mapbox-gl/dist/mapbox-gl.css";

interface SightingMapProps {
  /** Only sightings that carry coordinates — one numbered pin each. */
  sightings: SanitySighting[];
  /** Record numbers keyed by _key, so a pin shows the same "01" as its record. */
  numberByKey: Record<string, number>;
  selectedKey: string | null;
  onSelect: (key: string) => void;
}

export function SightingMap({
  sightings,
  numberByKey,
  selectedKey,
  onSelect,
}: SightingMapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Record<string, HTMLDivElement>>({});
  // Typed as any to match CryptidMap: the dynamic import's module namespace and
  // the `mapboxgl` default-export type don't line up, and fighting it adds noise.
   
  const [mapboxLib, setMapboxLib] = useState<any>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Gate the heavy mapbox-gl import behind viewport proximity so it never runs
  // for visitors who don't scroll to the map (keeps first-load INP/LCP lean).
  useEffect(() => {
    if (shouldLoad || !rootRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "250px" }
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || !token || mapboxLib || error) return;
    import("mapbox-gl")
      .then((m) => setMapboxLib(m.default || m))
      .catch(() => setError("Failed to load map library."));
  }, [shouldLoad, token, mapboxLib, error]);

  // Initialise the map + numbered markers once the library is in.
  useEffect(() => {
    if (
      !mapboxLib ||
      !token ||
      map.current ||
      !mapContainer.current ||
      sightings.length === 0
    ) {
      return;
    }

    const first = sightings[0].coordinates!;
    try {
      const useCooperativeGestures = window.matchMedia(
        "(max-width: 63.999rem), (pointer: coarse)"
      ).matches;
      map.current = new mapboxLib.Map({
        accessToken: token,
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [first.lng, first.lat],
        zoom: 9,
        cooperativeGestures: useCooperativeGestures,
      });
    } catch {
      // Defer out of the synchronous effect body (avoids cascading-render lint
      // and is harmless for this rare constructor-throw error path).
      queueMicrotask(() => setError("Failed to load map."));
      return;
    }

    map.current.addControl(
      new mapboxLib.NavigationControl({ showCompass: false }),
      "top-right"
    );
    map.current.on("error", (e) =>
      setError(e.error?.message ? `Map error: ${e.error.message}` : "Map error")
    );

    map.current.on("load", () => {
      setIsLoaded(true);
      if (!map.current) return;

      // The container may have been sized after init (grid/flex layout); force
      // a resize so the canvas fills it instead of painting blank.
      map.current.resize();

      // Frame all pins.
      if (sightings.length > 1) {
        const bounds = new mapboxLib.LngLatBounds();
        sightings.forEach((s) =>
          bounds.extend([s.coordinates!.lng, s.coordinates!.lat])
        );
        map.current.fitBounds(bounds, { padding: 56, maxZoom: 12, duration: 0 });
      }

      // Fan out markers that share identical coordinates so stacked sightings
      // don't collapse into one un-clickable blob. Display offset only — the
      // underlying data is unchanged.
      const coordGroups: Record<string, string[]> = {};
      sightings.forEach((s) => {
        const key = `${s.coordinates!.lat.toFixed(5)},${s.coordinates!.lng.toFixed(5)}`;
        if (!coordGroups[key]) coordGroups[key] = [];
        coordGroups[key].push(s._key);
      });
      const FAN_DEG = 0.0018; // ~200m radius; separates pins once zoomed in

      sightings.forEach((s) => {
        let markerLng = s.coordinates!.lng;
        let markerLat = s.coordinates!.lat;
        const group =
          coordGroups[
            `${s.coordinates!.lat.toFixed(5)},${s.coordinates!.lng.toFixed(5)}`
          ];
        if (group.length > 1) {
          const angle = (2 * Math.PI * group.indexOf(s._key)) / group.length;
          markerLat += FAN_DEG * Math.sin(angle);
          markerLng +=
            (FAN_DEG * Math.cos(angle)) / Math.cos((markerLat * Math.PI) / 180);
        }

        const el = document.createElement("div");
        el.className =
          "sighting-marker font-typewriter text-xs font-bold tracking-normal";
        el.textContent = String(numberByKey[s._key] ?? "").padStart(2, "0");
        el.dataset.selected = "false";
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
        el.setAttribute("aria-pressed", "false");
        el.setAttribute(
          "aria-label",
          `Sighting ${numberByKey[s._key] ?? ""}: ${s.location}`
        );
        el.addEventListener("click", () => onSelect(s._key));
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(s._key);
          }
        });
        markers.current[s._key] = el;
        new mapboxLib.Marker(el)
          .setLngLat([markerLng, markerLat])
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
      markers.current = {};
    };
  }, [mapboxLib, token, sightings, numberByKey, onSelect]);

  // Reflect the shared selection: emphasise the active pin and fly to it.
  useEffect(() => {
    if (!isLoaded) return;
    Object.entries(markers.current).forEach(([key, el]) => {
      const active = key === selectedKey;
      el.dataset.selected = String(active);
      el.setAttribute("aria-pressed", String(active));
      el.style.zIndex = active ? "2" : "1";
    });
    if (selectedKey && map.current) {
      const s = sightings.find((x) => x._key === selectedKey);
      if (s?.coordinates) {
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        map.current.flyTo({
          center: [s.coordinates.lng, s.coordinates.lat],
          zoom: Math.max(map.current.getZoom(), 11),
          duration: reduceMotion ? 0 : 1200,
        });
      }
    }
  }, [selectedKey, isLoaded, sightings]);

  if (!token) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-sm border-2 border-dashed border-bureau-border/50 bg-bureau-manila-light">
        <p className="px-4 text-center text-sm text-bureau-ink-muted">
          Map unavailable — Mapbox token not configured.
        </p>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      {/* Explicit height on the map container itself (like CryptidMap) — an
          `absolute inset-0` container measures as zero-height at init and paints
          blank. */}
      <div
        ref={mapContainer}
        role="application"
        aria-label="Interactive sighting map"
        className="h-[42svh] min-h-64 max-h-80 w-full overflow-hidden rounded-sm border-2 border-bureau-border/50 bg-bureau-manila-light lg:h-[460px] lg:max-h-none"
      />
      {!isLoaded && (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-0 flex items-center justify-center bg-bureau-manila-light/80"
        >
          <div className="space-y-2 text-center">
            <MapPin
              className="mx-auto h-8 w-8 animate-pulse text-bureau-ink-muted"
              aria-hidden="true"
            />
            <p className="font-typewriter text-sm text-bureau-ink-muted">
              {error ?? "Loading sighting map…"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
