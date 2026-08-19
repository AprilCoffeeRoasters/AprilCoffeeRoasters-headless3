import type { LandingLink, LandingTriFergNavItem } from "lib/landing-types";

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: "Relevance",
  slug: null,
  sortKey: "RELEVANCE",
  reverse: false,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Trending",
    slug: "trending-desc",
    sortKey: "BEST_SELLING",
    reverse: false,
  }, // asc
  {
    title: "Latest arrivals",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    title: "Price: Low to high",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  }, // asc
  {
    title: "Price: High to low",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
];

export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
};

export const FALLBACK_STATIC_PARAMS = [{ slug: "__placeholder__" }];
export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const COLLECTION_PRODUCTS_PAGE_SIZE = 30;
export const DEFAULT_OPTION = "Default Title";
export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2023-01/graphql.json";

/** Read at call time so production env (e.g. Vercel) is applied, not only build-time values. */
export function getShopifyHomeFeaturedCollectionHandle(): string {
  return (
    process.env.SHOPIFY_HOME_FEATURED_COLLECTION_HANDLE?.trim() ||
    "hidden-homepage-featured-items"
  );
}

export function getShopifyHomeCarouselCollectionHandle(): string {
  return (
    process.env.SHOPIFY_HOME_CAROUSEL_COLLECTION_HANDLE?.trim() ||
    "hidden-homepage-carousel"
  );
}

export function getShopifyAdviceCollectionHandle(): string {
  return process.env.SHOPIFY_ADVICE_COLLECTION_HANDLE?.trim() || "all";
}

export function getShopifyAdviceBlogHandle(): string | undefined {
  const handle = process.env.SHOPIFY_ADVICE_BLOG_HANDLE?.trim();
  return handle || undefined;
}

export function getShopifyLookbookBlogHandle(): string | undefined {
  const handle = process.env.SHOPIFY_LOOKBOOK_BLOG_HANDLE?.trim();
  return handle || undefined;
}

export type ShopifyAdviceFeedSource = "auto" | "blog" | "products";

export function getShopifyAdviceFeedSource(): ShopifyAdviceFeedSource {
  const source = process.env.SHOPIFY_ADVICE_FEED_SOURCE?.trim();
  if (source === "blog" || source === "products") {
    return source;
  }
  return "auto";
}

export const ADVICE_PAGE_SIZE = 24;
export const SHOPIFY_ADVICE_PAGE_SIZE = ADVICE_PAGE_SIZE;

export type FooterLinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const shopLinks = [
  "Australia Shop",
  "Canada Shop",
  "EU Shop",
  "Japan Shop",
  "World Shop",
  "USA Shop",
];

export const boringLinks: FooterLinkItem[] = [
  {
    label: "Terms Of Service",
    href: "https://www.aprilcoffeeroasters.com/policies/terms-of-service",
  },
  {
    label: "Returns & Refunds",
    href: "https://boring.palaceskateboards.com/row/returns-information/",
  },
  {
    label: "Shipping Terms",
    href: "https://www.aprilcoffeeroasters.com/pages/shipping-terms",
  },
  {
    label: "Privacy Policy",
    href: "https://www.aprilcoffeeroasters.com/policies/privacy-policy",
  },
];

export const socialLinks: LandingLink[] = [
  {
    label: "Wholesale",
    href: "https://wholesale-aprilcoffeeroastery.com/",
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/aprilcoffeecph",
    external: true,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCPlsOYZ8ZEam57EUCf3DKjg",
    external: true,
  },
  {
    label: "SMILEY",
    href: "https://www.findsmiley.dk/1347286",
    external: true,
  },
 
  {
    label: "Mailing List",
    href: "https://mailchi.mp/aprilcoffeeroastery.com/april-coffee-newsletter",
    external: true ,
  },
  {
    label: "Get in Touch & FAQ",
    href: "/get-in-contact",
    external: false,
  },
  {
    label: "Tasting Menu Booking",
    href: "/april-tasting-menu",
    external: false,
  },
];

export const LATEST_NAV_LABEL = "Latest";

export const defaultTriFergNav: LandingTriFergNavItem[] = [
  {
    title: "LOCATIONS",
    href: "/shops",
    fillClass: "fill-tri-ferg-red",
    ariaLabel: "shops-tri-ferg-link",
  },
  {
    title: "WEBSHOP",
    href: "/collections/new",
    fillClass: "fill-tri-ferg-grey",
    ariaLabel: "web-shop-tri-ferg-link",
  },
 
  {
    title: "PROJECTS",
    href: "/advice",
    fillClass: "fill-tri-ferg-blue",
    ariaLabel: "latest-advice-tri-ferg-link",
  },
  {
    title: "COFFEE & INFO",
    href: "/advice",
    fillClass: "",
    ariaLabel: "advice-tri-ferg-link",
  },
  {
    title: "INFO SP",
    href: "https://sustainableprofilecoffee.com/",
    fillClass: "fill-tri-ferg-lime-green",
    ariaLabel: "manor-place-tri-ferg-link",
    external: true,
  },
];
