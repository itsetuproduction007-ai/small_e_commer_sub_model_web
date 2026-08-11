# Rang E Renju — Homepage Sections Research

Goal: make the homepage a complete, converting e-commerce experience, informed by
web research and a reference store (`blum-fuji.myshopify.com`).

## Sources consulted
- Shopify — *Website homepage design* best-practice guide
- Shopify — *Fashion website design* guide (section structure for apparel/fashion)
- Common **CRO (conversion-rate-optimisation)** guidance for e-commerce homepages
- Reference store: `https://blum-fuji.myshopify.com/`

## What a high-converting fashion/e-commerce homepage typically contains (in order)
1. **USP / trust strip** — small bar: shipping, payment, support, quality.
2. **Hero (rotating slideshow)** — the single most important above-the-fold element.
3. **Category navigation** — image tiles linking to shop filtered by category.
4. **Featured / Best-sellers** — proof of popularity; badges, strikethrough sale prices.
5. **Lifestyle banner** — big brand / season statement image.
6. **Seasonal lookbook** — a styled, aspirational gallery of a collection/edit.
7. **Social proof** — testimonials, reviews, ratings.
8. **Instagram / community hook** — link to the store's Instagram.
9. **Brand story** — heritage, values, "why us".
10. **Newsletter / contact capture** — grow audience / invite conversation.
11. **Trust signals + footer** — policies, shipping, payment, help.

## Mapping the reference store (blum-fuji) onto Rang E Renju (Indian ethnic wear)
| Reference section | Rang E Renju equivalent |
|---|---|
| Hero slideshow (city/urban campaign) | Festival-led slideshow — "Wedding Season Edit", "Onam/Diwali/Navratri Collection" — heritage/loom backdrop, craftsmanship tagline |
| Shop by Category (Outerwear/Tops/Bottoms/Accessories) | Indian garment grid: **Sarees, Kurtas & Kurtis, Lehengas, Men's Ethnic, Dupattas & Accessories** — full-body drape shots |
| Popular Products / Signature Pieces (badges + strikethrough) | **Best Sellers** + **Signature / Limited Edition** rows; "Best Seller"/"Limited Edition" badges; festival strikethrough pricing |
| Big lifestyle statement (Tokyo culture) | Craft-heritage banner — "Rooted in the looms of Varanasi, Kanchipuram & Jaipur" |
| Seasonal lookbook + collab | Seasonal lookbook ("Wedding '26", "Onam/Diwali Edit") + regional weaver-collective spotlight |
| Trust / community | Testimonials, Instagram hook, WhatsApp support |

## Current homepage audit (vs target)
Already present: Hero (single, static), How It Works (Instagram journey), Shop by
Category (2 tiles), Search-by-code CTA, Trust signals, Footer.
To add (this build): USP strip, rotating hero slideshow, expanded category grid,
Best Sellers / Signature products, heritage banner, seasonal lookbook teaser,
testimonials, Instagram CTA, brand story, WhatsApp capture.

## Data & design notes
- **Design system:** light warm theme, maroon + gold accents, Playfair Display +
  Inter, `next/image`, existing `%`-based tokens. All new sections reuse these.
- **Products:** read from Prisma with a graceful demo fallback when the DB is
  unavailable (same pattern as `/shop`).
- **Badges & discounts:** `Product` schema has no badge/discount fields, so these
  live in a small code-keyed config inside the FeaturedProducts component
  (e.g. `RER-SAR-001` → "Best Seller", 15% off). No DB migration needed.
- **Images:** currently only demo photos exist (`/demo/*.png`). Sections use them as
  placeholders; real campaign/lookbook imagery is tracked as a TODO below.

## Asset / content TODO (owner: store)
- [ ] Festival hero campaign images (Wedding / Onam / Diwali / Navratri)
- [ ] Category tiles for Lehengas, Men's Ethnic, Dupattas (currently placeholders)
- [ ] Lookbook photography ("Wedding '26", "Onam/Diwali Edit")
- [ ] Stick a small "Best Seller"/"Limited Edition" + sale price config in
      `FeaturedProductsSection.tsx` for the real products
- [ ] Real customer review quotes (replace the sample testimonials)
