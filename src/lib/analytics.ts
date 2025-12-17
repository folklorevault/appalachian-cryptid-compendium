// Client-side analytics tracking

interface AnalyticsEvent {
  event: string;
  page: string;
  cryptid?: string;
  referrer?: string;
  userAgent?: string;
}

class Analytics {
  private endpoint = "/api/analytics";
  private enabled = true;

  // Track page view
  trackPageView(page: string, cryptid?: string) {
    if (!this.enabled) return;

    this.track({
      event: "page_view",
      page,
      cryptid,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    });
  }

  // Track cryptid view
  trackCryptidView(slug: string, name: string) {
    this.trackPageView(`/cryptids/${slug}`, name);
  }

  // Track custom event
  trackEvent(event: string, data?: Record<string, any>) {
    if (!this.enabled) return;

    this.track({
      event,
      page: window.location.pathname,
      ...data,
    });
  }

  // Send analytics data
  private async track(data: AnalyticsEvent) {
    try {
      // Use sendBeacon for reliability (doesn't get cancelled on page unload)
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          this.endpoint,
          JSON.stringify(data)
        );
      } else {
        // Fallback to fetch
        fetch(this.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          keepalive: true,
        }).catch(() => {
          // Silently fail - analytics shouldn't break the app
        });
      }
    } catch (error) {
      // Silently fail
      console.debug("Analytics error:", error);
    }
  }

  // Disable analytics (for privacy compliance)
  disable() {
    this.enabled = false;
  }

  // Enable analytics
  enable() {
    this.enabled = true;
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Auto-track page views on route changes
if (typeof window !== "undefined") {
  // Track initial page load
  analytics.trackPageView(window.location.pathname);

  // Track client-side navigation (for React Router)
  let lastPath = window.location.pathname;
  setInterval(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      analytics.trackPageView(currentPath);
      lastPath = currentPath;
    }
  }, 1000);
}
