# Plan: Navigation Redesign + Gift Shop Page

## Overview

Two changes: (1) rebuild the nav from a single-row hamburger layout to a stacked centered layout, and (2) create a `/shop` page with an expanded product card and photo gallery.

---

## Key Decisions & Feedback

### 1. No separate product detail page (yet)
With one product, building `/shop/[slug]` is over-engineering. The shop page itself will display the full product card with all 4 lifestyle photos inline. When a second product arrives, extract the card into a loop — easy upgrade path.

### 2. "Field Guide" nav link → href="/"
Your current "Field Guide" link points to `/` (the homepage cryptid directory). I'll keep that — it's the main landing page and the logo/title also links there, so it should stay as the primary nav entry. `/field-guide` is a separate combined reference page that users reach via other links.

### 3. Nav is fully sticky (all rows)
The new header is ~85px tall (title row + link row). That's compact enough to be sticky without feeling intrusive. Making only the link row sticky would require extra JS complexity for no real gain.

### 4. Mobile breakpoint moves from `xl` (1280px) to `md` (768px)
The new link bar has 5 short labels on desktop and 4 on mobile — this fits comfortably at `md`. The old nav needed `xl` because it crammed logo + links + support + report button into one row.

### 5. "File a Report" moves to footer + mobile "More" dropdown
Desktop nav gets exactly 5 clean links: Field Guide | Anomalies | Sightings Map | Bulletins | Shop. "File a Report" and "About" go to the footer. Mobile "More" dropdown includes: Anomalies, Bulletins, File a Report.

### 6. Custom dropdown, no new dependencies
The "More" dropdown is ~25 lines of `useState` + click-outside handler. No need to install shadcn DropdownMenu for this.

---

## Changes by File

### 1. Rewrite `src/components/Header.tsx`

**Current**: Single row with logo left, links center, support/report right. Hamburger mobile menu at `xl` breakpoint.

**New structure**:
```
<header> (sticky, paper-texture-nav, bg-card, border-b)
  Row 1: Centered title link
    Desktop (md+): "Appalachian Cryptid Field Guide"
    Mobile (<md): "Appalachian Cryptid"

  Row 2: Centered nav links
    Desktop (md+): Field Guide | Anomalies | Sightings Map | Bulletins | Shop
    Mobile (<md): Guide | Shop | Map | More▼
      └─ Dropdown: Anomalies, Bulletins, File a Report
</header>
```

- Remove hamburger menu, `Menu`/`X`/`Heart` lucide imports
- Add `ChevronDown` import for the "More" indicator
- Add `useRef`/`useEffect` for click-outside dropdown close
- Keep `usePathname` for active link styling (wavy underline)
- Keep `"use client"` directive
- Pipe separators between links (same pattern as current desktop)
- Active link gets `nav-link-active` class (existing CSS)

**Desktop nav items**: `["/", "Field Guide"], ["/anomalies", "Anomalies"], ["/map", "Sightings Map"], ["/bulletins", "Bulletins"], ["/shop", "Shop"]`

**Mobile nav items**: `["/", "Guide"], ["/shop", "Shop"], ["/map", "Map"]`
**Mobile "More" items**: `["/anomalies", "Anomalies"], ["/bulletins", "Bulletins"], ["/report", "File a Report"]`

### 2. Edit `src/components/Footer.tsx`

Add "About" and "Support" to the full variant. Restructure columns:

- **Column 1 "Explore"**: Field Guide, Anomalies, Sightings Map, Bulletins, Shop
- **Column 2 "Bureau"**: About, File a Report, Support (ko-fi external link with Heart icon)
- **Column 3 "A Note"**: Keep existing Indigenous traditions text

Import `Heart` from lucide-react (moved from Header).

### 3. Create `src/app/shop/page.tsx`

Server component following the exact bulletins page pattern:
- Metadata with title, description, OG tags
- Hero section with classification label + rules + H1 + subtitle
- Intro copy section (the user's provided paragraph)
- Product section with `ShopProductCard`
- Simple footer

### 4. Create `src/components/ShopProductCard.tsx`

Expanded version of `FieldSupplyDrop` — same design DNA, larger format:
- Uses `supply-card-inner` manila paper background
- Same double-rule header ("Field Supply Drop"), form reference tag
- Larger hero image (w-64/w-80 responsive)
- Title + item number
- Short description paragraph
- **2x2 photo gallery** with the 4 lifestyle images (doorpic, laptop, outdoor, upclose)
- Full spec table (Diameter, Material, Print, Rated, Use)
- Price ($4.00) + stamp-style Buy Now button
- Max width ~640px, centered, subtle rotation (0.8deg)

### 5. Edit `src/app/sitemap.ts`

Add `/shop` entry after `/bulletins`:
```ts
{ url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 }
```

### 6. No changes needed to:
- `layout.tsx` — ClassificationStripe + Header ordering already correct
- `globals.css` — all CSS classes exist (`supply-card-inner`, `supply-stamp-btn`, `paper-texture-nav`, `nav-link-active`)
- `next.config.ts` — `/products/` images already work (FieldSupplyDrop proves this)
- Sanity schema — shop is static content with direct Stripe link

---

## Verification

1. `npm run dev` — check all pages render
2. Desktop nav: verify 5 centered links, logo/title centered above, all links route correctly
3. Mobile nav (resize to <768px): verify 4 links with "More" dropdown, dropdown opens/closes correctly, closes on outside click and Escape key
4. `/shop` page: verify hero, intro copy, product card with gallery, Buy Now links to Stripe
5. Footer: verify About, Support, and File a Report links appear in full variant
6. `npm run build` — ensure no build errors
7. Check active link styling works on each page
