import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { analytics } from "@/lib/analytics";

/**
 * Tracks page views using React Router's location changes.
 * This replaces the previous setInterval polling approach with
 * event-driven tracking that fires exactly when navigation occurs.
 */
export const AnalyticsTracker = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Track the page view on every location change
    // Skip the first render since that's the initial page load
    // which may already have been tracked by direct page access
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Track initial page load
      analytics.trackPageView(location.pathname);
      return;
    }

    analytics.trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
};
