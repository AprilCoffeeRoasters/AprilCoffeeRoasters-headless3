# Demo Commerce

A Palace Skateboards–inspired headless storefront. It combines a Shopify-powered web shop with editorial content from DatoCMS and Shopify blogs.

Built with the Next.js App Router, React Server Components, Server Actions, `Suspense`, and partial prerendering (PPR).

## How it works

**Commerce (Shopify)** — Products, collections, cart, and checkout are powered by the Shopify Storefront API. Customers browse and buy through standard shop routes; checkout redirects to Shopify.

**Editorial content** — The advice feed and article pages prefer DatoCMS when `DATOCMS_API_TOKEN` is set. If DatoCMS is unavailable or not configured, the app falls back to Shopify blog posts (advice and lookbook handles) or a product grid from a collection.

**CMS pages (DatoCMS)** — When configured, DatoCMS also supplies the landing page hero and featured content, seasonal product ranges, and retail shop listings with galleries. Without DatoCMS, those sections use app defaults or Shopify data.

**Cache revalidation** — Webhook endpoints invalidate cached Shopify and DatoCMS content on publish, so updates appear without a full redeploy.

## Features

- **Landing page** — Tri-Ferg navigation linking to shops, web shop, advice, and external destinations
- **Web shop** — Collections, product detail, cart, and Shopify checkout
- **Advice** — Editorial feed from DatoCMS (when configured) or Shopify blog posts / product grids
- **Lookbook** — Shopify blog articles for seasonal lookbooks
- **Range** — Seasonal product ranges and lookbook-style product pages from DatoCMS
- **Shops** — Retail location listings and galleries from DatoCMS
- **On-demand revalidation** — Webhook endpoints for Shopify and DatoCMS cache invalidation

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Commerce | Shopify Storefront API |
| Content | DatoCMS (optional) |
| Language | TypeScript |

## Routes

| Path | Description |
| --- | --- |
| `/` | Landing page with Tri-Ferg nav |
| `/collections/all` | All products |
| `/collections/[collection]` | Collection page with filters |
| `/product/[handle]` | Standard product page |
| `/range/[slug]` | DatoCMS seasonal range |
| `/range/[slug]/product/[handle]` | Range product detail |
| `/advice` | Advice feed |
| `/advice/[slug]` | Advice article |
| `/lookbook/[slug]` | Lookbook article (Shopify blog) |
| `/shops` | Shop directory |
| `/shops/[slug]` | Shop detail |
| `/cart` | Shopping cart |
| `/checkout` | Checkout redirect |

## API routes

| Endpoint | Purpose |
| --- | --- |
| `GET /api/advice` | Paginated advice feed |
| `GET /api/advice/[slug]` | Single advice article |
| `GET /api/collections/products` | Collection products (pagination) |
| `POST /api/revalidate` | Shopify on-demand revalidation |
| `POST /api/revalidate-dato` | DatoCMS on-demand revalidation |

## Project structure

```
app/
  (landing)/     # Palace-style pages (landing, shop, advice, range, shops)
  (store)/       # Alternate product routes
  api/           # Advice feed and revalidation endpoints
components/
  store/         # Shop UI (header, footer, product cards, cart)
  advice/        # Editorial feed and article detail
lib/
  shopify/       # Shopify Storefront API client, queries, mutations
  cms/           # DatoCMS client (landing, ranges, shops, advice)
  store/         # Product/collection helpers and mappers
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values. **Do not commit `.env` or `.env.local`** — they contain secrets that grant access to your Shopify store and DatoCMS project.

### Site

| Variable | Description |
| --- | --- |
| `COMPANY_NAME` | Company name used in metadata |
| `SITE_NAME` | Site title |
| `NEXT_PUBLIC_SITE_URL` | Public origin for post-checkout `return_to` URLs |

### Shopify

| Variable | Description |
| --- | --- |
| `SHOPIFY_STORE_DOMAIN` | Store subdomain, e.g. `your-store.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token |
| `SHOPIFY_REVALIDATION_SECRET` | Secret for `POST /api/revalidate` |
| `SHOPIFY_ADVICE_FEED_SOURCE` | `auto`, `blog`, or `products` (default: `auto`) |
| `SHOPIFY_ADVICE_BLOG_HANDLE` | Blog handle for advice articles (default: `advice`) |
| `SHOPIFY_LOOKBOOK_BLOG_HANDLE` | Blog handle for lookbook articles (default: `lookbook`) |
| `SHOPIFY_ADVICE_COLLECTION_HANDLE` | Fallback collection when no blogs are configured (default: `all`) |
| `SHOPIFY_HOME_FEATURED_COLLECTION_HANDLE` | Featured collection on homepage |
| `SHOPIFY_HOME_CAROUSEL_COLLECTION_HANDLE` | Carousel collection on homepage |

### DatoCMS (optional)

When `DATOCMS_API_TOKEN` is set, the app loads homepage content, advice articles, seasonal ranges, and shop pages from DatoCMS. Without it, those sections fall back to defaults or Shopify data.

| Variable | Description |
| --- | --- |
| `DATOCMS_API_TOKEN` | Content Delivery API read token |
| `DATOCMS_WEBHOOK_SECRET` | Secret for `POST /api/revalidate-dato` |

## Running locally

```bash
pnpm install
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
pnpm build    # Production build
pnpm start    # Start production server
pnpm test     # Prettier check
```

## Content sources

**Advice feed** — Controlled by `SHOPIFY_ADVICE_FEED_SOURCE`:

- `auto` — DatoCMS if configured; otherwise Shopify blog if handles are set; otherwise product grid from a collection
- `blog` — Shopify blog articles (`SHOPIFY_ADVICE_BLOG_HANDLE` and `SHOPIFY_LOOKBOOK_BLOG_HANDLE`)
- `products` — Product grid from `SHOPIFY_ADVICE_COLLECTION_HANDLE`

**Ranges and shops** — Require DatoCMS. Range slugs are used for static generation when the API token is present.

## Deployment

Deploy to [Vercel](https://vercel.com) or any Node.js host that supports Next.js 15. Set all environment variables in your hosting provider before deploying.

For Shopify integration details, see the [Vercel Shopify integration guide](https://vercel.com/docs/integrations/ecommerce/shopify).

Configure DatoCMS webhooks to call `POST /api/revalidate-dato` with the `DATOCMS_WEBHOOK_SECRET` header when content is published.

