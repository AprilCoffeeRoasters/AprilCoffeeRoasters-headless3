"use client";

import type { ShopGalleryImage } from "lib/cms/shops";
import { useCallback, useState } from "react";

const MAX_HEIGHT = 540;

function GalleryArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      fill="#D1D5DB"
      xmlns="http://www.w3.org/2000/svg"
      width="12px"
      height="14px"
      viewBox="0 0 123.96 123.96"
      strokeWidth={0}
      className={`hover:fill-black ${direction === "right" ? "rotate-180" : "rotate-0"}`}
      aria-hidden
    >
      <path d="M85.742,1.779l-56,56c-2.3,2.3-2.3,6.1,0,8.401l56,56c3.801,3.8,10.2,1.1,10.2-4.2v-112 C95.942,0.679,89.543-2.021,85.742,1.779z" />
    </svg>
  );
}

export default function ShopGalleryCarousel({
  images,
  alt,
}: {
  images: ShopGalleryImage[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  if (count === 0) return null;

  const slidePercent = 100 / count;
  const trackOffset = index * slidePercent;

  return (
    <div aria-label="gallery-carousel" className="flex w-full flex-col items-center">
      <div
        className="relativeter overflow-hidden transition-[height] duration-300"
        style={{ maxHeight: MAX_HEIGHT }}
      >
        {count > 1 ? (
          <button
            type="button"
            aria-label="left-gallery-button"
            className="z-10 shrink-0 cursor-pointer bg-white p-2 max-md:absolute max-md:left-0 max-md:h-full max-md:bg-transparent"
            onClick={() => goTo(index - 1)}
          >
            <GalleryArrow direction="left" />
          </button>
        ) : null}

        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            aria-label="gallery-images"
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              width: `${count * 100}%`,
              transform: `translateX(-${trackOffset}%)`,
            }}
          >
            {images.map((image) => (
              <div
                key={image.src}
                aria-label={`image-${image.src}`}
                className="shrink-0"
                style={{ flex: `0 0 ${slidePercent}%` }}
              >
                <div
                  className="relative w-full shrink-0 overflow-hidden"
                  style={{ maxHeight: MAX_HEIGHT }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    srcSet={image.srcSet}
                    sizes="(min-width: 768px) 1024px, 100vw"
                    alt={alt}
                    className="mx-auto block h-auto w-full max-h-[540px] object-contain"
                    width={image.width}
                    height={image.height}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {count > 1 ? (
          <button
            type="button"
            aria-label="right-gallery-button"
            className="z-10 shrink-0 cursor-pointer bg-white p-2 max-md:absolute max-md:right-0 max-md:h-full max-md:bg-transparent"
            onClick={() => goTo(index + 1)}
          >
            <GalleryArrow direction="right" />
          </button>
        ) : null}
      </div>

      {count > 1 ? (
        <div
          aria-label="gallery-index"
          className="mt-3 flex w-full justify-end text-sm text-[#9ca3af] max-md:justify-center"
        >
          {index + 1} / {count}
        </div>
      ) : null}
    </div>
  );
}
