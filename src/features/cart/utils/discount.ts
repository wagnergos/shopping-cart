import type { CartItem } from "@/features/cart/types/cart";

export function getCheapestItemPrice(items: CartItem[]): number {
  if (items.length === 0) {
    throw new Error("Cannot calculate cheapest item price for empty cart");
  }
  
  const sortedItems = [...items].sort((a, b) => a.price - b.price);

  const discount = sortedItems[0].price;

  return discount;
}

export function calculateVipDiscount(subtotal: number): number {
  return subtotal * 0.15;
}
