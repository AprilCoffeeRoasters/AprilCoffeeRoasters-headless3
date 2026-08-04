import type { Product } from "lib/shopify/types";

export type CollectionFilters = {
  showSoldOut: boolean;
  sizes: string[];
};

export const defaultCollectionFilters: CollectionFilters = {
  showSoldOut: true,
  sizes: [],
};

const HIDE_SOLD_OUT_PARAM = "hideSoldOut";
const SIZE_PARAM = "size";

type SearchParamsReader = Pick<URLSearchParams, "get" | "getAll">;

export function collectionFiltersFromSearchParams(
  searchParams: SearchParamsReader,
): CollectionFilters {
  const hideSoldOut =
    searchParams.get(HIDE_SOLD_OUT_PARAM) === "1" ||
    searchParams.get(HIDE_SOLD_OUT_PARAM) === "true";

  const validSizes = new Set<string>(filterSizeOptions);
  const sizes = searchParams
    .getAll(SIZE_PARAM)
    .filter((size): size is (typeof filterSizeOptions)[number] =>
      validSizes.has(size),
    );

  if (!hideSoldOut && sizes.length === 0) {
    return defaultCollectionFilters;
  }

  return {
    showSoldOut: !hideSoldOut,
    sizes,
  };
}

export function searchParamsFromCollectionFilters(
  filters: CollectionFilters,
): URLSearchParams {
  const params = new URLSearchParams();

  if (!filters.showSoldOut) {
    params.set(HIDE_SOLD_OUT_PARAM, "1");
  }

  for (const size of filters.sizes) {
    params.append(SIZE_PARAM, size);
  }

  return params;
}

export function areCollectionFiltersEqual(
  a: CollectionFilters,
  b: CollectionFilters,
): boolean {
  if (a.showSoldOut !== b.showSoldOut || a.sizes.length !== b.sizes.length) {
    return false;
  }

  return a.sizes.every((size, index) => size === b.sizes[index]);
}

export const filterSizeOptions = [
  "Small",
  "Large",
  "Kenya",
  "Ethiopia",
  "Costa Rica",
  "Organic",
] as const;

const SIZE_OPTION_NAMES = new Set(["size", "taille"]);

function productHasAvailableSize(product: Product, sizes: string[]) {
  return product.variants.some(
    (variant) =>
      variant.availableForSale &&
      variant.selectedOptions.some(
        (option) =>
          SIZE_OPTION_NAMES.has(option.name.toLowerCase()) &&
          sizes.includes(option.value),
      ),
  );
}

function isProductSoldOut(product: Product) {
  return (
    !product.availableForSale ||
    product.variants.every((variant) => !variant.availableForSale)
  );
}

export function applyCollectionFilters(
  products: Product[],
  filters: CollectionFilters,
): Product[] {
  return products.filter((product) => {
    if (!filters.showSoldOut && isProductSoldOut(product)) {
      return false;
    }

    if (filters.sizes.length > 0 && !productHasAvailableSize(product, filters.sizes)) {
      return false;
    }

    return true;
  });
}
