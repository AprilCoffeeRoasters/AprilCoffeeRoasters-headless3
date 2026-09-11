"use client";

import ProductPageAddToCart from "components/store/product/product-page-add-to-cart";
import ProductPageHeader from "components/store/product/product-page-header";
import ProductPageMetafieldBody from "components/store/product/product-page-metafield-body";
import ProductPageQuantityInput from "components/store/product/product-page-quantity-input";
import type {
  ProductPageVariant,
} from "components/store/product/product-page-types";
import type { Product } from "lib/shopify/types";
import type {
  ParsedRecipeContent,
  ParsedSizeChart,
  ParsedTechnicalDetails,
} from "lib/store/parse-product-metafields";

type ProductPageDetailsPanelProps = {
  product: Product;
  title: string;
  descriptionLines: string[];
  technicalDetails: ParsedTechnicalDetails | null;
  sizeChart: ParsedSizeChart | null;
  recommendations: ParsedRecipeContent | null;
  supplierInformation: ParsedRecipeContent | null;
  variants: ProductPageVariant[];
  selectedVariantId: string;
  selectedVariant: ProductPageVariant | undefined;
  quantity: number;
  hasAnyVariantAvailable: boolean;
  openAccordion: string | null;
  onToggleAccordion: (id: string) => void;
  onSelectedVariantIdChange: (id: string) => void;
  onQuantityChange: (next: number) => void;
  onOpenMetafieldModal: (
    modal: "technical-details" | "size-chart",
  ) => void;
};

function AccordionChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`absolute right-0 bottom-[10px] h-3 w-3 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M5 7l5 6 5-6H5z" />
    </svg>
  );
}

const accordionButtonClass =
  "relative w-full border-b-[2pt] border-hover-frame pt-4 pb-1 text-left text-standard-grey";

const accordionTitleClass =
  "type-h2 block text-[18px] uppercase leading-none ml-2";

const accordionBodyClass =
  "border-x-[2pt] border-b-[2pt] border-hover-frame px-2 py-4 text-standard-grey";

const metafieldBodyClass = `
  type-text2
  space-y-1
  text-[13px]
  leading-[1.35]
  tracking-[-0.03em]

  sm:text-[14px]
  md:text-[15px]

  [&_p]:mt-0
  [&_p+p]:mt-1
  [&_br]:block
`;

export default function ProductPageDetailsPanel({
  product,
  title,
  descriptionLines,
  technicalDetails,
  sizeChart,
  recommendations,
  supplierInformation,
  variants,
  selectedVariantId,
  selectedVariant,
  quantity,
  hasAnyVariantAvailable,
  openAccordion,
  onToggleAccordion,
  onSelectedVariantIdChange,
  onQuantityChange,
  onOpenMetafieldModal,
}: ProductPageDetailsPanelProps) {
  return (
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
      <ProductPageHeader
        title={title}
        price={selectedVariant?.price ?? ""}
        className="max-md:hidden"
      />

      <div className="mt-6 w-full max-md:order-3">
        {/* Product Details — product description/content */}
        {descriptionLines.length > 0 ? (
          <>
            <button
              type="button"
              onClick={() => onToggleAccordion("details")}
              className={accordionButtonClass}
            >
              <span className={accordionTitleClass}>Product Details</span>
              <AccordionChevron open={openAccordion === "details"} />
            </button>

            {openAccordion === "details" ? (
              <div
                id="product-description"
                aria-label="product-description"
                className={accordionBodyClass}
              >
                <div
                  className="
              type-text2
              space-y-1
              text-[13px]
              leading-[1.35]
              tracking-[-0.03em]

              sm:text-[14px]
              md:text-[15px]
            "
                >
                  {descriptionLines.map((line) => {
                    const separatorIndex = line.indexOf(":");
                    if (separatorIndex > 0) {
                      const label = line.slice(0, separatorIndex + 1);
                      const value = line.slice(separatorIndex + 1).trim();
                      return (
                        <p key={line}>
                          <span className="font-medium">{label}</span>
                          {value ? <> {value}</> : null}
                        </p>
                      );
                    }

                    return <p key={line}>{line}</p>;
                  })}
                </div>
              </div>
            ) : null}
          </>
        ) : null}

        {/* Supplier Information */}
        {supplierInformation ? (
          <>
            <button
              type="button"
              onClick={() => onToggleAccordion("supplier")}
              className={accordionButtonClass}
            >
              <span className={accordionTitleClass}>Supplier Information</span>
              <AccordionChevron open={openAccordion === "supplier"} />
            </button>

            {openAccordion === "supplier" ? (
              <div className={accordionBodyClass}>
                <ProductPageMetafieldBody
                  content={supplierInformation}
                  className={metafieldBodyClass}
                />
              </div>
            ) : null}
          </>
        ) : null}

        {/* Recommendations — Filter Coffee & Limited Coffee only */}
        {recommendations ? (
          <>
            <button
              type="button"
              onClick={() => onToggleAccordion("recommendations")}
              className={accordionButtonClass}
            >
              <span className={accordionTitleClass}>Recommendations</span>
              <AccordionChevron open={openAccordion === "recommendations"} />
            </button>

            {openAccordion === "recommendations" ? (
              <div className={accordionBodyClass}>
                <ProductPageMetafieldBody
                  content={recommendations}
                  className={metafieldBodyClass}
                />
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      {/* LINKS — lg: after price; mobile: after description */}
      {technicalDetails || sizeChart ? (
        <div className="mt-5 flex flex-col gap-0 max-md:order-4">
          {technicalDetails ? (
            <button
              type="button"
              className="m-0 p-0 text-left text-sm uppercase underline hover:text-gray-300 hover:no-underline"
              aria-label="product-technical-details"
              onClick={() => onOpenMetafieldModal("technical-details")}
            >
              Technical Details
            </button>
          ) : null}

          {sizeChart ? (
            <button
              type="button"
              className="m-0 p-0 text-left text-sm uppercase underline hover:text-gray-300 hover:no-underline"
              aria-label="product-size-chart"
              onClick={() => onOpenMetafieldModal("size-chart")}
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
          grid-cols-3
          gap-2

          max-md:order-1
          max-md:mt-5
        "
        >
          <div
            aria-label="product-variant-select-wrapper"
            className="col-span-2 w-full"
          >
            {variants.length > 1 ? (
              <select
                id="variant-selector"
                aria-label="product-select"
                role="combobox"
                value={selectedVariantId}
                onChange={(event) =>
                  onSelectedVariantIdChange(event.target.value)
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
            ) : (
              <div
                aria-label="product-variant"
                className="
                flex
                h-7
                w-full
                items-center
                border-2
                border-black
                pl-2
                text-sm
                uppercase

                max-md:h-8
                max-md:text-base
              "
              >
                {selectedVariant?.label}
              </div>
            )}
          </div>

          <div aria-label="product-quantity-wrapper" className="col-span-1">
            <ProductPageQuantityInput
              quantity={quantity}
              setQuantity={onQuantityChange}
            />
          </div>

          <div className="col-span-3">
            <ProductPageAddToCart
              product={product}
              selectedVariantId={selectedVariantId}
              variantLabel={selectedVariant?.label ?? "item"}
              quantity={quantity}
              className="btn-brand flex h-7 w-full items-center justify-center border-[2pt] px-4 text-sm font-bold uppercase max-md:h-8 max-md:text-base"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
