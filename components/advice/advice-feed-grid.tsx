"use client";

import type { AdviceFeedItem, AdviceFeedMetadata } from "lib/advice-types";
import { useState } from "react";
import { AdviceCard, type AdviceCardProps } from "./advice-card";

function splitIntoColumns(items: AdviceCardProps[]) {
  const columns: AdviceCardProps[][] = [[], [], []];

  items.forEach((item, index) => {
    columns[index % 3]!.push(item);
  });

  return columns;
}

function toCardProps(item: AdviceFeedItem): AdviceCardProps {
  return {
    title: item.title,
    href: item.path,
    image: item.image,
    srcSet: item.srcSet,
    width: item.width,
    height: item.height,
  };
}

export function AdviceFeedGrid({
  initialFeed,
  initialMetadata,
}: {
  initialFeed: AdviceFeedItem[];
  initialMetadata: AdviceFeedMetadata;
}) {
  const [items, setItems] = useState(initialFeed);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [loading, setLoading] = useState(false);

  const cardProps = items.map(toCardProps);
  const columns = splitIntoColumns(cardProps);
  const hasMore = metadata.hasNextPage;

  async function loadMore() {
    if (!metadata.endCursor || loading) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({ cursor: metadata.endCursor });
      const res = await fetch(`/api/advice?${params}`);
      if (!res.ok) return;

      const data = (await res.json()) as {
        adviceFeed: AdviceFeedItem[];
        adviceFeedMetadata: AdviceFeedMetadata;
      };

      setItems((prev) => {
        const seen = new Set(prev.map((item) => item.id));
        const next = data.adviceFeed.filter((item) => !seen.has(item.id));
        return [...prev, ...next];
      });
      setMetadata(data.adviceFeedMetadata);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Mobile: single-column feed */}
      <div
        aria-label="advice-view"
        className="flex w-full min-w-0 flex-col md:hidden"
      >
        {cardProps.map((item) => (
          <AdviceCard key={item.href} {...item} layout="mobile" />
        ))}
      </div>

      {/* md+: 3-column masonry */}
      <div
        aria-label="advice-view"
        className="hidden w-full min-w-0 md:mt-14 md:flex lg:mt-14"
      >
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="min-w-0 flex-1 basis-0 pl-0">
            {column.map((item) => (
              <AdviceCard key={item.href} {...item} layout="desktop" />
            ))}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={loadMore}
        disabled={!hasMore || loading}
        className={`w-full cursor-pointer text-center text-sm font-bold uppercase hover:underline disabled:cursor-not-allowed disabled:invisible disabled:hidden ${
          hasMore ? "" : "invisible"
        }`}
      >
        {loading ? "Loading…" : "Load More"}
      </button>
    </>
  );
}
