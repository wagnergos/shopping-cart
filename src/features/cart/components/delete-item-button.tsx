"use client";

import { useActionState } from "react";
import { removeItem } from "../actions/cart";
import { useCart } from "./cart-context";

interface DeleteItemButtonProps {
  productId: number;
  productName: string;
}

export function DeleteItemButton({
  productId,
  productName,
}: DeleteItemButtonProps) {
  const { updateCartItem } = useCart();
  const [message, formAction] = useActionState(removeItem, null);
  const removeItemAction = formAction.bind(null, productId);

  const handleSubmit = async () => {
    updateCartItem(productId, "delete");
    removeItemAction();
  };

  return (
    <form action={handleSubmit}>
      <button
        type="submit"
        className="group p-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
        aria-label={`Remove ${productName} from cart`}
      >
        <svg
          className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      {message && (
        <p aria-live="polite" className="sr-only" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
