type AnalyticsProperty = string | number;

interface RybbitAnalytics {
  event: (
    eventName: string,
    properties?: Record<string, AnalyticsProperty>,
  ) => void;
}

declare global {
  interface Window {
    rybbit?: RybbitAnalytics;
  }
}

class Analytics {
  // These methods remain for backwards compatibility. Rybbit handles its
  // built-in pageviews automatically through the site-wide tracking script.
  trackPageView(_page: string, _cryptid?: string) {}
  trackCryptidView(_slug: string, _name: string) {}

  trackEvent(
    eventName: string,
    properties?: Record<string, AnalyticsProperty>,
  ) {
    if (typeof window === "undefined") return;

    try {
      window.rybbit?.event(eventName, properties);
    } catch {
      // Analytics must never interrupt the visitor's action.
    }
  }

  disable() {}
  enable() {}
}

// Export singleton instance
export const analytics = new Analytics();
