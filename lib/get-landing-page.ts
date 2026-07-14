import type { AdviceFeedItem } from "lib/advice/advice-types";
import { getDatoLandingPageContent } from "lib/cms/landing";
import { getLatestRange, isDatoCmsConfigured } from "lib/cms/range";
import { getAdviceFeed } from "lib/advice/get-advice-feed";
import {
  defaultTriFergNav,
  LATEST_NAV_LABEL,
  socialLinks as defaultFooterLinks,
} from "lib/constants";
import type {
  LandingFeaturedContent,
  LandingLink,
  LandingPageData,
  LandingTriFergNavItem,
} from "lib/landing-types";
import { cache } from "react";

const LATEST_ADVICE_SLOT = 2;

const defaultHeaderLinks: LandingLink[] = [
  { label: LATEST_NAV_LABEL, href: "/advice", external: false },
  { label: "Shops", href: "/shops", external: false },
  { label: "Web Shop", href: "/collections/all", external: false },
  { label: "Advice", href: "/advice", external: false },
  {
    label: "Manor Place",
    href: "https://manorplace.com",
    external: false,
  },
];

function isValidFeatured(
  featured: LandingFeaturedContent | null,
): featured is LandingFeaturedContent {
  return Boolean(featured?.title?.trim() && featured?.href?.trim());
}

function featuredNavLabel(featured: LandingFeaturedContent): string {
  return featured.title.trim() || LATEST_NAV_LABEL;
}

function feedItemToFeatured(item: AdviceFeedItem): LandingFeaturedContent {
  return {
    title: item.title,
    description: null,
    href: item.path,
    image: item.image
      ? {
          src: item.image,
          width: item.width,
          height: item.height,
          srcSet: item.srcSet ?? "",
          webpSrcSet: "",
        }
      : null,
  };
}

function injectFeaturedIntoTriFerg(
  items: LandingTriFergNavItem[],
  featured: LandingFeaturedContent,
): LandingTriFergNavItem[] {
  if (items.length === 0) return items;

  const slot =
    items.length > LATEST_ADVICE_SLOT ? LATEST_ADVICE_SLOT : items.length - 1;

  return items.map((item, index) =>
    index === slot
      ? {
          ...item,
          title: featuredNavLabel(featured),
          href: featured.href,
          external: featured.href.startsWith("http"),
        }
      : item,
  );
}

function injectFeaturedIntoHeader(
  links: LandingLink[],
  featured: LandingFeaturedContent,
): LandingLink[] {
  const latestLink: LandingLink = {
    label: featuredNavLabel(featured),
    href: featured.href,
    external: featured.href.startsWith("http"),
  };

  const latestIndex = links.findIndex(
    (link) =>
      link.label === LATEST_NAV_LABEL ||
      link.href === featured.href ||
      (link.href.startsWith("/advice/") && link.href !== "/advice"),
  );

  if (latestIndex !== -1) {
    return links.map((link, index) =>
      index === latestIndex ? latestLink : link,
    );
  }

  const adviceIndex = links.findIndex((link) => link.href === "/advice");
  const insertAt = adviceIndex === -1 ? links.length : adviceIndex;
  const next = [...links];
  next.splice(insertAt, 0, latestLink);
  return next;
}

function triFergFromHeaderLinks(
  headerLinks: LandingLink[],
): LandingTriFergNavItem[] {
  const pick = [
    headerLinks.find((l) => l.href === "/shops"),
    headerLinks.find((l) => l.href === "/collections/all"),
    headerLinks.find(
      (l) => l.href.startsWith("/advice/") && l.href !== "/advice",
    ),
    headerLinks.find((l) => l.href === "/advice"),
    headerLinks.find((l) => l.external && l.href.includes("manorplace")),
  ].filter((item): item is LandingLink => Boolean(item));

  const source = pick.length >= 4 ? pick : headerLinks.slice(0, 5);

  return source.map((link, index) => ({
    title: link.label,
    href: link.href,
    external: link.external,
    fillClass: defaultTriFergNav[index]?.fillClass ?? "",
    ariaLabel:
      defaultTriFergNav[index]?.ariaLabel ??
      `${link.label.toLowerCase().replace(/\s+/g, "-")}-tri-ferg-link`,
  }));
}

async function getRangeHeaderLinks(): Promise<LandingLink[]> {
  if (!isDatoCmsConfigured()) {
    return [];
  }

  try {
    const range = await getLatestRange();
    if (!range) {
      return [];
    }

    return [
      {
        label: range.title,
        href: `/range/${range.slug}`,
        external: false,
      },
    ];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to fetch ranges from DatoCMS:", error);
    }
    return [];
  }
}

function withRangeHeaderLinks(links: LandingLink[], rangeLinks: LandingLink[]) {
  if (rangeLinks.length === 0) {
    return links;
  }

  const withoutRanges = links.filter((link) => !link.href.startsWith("/range/"));
  return [...rangeLinks, ...withoutRanges];
}

async function loadLandingPageData(): Promise<LandingPageData> {
  const [cmsLanding, adviceFeed, rangeLinks] = await Promise.all([
    getDatoLandingPageContent(),
    getAdviceFeed(),
    getRangeHeaderLinks(),
  ]);

  const latestAdvice = adviceFeed.adviceFeed[0];
  const featured = latestAdvice
    ? feedItemToFeatured(latestAdvice)
    : (cmsLanding?.featured ?? null);

  const headerLinks = withRangeHeaderLinks(
    cmsLanding?.headerLinks.length ? cmsLanding.headerLinks : defaultHeaderLinks,
    rangeLinks,
  );

  const footerLinks =
    cmsLanding?.footerLinks.length ? cmsLanding.footerLinks : defaultFooterLinks;

  const headerWithFeatured = isValidFeatured(featured)
    ? injectFeaturedIntoHeader(headerLinks, featured)
    : headerLinks;

  const triFergBase = cmsLanding?.headerLinks.length
    ? triFergFromHeaderLinks(headerWithFeatured)
    : defaultTriFergNav;

  const triFergNav = isValidFeatured(featured)
    ? injectFeaturedIntoTriFerg(triFergBase, featured)
    : triFergBase;

  return {
    featured,
    headerLinks: headerWithFeatured,
    footerLinks,
    triFergNav,
  };
}

export const getLandingPageData = cache(loadLandingPageData);