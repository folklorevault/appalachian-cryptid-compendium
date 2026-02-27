// Global middleware for SEO injection, caching, and security headers

interface Env {
  ASSETS: { fetch: typeof fetch };
  DB: any;
  IMAGES: any;
  ANALYTICS?: any;
  ADMIN_API_KEY?: string;
}

interface SeoEntry {
  title: string;
  description: string;
  image?: string;
  type?: string;
}

// Module-level cache for SEO data (persists across requests within a Worker isolate)
let seoDataCache: Record<string, SeoEntry> | null = null;

async function loadSeoData(assets: Env['ASSETS'], requestUrl: string): Promise<Record<string, SeoEntry>> {
  if (seoDataCache) return seoDataCache;

  try {
    const origin = new URL(requestUrl).origin;
    const res = await assets.fetch(new Request(`${origin}/seo-data.json`));
    if (res.ok) {
      seoDataCache = await res.json();
      return seoDataCache!;
    }
  } catch {
    // SEO data unavailable — site still works, just with default meta
  }

  return {};
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function injectSeoTags(html: string, seo: SeoEntry, pathname: string): string {
  const canonicalUrl = `https://appalachiancryptid.com${pathname}`;

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(seo.title)}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapeHtml(seo.description)}"`
  );

  // Replace OG tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escapeHtml(seo.title)}"`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${escapeHtml(seo.description)}"`
  );
  if (seo.image) {
    html = html.replace(
      /<meta property="og:image" content="[^"]*"/,
      `<meta property="og:image" content="${escapeHtml(seo.image)}"`
    );
  }
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${canonicalUrl}"`
  );
  if (seo.type) {
    html = html.replace(
      /<meta property="og:type" content="[^"]*"/,
      `<meta property="og:type" content="${escapeHtml(seo.type)}"`
    );
  }

  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}"`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}"`
  );

  // Add canonical URL if not present
  if (!html.includes('rel="canonical"')) {
    html = html.replace('</head>', `<link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }

  return html;
}

const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-DNS-Prefetch-Control': 'on',
} as const;

function withHeaders(response: Response, extra: Record<string, string> = {}): Response {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers),
      ...SECURITY_HEADERS,
      ...extra,
    },
  });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // Skip middleware for API routes (they handle their own logic)
  if (url.pathname.startsWith('/api/')) {
    return next();
  }

  // Skip middleware for static assets (JS, CSS, images, fonts, etc.)
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|avif|heif|svg|ico|woff2?|woff|json|txt|xml|webmanifest)$/)) {
    return next();
  }

  // ── This is an HTML page request (SPA route) ──────────────────

  // Try to serve from cache first
  const cache = caches.default;
  const cacheKey = new Request(url.toString(), request);
  const cachedResponse = await cache.match(cacheKey);

  if (cachedResponse) {
    return withHeaders(cachedResponse, { 'X-Cache': 'HIT' });
  }

  // Not cached — get the response (always index.html for SPA routes)
  const response = await next();

  if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) {
    return withHeaders(response);
  }

  // Load SEO data and inject per-path metadata
  const seoData = await loadSeoData(env.ASSETS, request.url);
  const seo = seoData[url.pathname];

  let html = await response.text();

  if (seo) {
    html = injectSeoTags(html, seo, url.pathname);
  }

  // Determine cache duration based on route
  let cacheMaxAge: number;
  if (url.pathname === '/' || url.pathname === '/index.html') {
    cacheMaxAge = 1800; // 30 minutes for homepage
  } else if (url.pathname.startsWith('/cryptid/') || url.pathname.startsWith('/anomaly/')) {
    cacheMaxAge = 3600; // 1 hour for detail pages
  } else {
    cacheMaxAge = 1800; // 30 minutes for other pages
  }

  const finalResponse = new Response(html, {
    status: response.status,
    headers: {
      ...Object.fromEntries(response.headers),
      ...SECURITY_HEADERS,
      'Content-Type': 'text/html; charset=utf-8',
      'X-Cache': 'MISS',
    },
  });

  // Cache the SEO-injected HTML at the edge
  context.waitUntil(
    cache.put(
      cacheKey,
      new Response(html, {
        status: response.status,
        headers: {
          ...Object.fromEntries(response.headers),
          ...SECURITY_HEADERS,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': `public, max-age=${cacheMaxAge}`,
        },
      })
    )
  );

  return finalResponse;
};
