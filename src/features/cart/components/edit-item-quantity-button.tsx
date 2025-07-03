"use client";

import { useActionState } from "react";
import { updateItemQuantity } from "../actions/cart";
import { useCart } from "./cart-context";
import { CartItem } from "../types/cart";

interface EditItemQuantityButtonProps {
  item: CartItem;
  type: "plus" | "minus";
}

function ButtonIcon({ type }: { type: "plus" | "minus" }) {
  const ariaLabel =
    type === "plus" ? "Increase item quantity" : "Decrease item quantity";
  return (
    <button
      type="submit"
      className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
      aria-label={ariaLabel}
    >
      {type === "plus" ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14" />
        </svg>
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
}: EditItemQuantityButtonProps) {
  const { updateCartItem } = useCart();
  const [message, formAction] = useActionState(updateItemQuantity, null);

  const payload = {
    productId: item.productId,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };
  const updateItemAction = formAction.bind(null, payload);

  const handleSubmit = async () => {
    updateCartItem(item.productId, type);
    updateItemAction();
  };

  return (
    <form action={handleSubmit}>
      <ButtonIcon type={type} />
      {message && (
        <p aria-live="polite" className="sr-only" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
