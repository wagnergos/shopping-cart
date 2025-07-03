import type { Cart, CartItem, UpdateType } from "../types/cart";
import { Product } from "@/features/products/types";
import { calculateCartTotalsWithPromotion } from "./discount";
import { createEmptyCart, updateItemQuantity } from "../utils/cart-operations";

export function handleUpdateCartItem(
  currentCart: Cart | undefined,
  productId: number,
  updateType: UpdateType,
  userIsVip: boolean
): Cart {
  const cart = currentCart || createEmptyCart();
  let updatedItems: CartItem[];

  if (updateType === "delete") {
    updatedItems = cart.items.filter((item) => item.productId !== productId);
  } else {
    updatedItems = updateItemQuantity(cart.items, productId, updateType);
  }

  const totals = calculateCartTotalsWithPromotion(updatedItems, userIsVip);
  return {
    ...totals,
    items: updatedItems,
  };
}

export function handleAddCartItem(
  currentCart: Cart | undefined,
  product: Product,
  userIsVip: boolean
): Cart {
  const cart = currentCart || createEmptyCart();
  const existingItem = cart.items.find((item) => item.productId === product.id);

  let updatedItems: CartItem[];

  if (existingItem) {
    updatedItems = cart.items.map((item) =>
      item.productId === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    const newItem = {
      ...product,
      id: `cart-item-${product.id}`,
      productId: product.id,
      quantity: 1,
    };
    updatedItems = [...cart.items, newItem];
  }

  const totals = calculateCartTotalsWithPromotion(updatedItems, userIsVip);
  return {
    ...totals,
    items: updatedItems,
  };
}
