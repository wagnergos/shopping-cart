"use client";

import { useActionState } from "react";
import { addItem } from "../actions/cart";
import { useCart } from "./cart-context";
import { Product } from "@/features/products/types";

interface AddToCartProps {
  product: Product;
}

export function AddToCart({ product }: AddToCartProps) {
  const { addCartItem } = useCart();
  const [message, formAction] = useActionState(addItem, null);
  const addItemAction = formAction.bind(null, product.id);

  const handleSubmit = async () => {
    addCartItem(product);
    addItemAction();
  };

  return (
    <form action={handleSubmit}>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium cursor-pointer"
        aria-label={`Add ${product.name} to cart for $${product.price}`}
      >
        Add to Cart
      </button>

      {message && (
        <p aria-live="polite" className="sr-only" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
