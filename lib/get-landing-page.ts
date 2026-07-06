// import type { AdviceFeedItem } from "lib/advice-types";
// import { getDatoLandingPageContent } from "lib/cms/landing";
// import { getAllRanges, isDatoCmsConfigured } from "lib/cms/range";
// import { getAdviceFeed } from "lib/get-advice-feed";
// import type {
//   LandingFeaturedContent,
//   LandingLink,
//   LandingPageData,
//   LandingTriFergNavItem,
// } from "lib/landing-types";
// import { cache } from "react";

// const LATEST_ADVICE_SLOT = 2;

// const defaultTriFergNav: LandingTriFergNavItem[] = [
//   {
//     title: "Shops",
//     href: "/shops",
//     fillClass: "fill-tri-ferg-red",
//     ariaLabel: "shops-tri-ferg-link",
//   },
//   {
//     title: "Web Shop",
//     href: "/collections/all",
//     fillClass: "fill-tri-ferg-grey",
//     ariaLabel: "web-shop-tri-ferg-link",
//   },
//   {
//     title: "Latest",
//     href: "/advice",
//     fillClass: "fill-tri-ferg-blue",
//     ariaLabel: "latest-advice-tri-ferg-link",
//   },
//   {
//     title: "Advice",
//     href: "/advice",
//     fillClass: "",
//     ariaLabel: "advice-tri-ferg-link",
//   },
//   {
//     title: "Manor Place",
//     href: "https://manorplace.com",
//     fillClass: "fill-tri-ferg-lime-green",
//     ariaLabel: "manor-place-tri-ferg-link",
//     external: true,
//   },
// ];

// const defaultHeaderLinks: LandingLink[] = [
//   { label: "Shops", href: "/shops", external: false },
//   { label: "SUMMER 2026 RANGE", href: "/range/summer-2026", external: false },

//   { label: "Web Shop", href: "/collections/all", external: false },
//   { label: "Advice", href: "/advice", external: false },
//   {
//     label: "Manor Place",
//     href: "https://manorplace.com",
//     external: true,
//   },
// ];

// const defaultFooterLinks: LandingLink[] = [
//   {
//     label: "Instagram",
//     href: "https://instagram.com/palaceskateboards",
//     external: true,
//   },
//   {
//     label: "TikTok",
//     href: "https://www.tiktok.com/@palaceskateboards",
//     external: true,
//   },
//   {
//     label: "Apple Music",
//     href: "https://apple.co/palace",
//     external: true,
//   },
//   {
//     label: "YouTube",
//     href: "https://www.youtube.com/channel/UCADVAEBl9ZZ9gFOwURmm2kA",
//     external: true,
//   },
//   { label: "WeChat", href: "/wechat", external: false },
//   {
//     label: "Weibo",
//     href: "https://weibo.com/u/7322458413",
//     external: true,
//   },
//   {
//     label: "Mailing List",
//     href: "https://mailing-list.palaceskateboards.com",
//     external: true,
//   },
//   {
//     label: "Boring Stuff",
//     href: "https://boring.palaceskateboards.com/",
//     external: true,
//   },
// ];

// function feedItemToFeatured(item: AdviceFeedItem): LandingFeaturedContent {
//   return {
//     title: item.title,
//     description: null,
//     href: item.path,
//     image: item.image
//       ? {
//           src: item.image,
//           width: item.width,
//           height: item.height,
//           srcSet: item.srcSet ?? "",
//           webpSrcSet: "",
//         }
//       : null,
//   };
// }

// function injectFeaturedIntoTriFerg(
//   items: LandingTriFergNavItem[],
//   featured: LandingFeaturedContent,
// ): LandingTriFergNavItem[] {
//   if (items.length === 0) return items;

//   const slot =
//     items.length > LATEST_ADVICE_SLOT ? LATEST_ADVICE_SLOT : items.length - 1;

//   return items.map((item, index) =>
//     index === slot
//       ? {
//           ...item,
//           title: featured.title,
//           href: featured.href,
//           external: featured.href.startsWith("http"),
//         }
//       : item,
//   );
// }

// function injectFeaturedIntoHeader(
//   links: LandingLink[],
//   featured: LandingFeaturedContent,
// ): LandingLink[] {
//   const adviceIndex = links.findIndex(
//     (link) =>
//       link.href === featured.href ||
//       (link.href.startsWith("/advice/") && link.href !== "/advice"),
//   );

//   if (adviceIndex === -1) {
//     const insertAt = Math.min(2, links.length);
//     const next = [...links];
//     next.splice(insertAt, 0, {
//       label: featured.title,
//       href: featured.href,
//       external: featured.href.startsWith("http"),
//     });
//     return next;
//   }

//   return links.map((link, index) =>
//     index === adviceIndex
//       ? {
//           label: featured.title,
//           href: featured.href,
//           external: featured.href.startsWith("http"),
//         }
//       : link,
//   );
// }

// function triFergFromHeaderLinks(
//   headerLinks: LandingLink[],
// ): LandingTriFergNavItem[] {
//   const pick = [
//     headerLinks.find((l) => l.href === "/shops"),
//     headerLinks.find((l) => l.href === "/collections/all"),
//     headerLinks.find(
//       (l) => l.href.startsWith("/advice/") && l.href !== "/advice",
//     ),
//     headerLinks.find((l) => l.href === "/advice"),
//     headerLinks.find((l) => l.external && l.href.includes("manorplace")),
//   ].filter((item): item is LandingLink => Boolean(item));

//   const source = pick.length >= 4 ? pick : headerLinks.slice(0, 5);

//   return source.map((link, index) => ({
//     title: link.label,
//     href: link.href,
//     external: link.external,
//     fillClass: defaultTriFergNav[index]?.fillClass ?? "",
//     ariaLabel:
//       defaultTriFergNav[index]?.ariaLabel ??
//       `${link.label.toLowerCase().replace(/\s+/g, "-")}-tri-ferg-link`,
//   }));
// }

// async function getRangeHeaderLinks(): Promise<LandingLink[]> {
//   if (!isDatoCmsConfigured()) {
//     return [];
//   }

//   try {
//     const ranges = await getAllRanges();
//     return ranges.map((range) => ({
//       label: range.title,
//       href: `/range/${range.slug}`,
//       external: false,
//     }));
//   } catch (error) {
//     if (process.env.NODE_ENV === "development") {
//       console.warn("Failed to fetch ranges from DatoCMS:", error);
//     }
//     return [];
//   }
// }

// function withRangeHeaderLinks(links: LandingLink[], rangeLinks: LandingLink[]) {
//   if (rangeLinks.length === 0) {
//     return links;
//   }

//   const withoutRanges = links.filter((link) => !link.href.startsWith("/range/"));
//   return [...rangeLinks, ...withoutRanges];
// }

// async function loadLandingPageData(): Promise<LandingPageData> {
//   const [cmsLanding, adviceFeed, rangeLinks] = await Promise.all([
//     getDatoLandingPageContent(),
//     getAdviceFeed(),
//     getRangeHeaderLinks(),
//   ]);

//   console.log("[landing page datoCMS]", { cmsLanding, adviceFeed });

//   const latestAdvice = adviceFeed.adviceFeed[0];
//   let featured =
//     cmsLanding?.featured ??
//     (latestAdvice ? feedItemToFeatured(latestAdvice) : null);

//   if (featured && latestAdvice) {
//     const featuredArticle = featured;
//     const matched = adviceFeed.adviceFeed.find(
//       (item) =>
//         item.slug === featuredArticle.href.replace(/^\/advice\//, "") ||
//         item.title.toLowerCase() === featuredArticle.title.toLowerCase(),
//     );
//     if (matched) {
//       featured = {
//         ...featured,
//         href: matched.path,
//         image: featured.image ?? {
//           src: matched.image,
//           width: matched.width,
//           height: matched.height,
//           srcSet: matched.srcSet ?? "",
//           webpSrcSet: "",
//         },
//       };
//     }
//   }

//   const headerLinks = withRangeHeaderLinks(
//     cmsLanding?.headerLinks.length ? cmsLanding.headerLinks : defaultHeaderLinks,
//     rangeLinks,
//   );

//   const footerLinks =
//     cmsLanding?.footerLinks.length ? cmsLanding.footerLinks : defaultFooterLinks;

//   const headerWithFeatured = featured
//     ? injectFeaturedIntoHeader(headerLinks, featured)
//     : headerLinks;

//   const triFergBase = cmsLanding?.headerLinks.length
//     ? triFergFromHeaderLinks(headerWithFeatured)
//     : defaultTriFergNav;

//   const triFergNav = featured
//     ? injectFeaturedIntoTriFerg(triFergBase, featured)
//     : triFergBase;

//   return {
//     featured,
//     headerLinks: headerWithFeatured,
//     footerLinks,
//     triFergNav,
//   };
// }

// export const getLandingPageData = cache(loadLandingPageData);
import type { AdviceFeedItem } from "lib/advice-types";
import { getDatoLandingPageContent } from "lib/cms/landing";
import { getLatestRange, isDatoCmsConfigured } from "lib/cms/range";
import { getAdviceFeed } from "lib/get-advice-feed";
import type {
  LandingFeaturedContent,
  LandingLink,
  LandingPageData,
  LandingTriFergNavItem,
} from "lib/landing-types";
import { cache } from "react";

const LATEST_ADVICE_SLOT = 2;

const defaultTriFergNav: LandingTriFergNavItem[] = [
  {
    title: "Shops",
    href: "/shops",
    fillClass: "fill-tri-ferg-red",
    ariaLabel: "shops-tri-ferg-link",
  },
  {
    title: "Web Shop",
    href: "/collections/all",
    fillClass: "fill-tri-ferg-grey",
    ariaLabel: "web-shop-tri-ferg-link",
  },
  {
    title: "Latest",
    href: "/advice",
    fillClass: "fill-tri-ferg-blue",
    ariaLabel: "latest-advice-tri-ferg-link",
  },
  {
    title: "Advice",
    href: "/advice",
    fillClass: "",
    ariaLabel: "advice-tri-ferg-link",
  },
  {
    title: "Manor Place",
    href: "https://manorplace.com",
    fillClass: "fill-tri-ferg-lime-green",
    ariaLabel: "manor-place-tri-ferg-link",
    external: true,
  },
];

const defaultHeaderLinks: LandingLink[] = [
  { label: "Shops", href: "/shops", external: false },
  { label: "Web Shop", href: "/collections/all", external: false },
  { label: "Latest", href: "/advice", external: false },
  { label: "Advice", href: "/advice", external: false },
  {
    label: "Manor Place",
    href: "https://manorplace.com",
    external: false,
  },
];

const defaultFooterLinks: LandingLink[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/palaceskateboards",
    external: true,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@palaceskateboards",
    external: true,
  },
  {
    label: "Apple Music",
    href: "https://apple.co/palace",
    external: true,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCADVAEBl9ZZ9gFOwURmm2kA",
    external: true,
  },
  { label: "WeChat", href: "/wechat", external: false },
  {
    label: "Weibo",
    href: "https://weibo.com/u/7322458413",
    external: true,
  },
  {
    label: "Mailing List",
    href: "https://mailing-list.palaceskateboards.com",
    external: true,
  },
  {
    label: "Boring Stuff",
    href: "https://boring.palaceskateboards.com/",
    external: true,
  },
];

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
          title: featured.title,
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
    label: "Latest",
    href: featured.href,
    external: featured.href.startsWith("http"),
  };

  const latestIndex = links.findIndex(
    (link) =>
      link.label === "Latest" ||
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

  const headerWithFeatured = featured
    ? injectFeaturedIntoHeader(headerLinks, featured)
    : headerLinks;

  const triFergBase = cmsLanding?.headerLinks.length
    ? triFergFromHeaderLinks(headerWithFeatured)
    : defaultTriFergNav;

  const triFergNav = featured
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