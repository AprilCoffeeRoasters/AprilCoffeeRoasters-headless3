import type { AdviceFeedResponse } from "lib/advice-types";
import {
  fetchDatoAdviceFeed,
  isDatoCmsConfigured,
} from "lib/cms/demo-store-advice";
import { datoCacheTag } from "lib/cms/datocms";
import { fetchShopifyAdviceFeed } from "lib/shopify-advice";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { headers } from "next/headers";

async function getDatoAdviceFeed(): Promise<AdviceFeedResponse> {
  "use cache";
  cacheTag(datoCacheTag());
  cacheLife("days");

  return fetchDatoAdviceFeed();
}

export async function getAdviceFeed(
  cursor?: string | null,
): Promise<AdviceFeedResponse> {
  if (isDatoCmsConfigured()) {
    try {
      return await getDatoAdviceFeed();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "DatoCMS advice feed failed, falling back to Shopify:",
          error,
        );
      }
    }
  }

  try {
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol =
      headersList.get("x-forwarded-proto") ??
      (process.env.NODE_ENV === "production" ? "https" : "http");

    const url = new URL(`${protocol}://${host}/api/advice`);
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url, { next: { revalidate: 300 } });

    if (res.ok) {
      return res.json() as Promise<AdviceFeedResponse>;
    }
  } catch {
    // Fall back when self-fetch is unavailable (e.g. build without host).
  }

  return fetchShopifyAdviceFeed({ cursor });
}
