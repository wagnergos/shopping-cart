import { getCheapestItemPrice, calculateVipDiscount } from "./discount";
import type { CartItem } from "../types/cart";
import { aCartItem } from "../testing/helpers/cart-item-builder";
import { PRODUCT_PRICES } from "../testing/fixtures/products";

describe("Discount Utils", () => {
  describe("getCheapestItemPrice", () => {
    describe("Edge cases", () => {
      it("should throw error for empty cart", () => {
        const items: CartItem[] = [];

        expect(() => getCheapestItemPrice(items)).toThrow();
      });

      it("should return the only item price for single item cart", () => {
        const items = [aCartItem().asTShirt().build()];

        const result = getCheapestItemPrice(items);

        expect(result).toBeCloseTo(PRODUCT_PRICES.TSHIRT, 2);
      });
    });

    describe("Multiple items scenarios", () => {
      const multipleItemsScenarios = [
        {
          name: "should return cheapest item from mixed products",
          items: [
            aCartItem().withProductId(1).asTShirt().build(),
            aCartItem().withProductId(2).asJeans().build(),
            aCartItem().withProductId(3).asDress().build(),
          ],
          expected: PRODUCT_PRICES.TSHIRT,
        },
        {
          name: "should return cheapest item when same product has multiple quantities",
          items: [aCartItem().asTShirt().withQuantity(3).build()],
          expected: PRODUCT_PRICES.TSHIRT,
        },
        {
          name: "should return cheapest item from mixed cart with different quantities",
          items: [
            aCartItem().withProductId(1).asTShirt().withQuantity(2).build(),
            aCartItem().withProductId(2).asJeans().withQuantity(1).build(),
          ],
          expected: PRODUCT_PRICES.TSHIRT,
        },
        {
          name: "should return cheapest item from expensive items first",
          items: [
            aCartItem().withProductId(3).asDress().build(),
            aCartItem().withProductId(2).asJeans().build(),
            aCartItem().withProductId(1).asTShirt().build(),
          ],
          expected: PRODUCT_PRICES.TSHIRT,
        },
        {
          name: "should handle large quantities correctly",
          items: [aCartItem().asTShirt().withQuantity(100).build()],
          expected: PRODUCT_PRICES.TSHIRT,
        },
      ];

      test.each(multipleItemsScenarios)("$name", ({ items, expected }) => {
        const cartItems = items;

        const result = getCheapestItemPrice(cartItems);

        expect(result).toBeCloseTo(expected, 2);
      });
    });

    describe("Price precision scenarios", () => {
      const precisionScenarios = [
        {
          name: "should handle items with identical prices",
          items: [
            aCartItem().withProductId(1).asTShirt().withPrice(50.0).build(),
            aCartItem().withProductId(2).asJeans().withPrice(50.0).build(),
          ],
          expected: 50.0,
        },
        {
          name: "should handle items with very close prices",
          items: [
            aCartItem().withProductId(1).asTShirt().withPrice(35.99).build(),
            aCartItem().withProductId(2).asJeans().withPrice(35.98).build(),
          ],
          expected: 35.98,
        },
        {
          name: "should handle items with fractional cents",
          items: [
            aCartItem().withProductId(1).asTShirt().withPrice(35.999).build(),
            aCartItem().withProductId(2).asJeans().withPrice(35.998).build(),
          ],
          expected: 35.998,
        },
      ];

      test.each(precisionScenarios)("$name", ({ items, expected }) => {
        const cartItems = items;

        const result = getCheapestItemPrice(cartItems);

        expect(result).toBeCloseTo(expected, 3);
      });
    });
  });

  describe("calculateVipDiscount", () => {
    describe("Edge cases", () => {
      const edgeCases = [
        {
          name: "should return 0 for zero subtotal",
          subtotal: 0,
          expected: 0,
        },
        {
          name: "should return negative discount for negative subtotal",
          subtotal: -100,
          expected: -15,
        },
      ];

      test.each(edgeCases)("$name", ({ subtotal, expected }) => {
        const inputSubtotal = subtotal;

        const result = calculateVipDiscount(inputSubtotal);

        expect(result).toBeCloseTo(expected, 2);
      });
    });
  });
});
