# Cloudflare Features Guide

This document explains the Cloudflare Workers features implemented in the Appalachian Cryptid Compendium.

## 🖼️ Image Optimization

The image serving endpoint now supports automatic optimization via query parameters.

### Usage

```
/api/images/cryptid-photo.jpg?w=800&h=600&q=85&f=webp
```

**Parameters:**
- `w` - Width in pixels
- `h` - Height in pixels
- `q` - Quality (1-100, default: 85)
- `f` - Format (webp, avif, jpeg, png)

### Examples

```tsx
// Original image
<img src="/api/images/mothman.jpg" />

// Optimized for grid card (400x400 WebP)
<img src="/api/images/mothman.jpg?w=400&h=400&f=webp" />

// Optimized for detail page (1200px wide, high quality)
<img src="/api/images/mothman.jpg?w=1200&q=90&f=webp" />

// Mobile-optimized (600px wide, lower quality)
<img src="/api/images/mothman.jpg?w=600&q=75&f=webp" />
```

### Implementation in React

```tsx
const CryptidImage = ({ src, alt, size = 'medium' }) => {
  const sizes = {
    small: 'w=400&h=400',
    medium: 'w=800&h=800',
    large: 'w=1200&q=90',
  };

  return (
    <img
      src={`/api/images/${src}?${sizes[size]}&f=webp`}
      alt={alt}
      loading="lazy"
    />
  );
};
```

---

## 📊 Analytics

Privacy-focused analytics tracking for page views and cryptid popularity.

### Client-Side Tracking

```tsx
import { analytics } from '@/lib/analytics';

// Track page view (automatic)
// Already set up in analytics.ts

// Track cryptid view
analytics.trackCryptidView('mothman', 'Mothman');

// Track custom event
analytics.trackEvent('sighting_submitted', {
  cryptid: 'mothman',
  location: 'Point Pleasant, WV'
});
```

### API Endpoints

**POST /api/analytics** - Track event
```json
{
  "event": "page_view",
  "page": "/cryptids/mothman",
  "cryptid": "Mothman",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0..."
}
```

**GET /api/analytics** - Retrieve analytics (admin only)
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_KEY" \
  https://your-domain.com/api/analytics
```

Response:
```json
{
  "popular_cryptids": [
    {
      "page": "/cryptids/mothman",
      "views": 1523,
      "last_viewed": "2024-12-16T10:30:00Z"
    }
  ]
}
```

---

## ⚡ Caching Strategy

Automatic edge caching for better performance.

### What's Cached

1. **Homepage** - 30 minutes
2. **Cryptid detail pages** - 1 hour
3. **Images** - 1 year (immutable)
4. **API responses** - Not cached (dynamic)

### Cache Headers

All responses include an `X-Cache` header:
- `HIT` - Served from cache
- `MISS` - Generated fresh

### Purging Cache

Admin endpoint to clear cache when content updates:

**POST /api/cache/purge**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"path": "/cryptids/mothman"}' \
  https://your-domain.com/api/cache/purge
```

### When to Purge

- After publishing new cryptid in Sanity
- After updating cryptid information
- After major site updates

---

## 🔒 Security Headers

Automatically added to all responses:

- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Privacy
- `X-DNS-Prefetch-Control: on` - Performance

---

## 🚀 SEO Optimization

### Automatic Features

1. **Edge caching** - Faster page loads
2. **Image optimization** - Reduced bandwidth
3. **Security headers** - Better Google ranking
4. **Fast response times** - Core Web Vitals

### Recommendations

**Use optimized images in components:**
```tsx
// Good
<img src="/api/images/cryptid.jpg?w=800&f=webp" />

// Bad (slow)
<img src="/api/images/cryptid.jpg" />
```

**Preload critical images:**
```html
<link rel="preload" as="image" href="/api/images/hero.jpg?w=1200&f=webp" />
```

---

## 📈 Setup Requirements

### 1. Update wrangler.toml

Add analytics engine binding:

```toml
[[analytics_engine_datasets]]
binding = "ANALYTICS"
```

### 2. Enable Image Resizing

Image resizing is automatically available with Cloudflare Workers.
No additional configuration needed for the current implementation.

### 3. Set Environment Variables

In Cloudflare Dashboard > Pages > Settings > Environment Variables:

```
ADMIN_API_KEY=your-secret-key-here
```

---

## 🛠️ Development vs Production

### Local Development
- Caching disabled in dev mode
- Analytics logged to console
- Image optimization may not work locally

### Production
- Full caching enabled
- Analytics tracked in D1/Analytics Engine
- Image optimization fully functional

---

## 📊 Monitoring

### Check Cache Performance

Look for `X-Cache` headers in Network tab:
- High `HIT` rate = Good caching
- High `MISS` rate = Check TTL settings

### View Popular Cryptids

```bash
curl -H "Authorization: Bearer YOUR_KEY" \
  https://your-domain.com/api/analytics
```

### Monitor Image Sizes

Check Network tab for image requests:
- WebP format = Working ✅
- Original JPEG = Not optimized ❌

---

## 🎯 Best Practices

1. **Always use WebP** for modern browsers
2. **Specify dimensions** to prevent layout shift
3. **Purge cache** after content updates
4. **Monitor analytics** for popular content
5. **Use lazy loading** for below-fold images

---

## 🐛 Troubleshooting

**Images not optimizing?**
- Check query parameters are correct
- Verify image exists in R2
- Check Cloudflare dashboard for errors

**Cache not working?**
- Check `X-Cache` headers
- Verify middleware is running
- Check TTL settings

**Analytics not tracking?**
- Check browser console for errors
- Verify endpoint is reachable
- Check D1 database connection

---

## 📚 Further Reading

- [Cloudflare Images Documentation](https://developers.cloudflare.com/images/)
- [Workers Caching API](https://developers.cloudflare.com/workers/runtime-apis/cache/)
- [Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/)
