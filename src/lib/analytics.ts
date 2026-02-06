// Analytics stub - actual tracking handled by Umami
// This file exists so existing analytics.trackEvent() calls don't break

class Analytics {
  // No-op methods for backwards compatibility
  trackPageView(_page: string, _cryptid?: string) {}
  trackCryptidView(_slug: string, _name: string) {}
  trackEvent(_event: string, _data?: Record<string, unknown>) {}
  disable() {}
  enable() {}
}

// Export singleton instance
export const analytics = new Analytics();
