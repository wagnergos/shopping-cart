import { calculateCartTotalsWithPromotion } from "./discount";
import type { CartItem } from "../types/cart";
import { aCartItem } from "../testing/helpers/cart-item-builder";
import { expectCartResult } from "../testing/helpers/assertions";
import { PRODUCT_PRICES } from "../testing/fixtures/products";
import { DISCOUNT_RULES } from "../testing/fixtures/business-constants";

describe("Cart Discount Service", () => {
  describe("calculateCartTotalsWithPromotion", () => {
    describe("Common customer scenarios", () => {
      it("should calculate totals without discount when cart has less than 3 items", () => {
        const items: CartItem[] = [
          aCartItem().asTShirt().withQuantity(2).build(),
        ];

        const expectedSubtotal = PRODUCT_PRICES.TSHIRT * 2;

        const result = calculateCartTotalsWithPromotion(items, false);

        expectCartResult(
          result,
          {
            subtotal: expectedSubtotal,
            discount: 0,
            total: expectedSubtotal,
            appliedDiscountType: "none",
          },
          items
        );
      });

      it("should apply Buy 3 Pay 2 discount when cart has 3 or more items", () => {
        const items: CartItem[] = [
          aCartItem().asTShirt().withQuantity(3).build(),
        ];

        const expectedSubtotal = PRODUCT_PRICES.TSHIRT * 3;
        const expectedDiscount = PRODUCT_PRICES.TSHIRT;
        const expectedTotal = expectedSubtotal - expectedDiscount;

        const result = calculateCartTotalsWithPromotion(items, false);

        expectCartResult(
          result,
          {
            subtotal: expectedSubtotal,
            discount: expectedDiscount,
            total: expectedTotal,
            appliedDiscountType: "buy3pay2",
          },
          items
        );
      });

      it("should apply Buy 3 Pay 2 discount on cheapest item for mixed cart", () => {
        const items: CartItem[] = [
          aCartItem().withProductId(1).asTShirt().withQuantity(2).build(),
          aCartItem().withProductId(2).asJeans().withQuantity(2).build(),
        ];

        const expectedSubtotal =
          PRODUCT_PRICES.TSHIRT * 2 + PRODUCT_PRICES.JEANS * 2;
        const expectedDiscount = PRODUCT_PRICES.TSHIRT;
        const expectedTotal = expectedSubtotal - expectedDiscount;

        const result = calculateCartTotalsWithPromotion(items, false);

        expectCartResult(
          result,
          {
            subtotal: expectedSubtotal,
            discount: expectedDiscount,
            total: expectedTotal,
            appliedDiscountType: "buy3pay2",
          },
          items
        );
      });

      it("should handle large quantities correctly with Buy 3 Pay 2 discount", () => {
        const items: CartItem[] = [
          aCartItem().asTShirt().withQuantity(100).build(),
        ];

        const expectedSubtotal = PRODUCT_PRICES.TSHIRT * 100;
        const expectedDiscount = PRODUCT_PRICES.TSHIRT;
        const expectedTotal = expectedSubtotal - expectedDiscount;

        const result = calculateCartTotalsWithPromotion(items, false);

        expectCartResult(
          result,
          {
            subtotal: expectedSubtotal,
            discount: expectedDiscount,
            total: expectedTotal,
            appliedDiscountType: "buy3pay2",
          },
          items
        );
      });
    });

    describe("VIP customer scenarios", () => {
      it("should apply VIP discount when customer is VIP and has less than 3 items", () => {
        const items: CartItem[] = [
          aCartItem().withProductId(3).asDress().withQuantity(2).build(),
        ];

        const expectedSubtotal = PRODUCT_PRICES.DRESS * 2;
        const expectedDiscount =
          expectedSubtotal * DISCOUNT_RULES.VIP_DISCOUNT_RATE;
        const expectedTotal = expectedSubtotal - expectedDiscount;

        const result = calculateCartTotalsWithPromotion(items, true);

        expectCartResult(
          result,
          {
            subtotal: expectedSubtotal,
            discount: expectedDiscount,
            total: expectedTotal,
            appliedDiscountType: "vip",
          },
          items
        );
      });

      it("should choose Buy 3 Pay 2 over VIP discount when more advantageous", () => {
        const items: CartItem[] = [
          aCartItem().withProductId(3).asDress().withQuantity(3).build(),
        ];

        const expectedSubtotal = PRODUCT_PRICES.DRESS * 3;
        const expectedDiscount = PRODUCT_PRICES.DRESS;
        const expectedTotal = expectedSubtotal - expectedDiscount;

        const result = calculateCartTotalsWithPromotion(items, true);

        expectCartResult(
          result,
          {
            subtotal: expectedSubtotal,
            discount: expectedDiscount,
            total: expectedTotal,
            appliedDiscountType: "buy3pay2",
          },
          items
        );
      });

      it("should choose VIP discount when more advantageous than Buy 3 Pay 2", () => {
        const items: CartItem[] = [
          aCartItem().asTShirt().withQuantity(10).build(),
        ];

        const expectedSubtotal = PRODUCT_PRICES.TSHIRT * 10;
        const expectedDiscount =
          expectedSubtotal * DISCOUNT_RULES.VIP_DISCOUNT_RATE;
        const expectedTotal = expectedSubtotal - expectedDiscount;

        const result = calculateCartTotalsWithPromotion(items, true);

        expectCartResult(
          result,
          {
            subtotal: expectedSubtotal,
            discount: expectedDiscount,
            total: expectedTotal,
            appliedDiscountType: "vip",
          },
          items
        );
      });

      it("should choose optimal discount for VIP customer with two jeans and two dresses", () => {
        const items: CartItem[] = [
          aCartItem().withProductId(2).asJeans().withQuantity(2).build(),
          aCartItem().withProductId(3).asDress().withQuantity(2).build(),
        ];

        const expectedSubtotal =
          PRODUCT_PRICES.JEANS * 2 + PRODUCT_PRICES.DRESS * 2;
        const vipDiscount = expectedSubtotal * DISCOUNT_RULES.VIP_DISCOUNT_RATE;
        const buy3pay2Discount = PRODUCT_PRICES.JEANS;
        const expectedDiscount = Math.max(vipDiscount, buy3pay2Discount);
        const expectedTotal = expectedSubtotal - expectedDiscount;
        const expectedDiscountType =
          vipDiscount > buy3pay2Discount ? "vip" : "buy3pay2";

        const result = calculateCartTotalsWithPromotion(items, true);

        expectCartResult(
          result,
          {
            subtotal: expectedSubtotal,
            discount: expectedDiscount,
            total: expectedTotal,
            appliedDiscountType: expectedDiscountType,
          },
          items
        );
      });

      it("should choose optimal discount for VIP customer with four t-shirts and one jeans", () => {
        const items: CartItem[] = [
          aCartItem().withProductId(1).asTShirt().withQuantity(4).build(),
          aCartItem().withProductId(2).asJeans().withQuantity(1).build(),
        ];

        const expectedSubtotal =
          PRODUCT_PRICES.TSHIRT * 4 + PRODUCT_PRICES.JEANS;
        const vipDiscount = expectedSubtotal * DISCOUNT_RULES.VIP_DISCOUNT_RATE;
        const buy3pay2Discount = PRODUCT_PRICES.TSHIRT;
        const expectedDiscount = Math.max(vipDiscount, buy3pay2Discount);
        const expectedTotal = expectedSubtotal - expectedDiscount;
        const expectedDiscountType =
          vipDiscount > buy3pay2Discount ? "vip" : "buy3pay2";

        const result = calculateCartTotalsWithPromotion(items, true);

        expectCartResult(
          result,
          {
            subtotal: expectedSubtotal,
            discount: expectedDiscount,
            total: expectedTotal,
            appliedDiscountType: expectedDiscountType,
          },
          items
        );
      });
    });

    describe("Edge cases", () => {
      it("should handle empty cart", () => {
        const items: CartItem[] = [];

        const result = calculateCartTotalsWithPromotion(items, false);

        expectCartResult(
          result,
          {
            subtotal: 0,
            discount: 0,
            total: 0,
            totalQuantity: 0,
            appliedDiscountType: "none",
          },
          items
        );
      });

      it("should handle cart with exactly 3 items of different prices", () => {
        const items: CartItem[] = [
          aCartItem().withProductId(1).asTShirt().withQuantity(1).build(),
          aCartItem().withProductId(2).asJeans().withQuantity(1).build(),
          aCartItem().withProductId(3).asDress().withQuantity(1).build(),
        ];

        const expectedSubtotal =
          PRODUCT_PRICES.TSHIRT + PRODUCT_PRICES.JEANS + PRODUCT_PRICES.DRESS;
        const expectedDiscount = PRODUCT_PRICES.TSHIRT;
        const expectedTotal = expectedSubtotal - expectedDiscount;

        const result = calculateCartTotalsWithPromotion(items, false);

        expectCartResult(
          result,
          {
            subtotal: expectedSubtotal,
            discount: expectedDiscount,
            total: expectedTotal,
            appliedDiscountType: "buy3pay2",
          },
          items
        );
      });
    });

    describe("Parametrized discount scenarios", () => {
      // Tests basic threshold validation - ensures no discount applied below minimum quantity
      test.each([
        {
          description: "no discount for 1 item",
          items: [aCartItem().asTShirt().withQuantity(1).build()],
          isVip: false,
          expected: {
            subtotal: PRODUCT_PRICES.TSHIRT,
            discount: 0,
            total: PRODUCT_PRICES.TSHIRT,
            appliedDiscountType: "none" as const,
          },
        },
        {
          description: "no discount for 2 items",
          items: [aCartItem().asTShirt().withQuantity(2).build()],
          isVip: false,
          expected: {
            subtotal: PRODUCT_PRICES.TSHIRT * 2,
            discount: 0,
            total: PRODUCT_PRICES.TSHIRT * 2,
            appliedDiscountType: "none" as const,
          },
        },
      ])(
        "should apply correct discount: $description",
        ({ items, isVip, expected }) => {
          const cartItems = items;

          const result = calculateCartTotalsWithPromotion(cartItems, isVip);

          expectCartResult(result, expected, cartItems);
        }
      );

      // Tests Buy 3 Pay 2 promotion activation - validates minimum quantity threshold
      test.each([
        {
          description: "Buy 3 Pay 2 for exactly 3 items",
          items: [aCartItem().asTShirt().withQuantity(3).build()],
          isVip: false,
          expected: {
            subtotal: PRODUCT_PRICES.TSHIRT * 3,
            discount: PRODUCT_PRICES.TSHIRT,
            total: PRODUCT_PRICES.TSHIRT * 2,
            appliedDiscountType: "buy3pay2" as const,
          },
        },
      ])(
        "should apply correct discount: $description",
        ({ items, isVip, expected }) => {
          const cartItems = items;

          const result = calculateCartTotalsWithPromotion(cartItems, isVip);

          expectCartResult(result, expected, cartItems);
        }
      );

      // Tests VIP customer privileges - validates percentage-based discount application
      test.each([
        {
          description: "VIP discount for 1 item",
          items: [aCartItem().asTShirt().withQuantity(1).build()],
          isVip: true,
          expected: {
            subtotal: PRODUCT_PRICES.TSHIRT,
            discount: PRODUCT_PRICES.TSHIRT * DISCOUNT_RULES.VIP_DISCOUNT_RATE,
            total:
              PRODUCT_PRICES.TSHIRT * (1 - DISCOUNT_RULES.VIP_DISCOUNT_RATE),
            appliedDiscountType: "vip" as const,
          },
        },
      ])(
        "should apply correct discount: $description",
        ({ items, isVip, expected }) => {
          const cartItems = items;

          const result = calculateCartTotalsWithPromotion(cartItems, isVip);

          expectCartResult(result, expected, cartItems);
        }
      );
    });
  });
});
