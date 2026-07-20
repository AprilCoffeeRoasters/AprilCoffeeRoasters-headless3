"use client";

import clsx from "clsx";
import CategoryNav from "components/store/collections/category-nav";
import Logo from "components/store/logo/logo";
import ProductMetafieldModal from "components/store/product/product-metafield-modal";
import ProductPageAddToCart from "components/store/product/product-page-add-to-cart";
import type { Product } from "lib/shopify/types";
import type {
  ParsedSizeChart,
  ParsedTechnicalDetails,
} from "lib/store/parse-product-metafields";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type UIEvent } from "react";
import Footer from "../layout/footer";

export type ProductPageImage = {
  src: string;
  thumbSrc: string;
  zoom: string;
  label: string;
};

export type ProductPageVariant = {
  id: string;
  label: string;
  price: string;
  priceAmount: string;
};

export type ProductPageRelated = {
  handle: string;
  alt: string;
  image: string;
  active: boolean;
};

export type ProductPageClientProps = {
  product: Product;
  productId: string;
  handle: string;
  title: string;
  descriptionLines: string[];
  technicalDetails: ParsedTechnicalDetails | null;
  sizeChart: ParsedSizeChart | null;
  images: ProductPageImage[];
  variants: ProductPageVariant[];
  relatedProducts: ProductPageRelated[];
  /** When set, product links use `/range/[slug]/product/[handle]`. */
  rangeSlug?: string;
};

function CarouselArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      fill="#d1d5db"
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 123.96 123.96"
      strokeWidth={0}
      className={`hover:fill-black ${direction === "right" ? "rotate-180" : "rotate-0"}`}
    >
      <path d="M85.742,1.779l-56,56c-2.3,2.3-2.3,6.1,0,8.401l56,56c3.801,3.8,10.2,1.1,10.2-4.2v-112 C95.942,0.679,89.543-2.021,85.742,1.779z" />
    </svg>
  );
}

function ProductHeader({
  title,
  price,
  className = "",
  withIds = true,
}: {
  title: string;
  price: string;
  className?: string;
  withIds?: boolean;
}) {
  return (
    <div
      aria-label="product-header"
      className={`w-full select-none uppercase ${className}`}
      {...(withIds ? { id: "product-header" } : {})}
    >
      <h1
        aria-label="product-title"
        {...(withIds ? { id: "product-title" } : {})}
        className="
          text-[24px]
          font-bold
          italic
          leading-[24px]
          text-black

          sm:text-[32px]
          sm:leading-[32px]
        "
      >
        {title}
      </h1>

      <h3
        aria-label="product-price"
        {...(withIds ? { id: "product-price" } : {})}
        className="mt-0 text-[15px] font-bold"
      >
        <span>{price}</span>
      </h3>
    </div>
  );
}

function productHref(handle: string, rangeSlug?: string): string {
  return rangeSlug
    ? `/range/${rangeSlug}/product/${handle}`
    : `/product/${handle}`;
}

export default function ProductPageClient({
  product,
  productId,
  title,
  descriptionLines,
  technicalDetails,
  sizeChart,
  images,
  variants,
  relatedProducts,
  rangeSlug,
}: ProductPageClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openMetafieldModal, setOpenMetafieldModal] = useState<
    "technical-details" | "size-chart" | null
  >(null);
  
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id ?? "",
  );
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const desktopCarouselRef = useRef<HTMLDivElement>(null);
  const [galleryMode, setGalleryMode] = useState(false);

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];
  const hasAnyVariantAvailable = product.variants.some(
    (variant) => variant.availableForSale,
  );

  const getActiveCarousel = () => {
    if (typeof window === "undefined") {
      return desktopCarouselRef.current;
    }
    return window.matchMedia("(max-width: 767px)").matches
      ? mobileCarouselRef.current
      : desktopCarouselRef.current;
  };

  const handleCarouselScroll = (event: UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    if (index !== selectedImage) {
      setSelectedImage(index);
    }
  };

  const scrollToImage = (index: number) => {
    if (images.length === 0) return;

    const nextIndex = ((index % images.length) + images.length) % images.length;
    setSelectedImage(nextIndex);
    const container = getActiveCarousel();
    if (container) {
      container.scrollTo({
        left: nextIndex * container.clientWidth,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!galleryMode) return;
    const container = mobileCarouselRef.current;
    if (!container) return;
    container.scrollTo({
      left: selectedImage * container.clientWidth,
      behavior: "auto",
    });
    // Sync scroll position only when gallery opens
    // eslint-disable-next-line react-hooks/exhaustive-deps -- selectedImage read at open time
  }, [galleryMode]);

  return (
    <>
      <Logo
        onMenuOpenChange={setMenuOpen}
        productGalleryOpen={galleryMode}
        onProductGalleryClose={() => setGalleryMode(false)}
      />
      {/* <div className="mx-auto h-screen w-full max-w-[1400px] overflow-hidden bg-white"> */}
      <div className="mx-auto h-screen sm:mt-0 mt-3 sm:mb-5 mb-0 w-full max-w-[1400px] overflow-y-auto bg-white">
      {/* <div className="mx-auto   w-full max-w-352  min-h-0"> */}
        {/* <div className="mx-auto w-full max-w-[1108px] min-h-0"> */}
        <CategoryNav menuOpen={menuOpen} />

        <main
          role="main"
          id="mainContent"
          className="
  h-[calc(100vh-130px)]
  min-h-0
  overflow-y-scroll
  mt-0
  // w-9/12
  w-[73%]
  sm:w-[7%]
  pr-[20px]

  ease-out
  duration-300

  sm:mt-8
  sm:w-[75.2%]

  max-md:h-auto
  max-md:overflow-y-visible
  max-md:float-none
  max-md:mt-0
  max-md:w-full
  max-md:pr-0
  max-md:-translate-x-0
"
//           className="
//   h-[calc(100vh-130px)]
//   overflow-y-scroll
//   mt-0
//   sm:mt-8
//   w-9/12 
//   sm:w-[78%]
// "
       
//  className="h-[calc(100vh-130px)] min-h-0 overflow-y-auto mt-5 w-9/12 max-md:h-auto max-md:overflow-y-visible max-md:float-none max-md:mt-0 max-md:w-full md:w-10/12 max-md:-translate-x-0 ease-out duration-300"
        >
       <div
  aria-label="product-view"
  id="product-view"
  className="
    relative
    flex
    justify-between
    gap-[2%]

    max-md:flex-col
  "
>
  {/* Mobile: title + price above images; desktop unchanged */}
  {!galleryMode ? (
    <div className="hidden w-full min-w-0 max-md:block max-md:px-5">
      <ProductHeader
        title={title}
        price={selectedVariant?.price ?? ""}
        withIds={false}
      />
    </div>
  ) : null}

  {/* LEFT SIDE */}
  {images.length > 0 ? (
    // <div
    //   className="
    //     w-[68%]
    //     min-w-0
    //     cursor-zoom-in

    //     max-md:w-full
    //   "
    // >
    <div
  className={`
    min-w-0
    max-md:w-full

    ${
      galleryMode
        ? "w-full cursor-zoom-out"
        : "w-[68%] cursor-zoom-in max-md:cursor-zoom-in"
    }
  `}
>
    {/* Mobile: swipe carousel; tap image to open gallery with arrows */}
    <div
      id="slider"
      className={clsx(
        "m-auto mt-0 hidden max-md:block",
        galleryMode ? "cursor-zoom-out" : "cursor-zoom-in",
      )}
      onClick={() =>
        galleryMode ? setGalleryMode(false) : setGalleryMode(true)
      }
    >
      <div aria-label="product-images-carousel">
        <div
          className="nuka-container relative"
          aria-labelledby="nuka-carousel-heading"
          tabIndex={0}
          id="nuka-carousel"
        >
          <div className="nuka-slide-container">
            <div
              ref={mobileCarouselRef}
              id="nuka-overflow"
              data-testid="nuka-overflow"
              className="nuka-overflow scroll-smooth overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ touchAction: "pan-y" }}
              onScroll={handleCarouselScroll}
            >
              <div
                id="nuka-wrapper"
                data-testid="nuka-wrapper"
                className="nuka-wrapper flex"
              >
                {images.map((image, index) => (
                  <div
                    key={image.label}
                    className="w-full shrink-0 basis-full snap-start"
                  >
                    <Image
                      alt={title}
                      src={image.src}
                      width={700}
                      height={700}
                      unoptimized
                      sizes="100vw"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      aria-label={image.label}
                      data-zoom={image.zoom}
                      className="aspect-square w-full shrink-0 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {images.length > 1 && galleryMode ? (
              <div>
                <button
                  type="button"
                  aria-label="left-slide-button"
                  className="invisible absolute bottom-1/2 left-0 mx-3 cursor-pointer !visible"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToImage(selectedImage - 1);
                  }}
                >
                  <CarouselArrow direction="left" />
                </button>

                <button
                  type="button"
                  aria-label="right-slide-button"
                  className="invisible absolute bottom-1/2 right-0 mx-3 cursor-pointer !visible"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToImage(selectedImage + 1);
                  }}
                >
                  <CarouselArrow direction="right" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {images.length > 1 && galleryMode ? (
          <div
            aria-label="carousel-control-dots"
            className="flex justify-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((image, index) => (
              <button
                key={`dot-${image.label}`}
                type="button"
                aria-label={`slide ${index + 1} bullet`}
                aria-current={index === selectedImage ? "true" : undefined}
                className={clsx(
                  "m-[2.5px] h-1 w-2 cursor-pointer",
                  index === selectedImage
                    ? "bg-slate-400 hover:bg-slate-400"
                    : "bg-slate-200 hover:bg-slate-400",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToImage(index);
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>

{!galleryMode ? (
  <>
    {/* Desktop: click-to-zoom carousel + thumbnails */}
    <div
      className="m-auto mt-0 max-md:hidden"
      onClick={() => setGalleryMode(true)}
    >
      <div aria-label="product-images-carousel">
        <div
          className="relative"
          aria-labelledby="nuka-carousel-heading"
          tabIndex={0}
          id="nuka-carousel-desktop"
        >
          <div className="relative">
            <div
              ref={desktopCarouselRef}
              className="grid auto-cols-[100%] grid-flow-col overflow-x-auto scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ touchAction: "pan-y" }}
              onScroll={handleCarouselScroll}
            >
              {images.map((image, index) => (
                <div key={image.label} className="min-w-0 snap-start">
                  <Image
                    alt={title}
                    src={image.src}
                    width={700}
                    height={700}
                    unoptimized
                    sizes="(min-width: 45em) 50vw, 100vw"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    aria-label={image.label}
                    data-zoom={image.zoom}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              ))}
            </div>

            {images.length > 1 ? (
              <div>
                <button
                  type="button"
                  aria-label="left-slide-button"
                  className="invisible absolute bottom-1/2 left-0 mx-3 cursor-pointer !visible"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToImage(selectedImage - 1);
                  }}
                >
                  <CarouselArrow direction="left" />
                </button>

                <button
                  type="button"
                  aria-label="right-slide-button"
                  className="invisible absolute bottom-1/2 right-0 mx-3 cursor-pointer !visible"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToImage(selectedImage + 1);
                  }}
                >
                  <CarouselArrow direction="right" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>

    {/* THUMBNAILS */}
    {images.length > 1 ? (
      <div
        aria-label="product-images-grid"
        id="product-images-grid"
        className="
          mt-4
          w-full

          max-md:hidden
        "
      >
        <div
          aria-label="photos-wrapper"
          className="m-auto grid max-w-[480px] grid-cols-5 text-center justify-center"
        >
          {images.map((image, index) => (
            <button
              key={image.label}
              type="button"
              aria-label="product-thumb"
              id={`product-thumb-${index}`}
              className={`p-0.5 transition duration-150 ease-in-out hover:cursor-pointer hover:opacity-40 ${
                index === selectedImage ? "opacity-40" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                scrollToImage(index);
              }}
            >
              <Image
                alt=""
                src={image.thumbSrc}
                width={90}
                height={90}
                unoptimized
                sizes="(min-width: 45em) 50vw, 100vw"
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    ) : null}
  </>
) : (
  /* ZOOM GALLERY (desktop only) */
  <div
    className="w-full cursor-zoom-out max-md:hidden"
    aria-label="product-images-gallery"
    onClick={() => setGalleryMode(false)}
  >
    {images.map((image, index) => (
      <div
        key={image.label}
        aria-label={`${title}-image-${index}`}
        className="pb-4"
      >
        <Image
          alt={title}
          src={image.src}
          width={1500}
          height={1500}
          unoptimized
          loading="lazy"
          className="w-full object-cover"
        />
      </div>
    ))}
  </div>
)}

      {/* THUMBNAILS */}
      {/* {images.length > 1 ? (
        <div
          aria-label="product-images-grid"
          id="product-images-grid"
          className="
            mt-4
            w-full

            max-md:hidden
          "
        >
          <div
            aria-label="photos-wrapper"
            className="m-auto grid max-w-[480px] grid-cols-5 text-center justify-center"
          >
            {images.map((image, index) => (
              <button
                key={image.label}
                type="button"
                aria-label="product-thumb"
                id={`product-thumb-${index}`}
                className={`p-0.5 transition duration-150 ease-in-out hover:cursor-pointer hover:opacity-40 ${
                  index === selectedImage ? "opacity-40" : ""
                }`}
                onClick={() => scrollToImage(index)}
              >
                <Image
                  alt=""
                  src={image.thumbSrc}
                  width={90}
                  height={90}
                  unoptimized
                  sizes="(min-width: 45em) 50vw, 100vw"
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null} */}
    </div>
  ) : null}

  {/* RIGHT SIDE */}
  {/* <div
    className="
      w-[28%]
      min-w-0
      flex
      flex-col
      items-start

      max-md:w-full
      max-md:px-5
    "
  > */}
  {/* RIGHT SIDE */}
{!galleryMode && (
  <div
    className="
      w-[28%]
      min-w-0
      flex
      flex-col
      items-start

      max-md:w-full
      max-md:px-5
    "
  >
    {/* HEADER — desktop only; mobile uses block above images */}
    <ProductHeader
      title={title}
      price={selectedVariant?.price ?? ""}
      className="max-md:hidden"
    />

      {/* DESCRIPTION — mobile: after related products */}
      {descriptionLines.length > 0 ? (
      <div
        id="product-description"
        aria-label="product-description"
        className="
          mt-5
          w-full
          select-none
          text-sm
          font-normal
          uppercase
          leading-5
         sm:leading-[18px]
          max-md:order-3
        "
      >
        <ul className="list-disc pl-4">
          {descriptionLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    ) : null}

    {/* LINKS — lg: after price; mobile: after description */}
    {(technicalDetails || sizeChart) ? (
      <div className="mt-5 flex flex-col gap-0 max-md:order-4">
        {technicalDetails ? (
          <button
            type="button"
            className="m-0 p-0 text-left text-sm uppercase underline hover:text-gray-300 hover:no-underline"
            aria-label="product-technical-details"
            onClick={() => setOpenMetafieldModal("technical-details")}
          >
            Technical Details
          </button>
        ) : null}

        {sizeChart ? (
          <button
            type="button"
            className="m-0 p-0 text-left text-sm uppercase underline hover:text-gray-300 hover:no-underline"
            aria-label="product-size-chart"
            onClick={() => setOpenMetafieldModal("size-chart")}
          >
            Size Chart
          </button>
        ) : null}
      </div>
    ) : null}
    {/* ACTIONS — mobile: first after product image */}
    {variants.length > 0 && hasAnyVariantAvailable ? (
      <div
        aria-label="product-actions-wrapper"
        className="
          mt-6
          grid
          w-full
          grid-cols-2
          gap-2

          max-md:order-1
          max-md:mt-5
        "
      >
        <div
          aria-label="product-variant-select-wrapper"
          className="w-full"
        >
          <select
            id="variant-selector"
            aria-label="product-select"
            role="combobox"
            value={selectedVariantId}
            onChange={(event) =>
              setSelectedVariantId(event.target.value)
            }
            className="
              h-7
              w-full
              cursor-pointer
              appearance-none
              border-2
              border-black
              bg-[image:var(--background-image-selector-icon)]
              bg-[top_50%_left_95%]
              bg-no-repeat
              pl-2
              text-sm
              uppercase
              outline-hidden

              hover:bg-white
              hover:text-black
              focus:ring-0

              max-md:h-8
              max-md:text-base
            "
          >
            {variants.map((variant) => (
              <option
                key={variant.id}
                value={variant.id}
                className="uppercase"
              >
                {variant.label}
              </option>
            ))}
          </select>
        </div>

        <ProductPageAddToCart
          product={product}
          selectedVariantId={selectedVariantId}
          variantLabel={selectedVariant?.label ?? "item"}
          className="flex h-7 w-full items-center justify-center border-2 border-black bg-black px-4 text-sm font-bold uppercase text-white transition hover:bg-white hover:text-black  max-md:h-8 max-md:text-base"
        />
      </div>
    ) : null}

    {/* RELATED PRODUCTS — mobile: after add to cart */}
    {relatedProducts.length > 0 ? (
      <div
        aria-label="product-selector-grid"
        id="product-selector-grid"
        className="mt-6 w-full max-md:order-2"
      >
        <div className="grid grid-cols-4 text-center">
          {relatedProducts.map((product) => (
            <Link
              key={product.handle}
              href={productHref(product.handle, rangeSlug)}
              aria-label={`product-selector-thumb-${product.handle}`}
              id={`product-selector-thumb-${product.handle}`}
              className={`transition duration-150 ease-in-out hover:cursor-pointer hover:opacity-40 ${
                product.active ? "opacity-40" : ""
              }`}
            >
              <Image
                alt={product.alt}
                src={product.image}
                width={90}
                height={90}
                unoptimized
                sizes="(min-width: 45em) 50vw, 100vw"
                className="aspect-square w-full object-cover"
              />
            </Link>
          ))}
        </div>
      </div>
    ) : null}

  
  </div>
)}
</div>
          <div className={galleryMode ? "max-md:hidden" : undefined}>
            {/* <Footer /> */}
          </div>
        </main>

      </div>
      <Footer />

      <ProductMetafieldModal
        isOpen={openMetafieldModal === "technical-details"}
        onClose={() => setOpenMetafieldModal(null)}
        productTitle={title}
        technicalDetails={technicalDetails}
      />
      <ProductMetafieldModal
        isOpen={openMetafieldModal === "size-chart"}
        onClose={() => setOpenMetafieldModal(null)}
        productTitle={title}
        sizeChart={sizeChart}
      />
    </>
  );
}
