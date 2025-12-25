// Global middleware for SEO, caching, and analytics

interface Env {
  ASSETS: any;
  DB: any;
  IMAGES: any;
  ANALYTICS?: any;
  ADMIN_API_KEY?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // Skip middleware for API routes (they handle their own logic)
  if (url.pathname.startsWith("/api/")) {
    return next();
  }

  // Check if this is a cryptid detail page for SEO optimization
  const cryptidMatch = url.pathname.match(/^\/cryptid\/([^/]+)$/);

  if (cryptidMatch) {
    const slug = cryptidMatch[1];

    // Try to serve from cache first
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    const cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      console.log(`Cache hit for ${slug}`);
      return cachedResponse;
    }

    // Not in cache, continue to the page
    const response = await next();

    // Cache successful HTML responses for 1 hour
    if (response.status === 200 && response.headers.get("content-type")?.includes("text/html")) {
      const responseToCache = response.clone();
      context.waitUntil(
        cache.put(
          cacheKey,
          new Response(responseToCache.body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: {
              ...Object.fromEntries(responseToCache.headers),
              "Cache-Control": "public, max-age=3600", // 1 hour
              "X-Cache": "MISS",
            },
          })
        )
      );

      // Add cache header to indicate this is not cached
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers),
          "X-Cache": "MISS",
        },
      });
    }

    return response;
  }

  // Cache the homepage
  if (url.pathname === "/" || url.pathname === "/index.html") {
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    const cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: {
          ...Object.fromEntries(cachedResponse.headers),
          "X-Cache": "HIT",
        },
      });
    }

    const response = await next();

    if (response.status === 200) {
      const responseToCache = response.clone();
      context.waitUntil(
        cache.put(
          cacheKey,
          new Response(responseToCache.body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: {
              ...Object.fromEntries(responseToCache.headers),
              "Cache-Control": "public, max-age=1800", // 30 minutes for homepage
            },
          })
        )
      );

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers),
          "X-Cache": "MISS",
        },
      });
    }

    return response;
  }

  // For all other requests, add security headers and continue
  const response = await next();

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers),
      // Security headers
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      // Performance hint
      "X-DNS-Prefetch-Control": "on",
    },
  });
};
