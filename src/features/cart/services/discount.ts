import type { CartItem } from "@/features/cart/types/cart";
import { getDiscount, calculateVipDiscount } from "../utils/discount";

export function calculateCartTotalsWithPromotion(
  items: CartItem[],
  userIsVip: boolean
) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let discount = 0;
  let appliedDiscountType: "none" | "buy3pay2" | "vip" = "none";

  const buy3Pay2Discount = totalQuantity >= 3 ? getDiscount(items) : 0;
  discount = buy3Pay2Discount;

  if (buy3Pay2Discount > 0) {
    appliedDiscountType = "buy3pay2";
  }

  if (userIsVip) {
    const vipDiscount = calculateVipDiscount(subtotal);
    discount = Math.max(vipDiscount, buy3Pay2Discount);
    if (vipDiscount > buy3Pay2Discount) appliedDiscountType = "vip";
  }

  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    total,
    totalQuantity,
    appliedDiscountType,
  };
}
