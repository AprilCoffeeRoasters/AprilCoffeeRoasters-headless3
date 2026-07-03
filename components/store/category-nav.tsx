"use client";

import { useCart } from "components/cart/cart-context";
import { collectionCategories } from "lib/store/collection-categories";
import Link from "next/link";

export default function CategoryNav({
  menuOpen = false,
  activeCollection,
  onFilterClick,
}: {
  menuOpen?: boolean;
  activeCollection?: string;
  onFilterClick?: () => void;
}) {
  const { cart } = useCart();
  const showCart = (cart?.totalQuantity ?? 0) > 0;

  return (
    <nav
      id="category-menu"
      aria-label="category-menu"
      className={`float-left mr-2.5 mt-5 box-content inline-block w-[12%] text-right uppercase max-md:fixed max-md:z-10 max-md:float-none max-md:overflow-y-auto max-md:mt-0 max-md:h-[calc(100vh-64px)] max-md:w-full max-md:bg-white max-md:px-5 max-md:text-left max-md:text-lg duration-300 ease-out ${
        menuOpen ? "max-md:translate-x-0" : "max-md:translate-x-full"
      }`}
    >
      <ul className="mb-2.5">
        {collectionCategories.map((item) => {
          const isActive = item.handle === activeCollection;
          const href = `/collections/${item.handle}`;

          return (
            <li key={item.handle} aria-label={`menu-item-${item.handle}`}>
              <Link
                href={href}
                className={`block text-sm font-bold leading-[18px] no-underline transition duration-150 ease-in-out hover:text-amber-500 max-md:py-2 ${
                  isActive ? "text-amber-500" : "text-black"
                }`}
                {...(isActive
                  ? { "data-selector": "category-menu-active" }
                  : {})}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        {showCart ? (
          <li aria-label="menu-item-cart">
            <Link
              href="/cart"
              className="block text-sm font-bold leading-[18px] text-black no-underline transition duration-150 ease-in-out hover:text-amber-500 max-md:py-2"
            >
              Cart
            </Link>
          </li>
        ) : null}
        {onFilterClick ? (
          <li
            aria-label="menu-item-filter"
            className="pt-10 max-md:invisible max-md:hidden"
          >
            <button
              type="button"
              aria-label="filter-button"
              onClick={onFilterClick}
              className="block w-full cursor-pointer text-right text-sm font-bold uppercase leading-[18px] text-black no-underline transition duration-150 ease-in-out hover:text-amber-500"
            >
              Filter
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
