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
                className={`type-h2 block text-sm leading-[18px] no-underline outline outline-[2pt] outline-transparent outline-offset-2 transition duration-150 ease-in-out hover:outline-hover-frame max-md:py-2 ${
                  isActive ? "text-active" : "text-standard-grey"
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
              className="type-h2 block text-sm leading-[18px] text-standard-grey no-underline outline outline-[2pt] outline-transparent outline-offset-2 transition duration-150 ease-in-out hover:outline-hover-frame active:text-active max-md:py-2"
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
              className="type-h2 block w-full cursor-pointer text-right text-sm uppercase leading-[18px] text-standard-grey no-underline outline outline-[2pt] outline-transparent outline-offset-2 transition duration-150 ease-in-out hover:outline-hover-frame active:text-active"
            >
Search
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
