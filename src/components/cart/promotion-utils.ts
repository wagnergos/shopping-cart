import type { CartItem } from "@/components/cart/types";

export function getDiscount(items: CartItem[]): number {
  const sortedItems = [...items].sort((a, b) => a.price - b.price);

  const discount = sortedItems[0].price;

  return discount;
}

export function calculateCartTotalsWithPromotion(items: CartItem[]) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = totalQuantity < 3 ? 0 : getDiscount(items);
  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    total,
    totalQuantity,
  };
}
