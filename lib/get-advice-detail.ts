import type { AdviceArticleDetail } from "lib/advice-article";
import {
    fetchDatoAdviceDetail,
    isDatoCmsConfigured,
} from "lib/cms/demo-store-advice";
import { datoCacheTag } from "lib/cms/datocms";
import { fetchShopifyArticleDetail } from "lib/shopify-advice";
import type { Article } from "lib/shopify/types";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";

export function shopifyArticleToDetail(article: Article): AdviceArticleDetail {
  return {
    title: article.title,
    image: article.image?.url
      ? {
          url: article.image.url,
          altText: article.image.altText || article.title,
        }
      : undefined,
    contentHtml: article.contentHtml || undefined,
    excerpt: article.excerpt || undefined,
  };
}

async function getDatoAdviceDetail(
  slug: string,
): Promise<AdviceArticleDetail | null> {
  "use cache";
  cacheTag(datoCacheTag(), `dato:article:${slug}`);
  cacheLife("days");

  return fetchDatoAdviceDetail(slug);
}

export async function getAdviceDetail(
  slug: string,
): Promise<AdviceArticleDetail | null> {
  if (isDatoCmsConfigured()) {
    try {
      const article = await getDatoAdviceDetail(slug);
      if (article) return article;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `DatoCMS advice "${slug}" failed, falling back to Shopify:`,
          error,
        );
      }
    }
  }

  const article = await fetchShopifyArticleDetail("advice", slug);
  return article ? shopifyArticleToDetail(article) : null;
}
