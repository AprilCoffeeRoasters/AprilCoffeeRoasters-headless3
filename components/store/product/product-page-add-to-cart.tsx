"use client";

import { addVariantToCart } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import type { Product } from "lib/shopify/types";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

export default function ProductPageAddToCart({
  product,
  selectedVariantId,
  variantLabel,
  className,
  onAdded,
}: {
  product: Product;
  selectedVariantId: string;
  variantLabel: string;
  className: string;
  onAdded?: () => void;
}) {
  const router = useRouter();
  const { cart, addCartItem } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId,
  );

  const isInCart = useMemo(
    () =>
      cart?.lines.some(
        (line) => line.merchandise.id === selectedVariantId,
      ) ?? false,
    [cart?.lines, selectedVariantId],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!selectedVariant || !product.availableForSale || isInCart) {
      return;
    }

    startTransition(async () => {
      addCartItem(selectedVariant, product);

      const result = await addVariantToCart(selectedVariantId);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
      onAdded?.();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <button
        type="submit"
        disabled={
          !selectedVariant ||
          !product.availableForSale ||
          isPending ||
          isInCart
        }
        className={className}
        aria-label={
          isInCart
            ? `${variantLabel}-in-cart`
            : `add-${variantLabel}-to-cart`
        }
      >
        {isPending
          ? "Adding…"
          : isInCart
            ? "IN CART"
            : product.availableForSale
              ? "Add to Cart"
              : "Sold Out"}
      </button>
      {error ? (
        <p className="mt-1 text-xs font-bold uppercase text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
