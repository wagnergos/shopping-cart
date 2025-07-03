import type { Cart, CartItem, UpdateType } from "../types/cart";

export function createEmptyCart(): Cart {
  return {
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    totalQuantity: 0,
    appliedDiscountType: "none",
  };
}

export function updateItemQuantity(
  items: CartItem[],
  productId: number,
  updateType: UpdateType
): CartItem[] {
  const itemIndex = items.findIndex((item) => item.productId === productId);

  if (itemIndex === -1) {
    return items;
  }

  const updatedItems = [...items];
  const item = updatedItems[itemIndex];
  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;

  if (newQuantity <= 0) {
    updatedItems.splice(itemIndex, 1);
  } else {
    updatedItems[itemIndex] = { ...item, quantity: newQuantity };
  }

  return updatedItems;
}
