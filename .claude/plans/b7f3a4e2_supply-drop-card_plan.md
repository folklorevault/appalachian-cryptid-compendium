# Plan: Field Supply Drop Card (Product Box)

## Overview

Create a compact "Field Supply Drop" card component styled as a bureau supply label for selling the Appalachian Cryptid vinyl sticker. Place it on the cryptid detail page and homepage.

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/FieldSupplyDrop.tsx` | **Create** — new component |
| `src/app/globals.css` | **Edit** — add `.supply-card-inner` styles |
| `src/app/cryptid/[slug]/page.tsx` | **Edit** — insert after BureauMemo (line 379) |
| `src/app/page.tsx` | **Edit** — insert before `<NewsletterSignup />` (line 95) |
| `public/products/sticker.png` | **Rename** existing image (currently has spaces/parens in name) |

---

## 1. Rename Product Image

Rename `public/products/Appalachian Cryptid (2.5 x 2.5 in) copy.png` → `public/products/sticker.png`

---

## 2. Component: `FieldSupplyDrop.tsx`

**Props:** `variant?: "detail" | "homepage"` and `className?: string`

**Condensed copy:**
- Header: `FIELD SUPPLY DROP`
- Title: `Appalachian Cryptid Decal`
- Item No: `BFC-001`
- Specs (3 key:value lines with dotted underline):
  - Size → 2.5″ vinyl
  - Finish → Matte laminate
  - Rated → Weather / UV / scratch resistant
- Price: `$4.00` + `Free shipping`
- CTA: `BUY NOW →` (stamp-styled, accent/burnt orange)
- Form ref: `Form SRD-09 · Rev. 03/1974` (top-right, tiny)

**Design:**
- Aged card background via `.supply-card-inner` (diagonal gradient, no hover lift — label feel)
- NO paper clips or hole punches (reserved for memos)
- Double border on header divider for form aesthetic
- 64px product thumbnail beside title in flex row
- Buy button in `accent` color (burnt orange) — differentiates from newsletter's green stamp
- Reuses `StampFilter` SVG for texture on button text
- Subtle `rotate(0.5deg)` on wrapper
- Stripe link opens in new tab (placeholder constant until user provides URL)

**Sizing:**
- `detail`: `max-w-xs` (320px) — compact on detail pages
- `homepage`: `max-w-sm` (384px), centered

---

## 3. CSS: `.supply-card-inner` in `globals.css`

Add after newsletter styles (~line 670):

- **Light:** 135deg diagonal gradient (slightly warmer than memo-paper), subtle inset shadow, grain pseudo-element
- **Dark:** Forest-green-tinted dark gradient (matching `.dark .memo-paper` hue family)
- No hover transform (static label)

---

## 4. Placement — Cryptid Detail Page

After BureauMemo (line 379), before Related Case Files:

```tsx
<div className="mb-8 max-w-2xl">
  <FieldSupplyDrop variant="detail" />
</div>
```

---

## 5. Placement — Homepage

Inside newsletter section, between intro text (line 94) and `<NewsletterSignup />` (line 95):

```tsx
<div className="mb-10">
  <FieldSupplyDrop variant="homepage" />
</div>
```

---

## 6. Responsive / Dark Mode

- No breakpoint changes needed — card is compact at all widths
- Dark mode: text uses auto-adapting CSS variables; `.supply-card-inner` gets dark override in CSS

---

## Verification

1. `npm run dev` — check homepage (card above newsletter) and a cryptid detail page (card after memo)
2. Toggle dark mode — should use forest-green dark tones
3. Mobile viewport (~375px) — no overflow
4. Click "Buy Now" — opens Stripe link in new tab
5. `npm run build` — no TypeScript/build errors
