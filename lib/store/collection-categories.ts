export const collectionCategories = [
  { label: "New", handle: "new" },
  { label: "Filter Coffee", handle: "filter-coffee" },
  { label: "Espresso Coffee", handle: "espresso-coffee" },
  { label: "Limited Coffee", handle: "limited-coffee" },
  { label: "Organic Coffee", handle: "organic-coffee" },
  { label: "Coffee Subscriptions", handle: "coffee-subscriptions" },
  { label: "Filter Drip Packs", handle: "filter-drip-packs" },
  { label: "Compostable Capsules", handle: "compostable-capsules" },
  { label: "Brewers", handle: "brewers" },
  { label: "Paper Filter", handle: "paper-filter" },
  { label: "Cups", handle: "cups" },
  { label: "Mugs", handle: "mugs" },
  { label: "Thermos", handle: "thermos" },
  { label: "Accessories", handle: "accessories" },
  { label: "Clothing", handle: "clothing" },
  { label: "Limited Projects", handle: "limited-projects" },
  { label: "All", handle: "all" },
] as const;

export type CollectionCategoryHandle =
  (typeof collectionCategories)[number]["handle"];
