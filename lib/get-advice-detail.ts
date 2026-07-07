import type { AdviceArticleDetail } from "lib/advice-article";
import {
    fetchDatoAdviceDetail,
    isDatoCmsConfigured,
} from "lib/cms/aprilcoffee-advice";
import { fetchShopifyArticleDetail } from "lib/shopify-advice";
import type { Article } from "lib/shopify/types";

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

export async function getAdviceDetail(
  slug: string,
): Promise<AdviceArticleDetail | null> {
  if (isDatoCmsConfigured()) {
    try {
      const article = await fetchDatoAdviceDetail(slug);
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
