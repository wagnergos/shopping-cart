import type { CartItem } from "@/features/cart/types/cart";

export function getDiscount(items: CartItem[]): number {
  const sortedItems = [...items].sort((a, b) => a.price - b.price);

  const discount = sortedItems[0].price;

  return discount;
}

export function calculateVipDiscount(subtotal: number): number {
  return subtotal * 0.15;
}
