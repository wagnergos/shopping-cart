import type { CartItem } from "@/features/cart/types/cart";

export interface ExpectedCartResult {
  subtotal: number;
  discount: number;
  total: number;
  totalQuantity?: number;
  appliedDiscountType: "none" | "buy3pay2" | "vip";
}

export interface ActualCartResult {
  subtotal: number;
  discount: number;
  total: number;
  totalQuantity: number;
  appliedDiscountType: "none" | "buy3pay2" | "vip";
}

export function expectCartResult(
  actual: ActualCartResult,
  expected: ExpectedCartResult,
  items?: CartItem[]
): void {
  expect(actual.subtotal).toBeCloseTo(expected.subtotal, 2);
  expect(actual.discount).toBeCloseTo(expected.discount, 2);
  expect(actual.total).toBeCloseTo(expected.total, 2);
  expect(actual.appliedDiscountType).toBe(expected.appliedDiscountType);

  const expectedTotalQuantity =
    expected.totalQuantity ??
    (items ? items.reduce((sum, item) => sum + item.quantity, 0) : 0);

  expect(actual.totalQuantity).toBe(expectedTotalQuantity);
}
