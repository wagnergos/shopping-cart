import { handleAddCartItem, handleUpdateCartItem } from "./cart-operations";
import type { Cart } from "../types/cart";
import type { Product } from "@/types/product";
import { PRODUCT_PRICES, PRODUCT_NAMES } from "../testing/fixtures/products";
import { DISCOUNT_RULES } from "../testing/fixtures/business-constants";
import { aCartItem } from "../testing/helpers/cart-item-builder";
import { expectCartResult } from "../testing/helpers/assertions";

describe("Cart Operations Integration", () => {
  const PRICE_TSHIRT = PRODUCT_PRICES.TSHIRT;
  const PRICE_JEANS = PRODUCT_PRICES.JEANS;
  const PRICE_DRESS = PRODUCT_PRICES.DRESS;

  const PRODUCTS: Record<string, Product> = {
    TSHIRT: {
      id: 1,
      name: PRODUCT_NAMES.TSHIRT,
      price: PRICE_TSHIRT,
      image: "tshirt.jpg",
    },
    JEANS: {
      id: 2,
      name: PRODUCT_NAMES.JEANS,
      price: PRICE_JEANS,
      image: "jeans.jpg",
    },
    DRESS: {
      id: 3,
      name: PRODUCT_NAMES.DRESS,
      price: PRICE_DRESS,
      image: "dress.jpg",
    },
  };

  const CUSTOMER_TYPES = {
    REGULAR: false,
    VIP: true,
  } as const;

  const EXPECTED_TOTALS = {
    THREE_TSHIRTS: {
      subtotal: PRICE_TSHIRT * 3,
      discount: PRICE_TSHIRT,
      total: PRICE_TSHIRT * 2,
    },
    MIXED_CART_4_ITEMS: {
      subtotal: PRICE_TSHIRT * 2 + PRICE_JEANS * 2,
      discount: PRICE_TSHIRT,
      total: PRICE_TSHIRT * 2 + PRICE_JEANS * 2 - PRICE_TSHIRT,
    },
    THREE_DRESSES: {
      subtotal: PRICE_DRESS * 3,
      discount: PRICE_DRESS,
      total: PRICE_DRESS * 2,
    },
  };

  let cart: Cart | undefined;

  beforeEach(() => {
    cart = undefined;
  });

  const addItems = (
    product: Product,
    quantity: number,
    isVip: boolean
  ): Cart => {
    let updatedCart: Cart | undefined = cart;
    for (let i = 0; i < quantity; i++) {
      updatedCart = handleAddCartItem(updatedCart, product, isVip);
    }
    return updatedCart!;
  };

  const addMultipleProducts = (
    items: Array<{ product: Product; quantity: number }>,
    isVip: boolean
  ): Cart => {
    let updatedCart: Cart | undefined = cart;
    items.forEach(({ product, quantity }) => {
      for (let i = 0; i < quantity; i++) {
        updatedCart = handleAddCartItem(updatedCart, product, isVip);
      }
    });
    return updatedCart!;
  };

  const expectCartState = (
    actualCart: Cart,
    expected: {
      totalQuantity: number;
      subtotal: number;
      discount: number;
      total: number;
      appliedDiscountType: "none" | "buy3pay2" | "vip";
    }
  ) => {
    expect(actualCart.totalQuantity).toBe(expected.totalQuantity);
    expect(actualCart.subtotal).toBeCloseTo(expected.subtotal, 2);
    expect(actualCart.discount).toBeCloseTo(expected.discount, 2);
    expect(actualCart.total).toBeCloseTo(expected.total, 2);
    expect(actualCart.appliedDiscountType).toBe(expected.appliedDiscountType);
  };

  describe("Detailed Business Scenarios - AAA Pattern with CartItemBuilder", () => {
    describe("Common Customer Scenarios", () => {
      it("should apply Get 3 for 2 promotion when common customer buys three t-shirts", () => {
        const expectedItems = [
          aCartItem().withProductId(1).asTShirt().withQuantity(3).build(),
        ];
        const expectedSubtotal = 3 * PRICE_TSHIRT;
        const expectedDiscount = PRICE_TSHIRT;
        const expectedTotal = expectedSubtotal - expectedDiscount;

        cart = addItems(PRODUCTS.TSHIRT, 3, CUSTOMER_TYPES.REGULAR);

        expectCartResult(
          cart,
          {
            subtotal: expectedSubtotal,
            discount: expectedDiscount,
            total: expectedTotal,
            totalQuantity: 3,
            appliedDiscountType: "buy3pay2",
          },
          expectedItems
        );
      });

      it("should apply Get 3 for 2 promotion when common customer buys two t-shirts and two jeans", () => {
        const expectedItems = [
          aCartItem().withProductId(1).asTShirt().withQuantity(2).build(),
          aCartItem().withProductId(2).asJeans().withQuantity(2).build(),
        ];
        const expectedSubtotal = 2 * PRICE_TSHIRT + 2 * PRICE_JEANS;
        const expectedDiscount = PRICE_TSHIRT;
        const expectedTotal = expectedSubtotal - expectedDiscount;

        cart = addMultipleProducts(
          [
            { product: PRODUCTS.TSHIRT, quantity: 2 },
            { product: PRODUCTS.JEANS, quantity: 2 },
          ],
          CUSTOMER_TYPES.REGULAR
        );

        expectCartResult(
          cart,
          {
            subtotal: expectedSubtotal,
            discount: expectedDiscount,
            total: expectedTotal,
            totalQuantity: 4,
            appliedDiscountType: "buy3pay2",
          },
          expectedItems
        );
      });
    });

    describe("VIP Customer Optimal Discount Selection", () => {
      it("should choose Get 3 for 2 over VIP discount when VIP customer buys three dresses", () => {
        const expectedItems = [
          aCartItem().withProductId(3).asDress().withQuantity(3).build(),
        ];
        const expectedSubtotal = 3 * PRICE_DRESS;
        const vipDiscount = expectedSubtotal * DISCOUNT_RULES.VIP_DISCOUNT_RATE;
        const buy3pay2Discount = PRICE_DRESS;
        const expectedDiscount = Math.max(vipDiscount, buy3pay2Discount);
        const expectedTotal = expectedSubtotal - expectedDiscount;

        cart = addItems(PRODUCTS.DRESS, 3, CUSTOMER_TYPES.VIP);

        expectCartResult(
          cart,
          {
            subtotal: expectedSubtotal,
            discount: expectedDiscount,
            total: expectedTotal,
            totalQuantity: 3,
            appliedDiscountType: "buy3pay2",
          },
          expectedItems
        );
      });

      it("should choose optimal discount when VIP customer buys two jeans and two dresses", () => {
        const expectedItems = [
          aCartItem().withProductId(2).asJeans().withQuantity(2).build(),
          aCartItem().withProductId(3).asDress().withQuantity(2).build(),
        ];
        const expectedSubtotal = 2 * PRICE_JEANS + 2 * PRICE_DRESS;
        const vipDiscount = expectedSubtotal * DISCOUNT_RULES.VIP_DISCOUNT_RATE;
        const buy3pay2Discount = PRICE_JEANS;
        const expectedDiscount = Math.max(vipDiscount, buy3pay2Discount);
        const expectedTotal = expectedSubtotal - expectedDiscount;
        const expectedDiscountType =
          vipDiscount > buy3pay2Discount ? "vip" : "buy3pay2";

        cart = addMultipleProducts(
          [
            { product: PRODUCTS.JEANS, quantity: 2 },
            { product: PRODUCTS.DRESS, quantity: 2 },
          ],
          CUSTOMER_TYPES.VIP
        );

        expectCartResult(
          cart,
          {
            subtotal: expectedSubtotal,
            discount: expectedDiscount,
            total: expectedTotal,
            totalQuantity: 4,
            appliedDiscountType: expectedDiscountType,
          },
          expectedItems
        );
      });

      it("should select most advantageous promotion when VIP customer buys four t-shirts and one jeans", () => {
        const expectedItems = [
          aCartItem().withProductId(1).asTShirt().withQuantity(4).build(),
          aCartItem().withProductId(2).asJeans().withQuantity(1).build(),
        ];
        const expectedSubtotal = 4 * PRICE_TSHIRT + PRICE_JEANS;
        const vipDiscount = expectedSubtotal * DISCOUNT_RULES.VIP_DISCOUNT_RATE;
        const buy3pay2Discount = PRICE_TSHIRT;
        const expectedDiscount = Math.max(vipDiscount, buy3pay2Discount);
        const expectedTotal = expectedSubtotal - expectedDiscount;
        const expectedDiscountType =
          vipDiscount > buy3pay2Discount ? "vip" : "buy3pay2";

        cart = addMultipleProducts(
          [
            { product: PRODUCTS.TSHIRT, quantity: 4 },
            { product: PRODUCTS.JEANS, quantity: 1 },
          ],
          CUSTOMER_TYPES.VIP
        );

        expectCartResult(
          cart,
          {
            subtotal: expectedSubtotal,
            discount: expectedDiscount,
            total: expectedTotal,
            totalQuantity: 5,
            appliedDiscountType: expectedDiscountType,
          },
          expectedItems
        );
      });
    });

    describe("Parametrized Business Scenarios", () => {
      test.each([
        {
          scenario: "Common customer buys three t-shirts",
          customerType: CUSTOMER_TYPES.REGULAR,
          items: [{ product: PRODUCTS.TSHIRT, quantity: 3 }],
          expected: {
            totalQuantity: 3,
            subtotal: 3 * PRICE_TSHIRT,
            discount: PRICE_TSHIRT,
            total: 2 * PRICE_TSHIRT,
            appliedDiscountType: "buy3pay2" as const,
          },
        },
        {
          scenario: "Common customer buys mixed cart (2 t-shirts + 2 jeans)",
          customerType: CUSTOMER_TYPES.REGULAR,
          items: [
            { product: PRODUCTS.TSHIRT, quantity: 2 },
            { product: PRODUCTS.JEANS, quantity: 2 },
          ],
          expected: {
            totalQuantity: 4,
            subtotal: 2 * PRICE_TSHIRT + 2 * PRICE_JEANS,
            discount: PRICE_TSHIRT,
            total: 2 * PRICE_TSHIRT + 2 * PRICE_JEANS - PRICE_TSHIRT,
            appliedDiscountType: "buy3pay2" as const,
          },
        },
      ])(
        "should handle business scenario: $scenario",
        ({ customerType, items, expected }) => {
          cart = addMultipleProducts(items, customerType);

          expectCartState(cart, expected);
        }
      );
    });
  });

  describe("Regular Customer Scenarios", () => {
    describe("Buy 3 Pay 2 Promotion", () => {
      it("should apply Buy 3 Pay 2 discount for 3 identical items", () => {
        cart = addItems(PRODUCTS.TSHIRT, 3, CUSTOMER_TYPES.REGULAR);

        expectCartState(cart, {
          totalQuantity: 3,
          subtotal: EXPECTED_TOTALS.THREE_TSHIRTS.subtotal,
          discount: EXPECTED_TOTALS.THREE_TSHIRTS.discount,
          total: EXPECTED_TOTALS.THREE_TSHIRTS.total,
          appliedDiscountType: "buy3pay2",
        });
      });

      it("should apply Buy 3 Pay 2 discount on cheapest item for mixed cart", () => {
        cart = addMultipleProducts(
          [
            { product: PRODUCTS.TSHIRT, quantity: 2 },
            { product: PRODUCTS.JEANS, quantity: 2 },
          ],
          CUSTOMER_TYPES.REGULAR
        );

        expectCartState(cart, {
          totalQuantity: 4,
          subtotal: EXPECTED_TOTALS.MIXED_CART_4_ITEMS.subtotal,
          discount: EXPECTED_TOTALS.MIXED_CART_4_ITEMS.discount,
          total: EXPECTED_TOTALS.MIXED_CART_4_ITEMS.total,
          appliedDiscountType: "buy3pay2",
        });
      });

      test.each([
        {
          description: "1 item",
          items: [{ product: PRODUCTS.TSHIRT, quantity: 1 }],
          expected: {
            totalQuantity: 1,
            subtotal: PRODUCT_PRICES.TSHIRT,
            discount: 0,
            total: PRODUCT_PRICES.TSHIRT,
            appliedDiscountType: "none" as const,
          },
        },
        {
          description: "2 items",
          items: [{ product: PRODUCTS.TSHIRT, quantity: 2 }],
          expected: {
            totalQuantity: 2,
            subtotal: PRODUCT_PRICES.TSHIRT * 2,
            discount: 0,
            total: PRODUCT_PRICES.TSHIRT * 2,
            appliedDiscountType: "none" as const,
          },
        },
      ])(
        "should not apply discount for $description",
        ({ items, expected }) => {
          cart = addMultipleProducts(items, CUSTOMER_TYPES.REGULAR);
          expectCartState(cart, expected);
        }
      );
    });
  });

  describe("VIP Customer Scenarios", () => {
    describe("Optimal Discount Selection", () => {
      it("should choose Buy 3 Pay 2 over VIP discount when more advantageous", () => {
        cart = addItems(PRODUCTS.DRESS, 3, CUSTOMER_TYPES.VIP);

        expectCartState(cart, {
          totalQuantity: 3,
          subtotal: EXPECTED_TOTALS.THREE_DRESSES.subtotal,
          discount: EXPECTED_TOTALS.THREE_DRESSES.discount,
          total: EXPECTED_TOTALS.THREE_DRESSES.total,
          appliedDiscountType: "buy3pay2",
        });
      });

      it("should choose Buy 3 Pay 2 for mixed high-value items", () => {
        cart = addMultipleProducts(
          [
            { product: PRODUCTS.JEANS, quantity: 2 },
            { product: PRODUCTS.DRESS, quantity: 2 },
          ],
          CUSTOMER_TYPES.VIP
        );

        const subtotal = PRODUCT_PRICES.JEANS * 2 + PRODUCT_PRICES.DRESS * 2;
        const buy3pay2Discount = PRODUCT_PRICES.JEANS;

        expectCartState(cart, {
          totalQuantity: 4,
          subtotal,
          discount: buy3pay2Discount,
          total: subtotal - buy3pay2Discount,
          appliedDiscountType: "buy3pay2",
        });
      });

      it("should choose Buy 3 Pay 2 for large quantity with mixed items", () => {
        cart = addMultipleProducts(
          [
            { product: PRODUCTS.TSHIRT, quantity: 4 },
            { product: PRODUCTS.JEANS, quantity: 1 },
          ],
          CUSTOMER_TYPES.VIP
        );

        const subtotal = PRODUCT_PRICES.TSHIRT * 4 + PRODUCT_PRICES.JEANS;

        expectCartState(cart, {
          totalQuantity: 5,
          subtotal,
          discount: PRODUCT_PRICES.TSHIRT,
          total: subtotal - PRODUCT_PRICES.TSHIRT,
          appliedDiscountType: "buy3pay2",
        });
      });

      test.each([
        {
          description: "1 dress",
          items: [{ product: PRODUCTS.DRESS, quantity: 1 }],
          expected: {
            totalQuantity: 1,
            subtotal: PRODUCT_PRICES.DRESS,
            discount: PRODUCT_PRICES.DRESS * DISCOUNT_RULES.VIP_DISCOUNT_RATE,
            total:
              PRODUCT_PRICES.DRESS * (1 - DISCOUNT_RULES.VIP_DISCOUNT_RATE),
            appliedDiscountType: "vip" as const,
          },
        },
        {
          description: "2 dresses",
          items: [{ product: PRODUCTS.DRESS, quantity: 2 }],
          expected: {
            totalQuantity: 2,
            subtotal: PRODUCT_PRICES.DRESS * 2,
            discount:
              PRODUCT_PRICES.DRESS * 2 * DISCOUNT_RULES.VIP_DISCOUNT_RATE,
            total:
              PRODUCT_PRICES.DRESS * 2 * (1 - DISCOUNT_RULES.VIP_DISCOUNT_RATE),
            appliedDiscountType: "vip" as const,
          },
        },
      ])(
        "should apply VIP discount for $description when below Buy 3 Pay 2 threshold",
        ({ items, expected }) => {
          cart = addMultipleProducts(items, CUSTOMER_TYPES.VIP);
          expectCartState(cart, expected);
        }
      );
    });
  });

  describe("Cart Operations", () => {
    describe("Item Updates", () => {
      it("should handle item removal and recalculate discounts correctly", () => {
        cart = addItems(PRODUCTS.TSHIRT, 3, CUSTOMER_TYPES.REGULAR);

        cart = handleUpdateCartItem(
          cart,
          PRODUCTS.TSHIRT.id,
          "minus",
          CUSTOMER_TYPES.REGULAR
        );

        expectCartState(cart, {
          totalQuantity: 2,
          subtotal: PRODUCT_PRICES.TSHIRT * 2,
          discount: 0,
          total: PRODUCT_PRICES.TSHIRT * 2,
          appliedDiscountType: "none",
        });
      });

      it("should handle complete item deletion", () => {
        cart = addItems(PRODUCTS.TSHIRT, 2, CUSTOMER_TYPES.REGULAR);
        cart = handleUpdateCartItem(
          cart,
          PRODUCTS.TSHIRT.id,
          "delete",
          CUSTOMER_TYPES.REGULAR
        );

        expectCartState(cart, {
          totalQuantity: 0,
          subtotal: 0,
          discount: 0,
          total: 0,
          appliedDiscountType: "none",
        });
      });

      it("should handle reducing quantity to zero", () => {
        cart = addItems(PRODUCTS.TSHIRT, 1, CUSTOMER_TYPES.REGULAR);
        cart = handleUpdateCartItem(
          cart,
          PRODUCTS.TSHIRT.id,
          "minus",
          CUSTOMER_TYPES.REGULAR
        );

        expectCartState(cart, {
          totalQuantity: 0,
          subtotal: 0,
          discount: 0,
          total: 0,
          appliedDiscountType: "none",
        });
      });
    });

    describe("Edge Cases", () => {
      it("should handle empty cart", () => {
        cart = handleAddCartItem(
          undefined,
          PRODUCTS.TSHIRT,
          CUSTOMER_TYPES.REGULAR
        );
        cart = handleUpdateCartItem(
          cart,
          PRODUCTS.TSHIRT.id,
          "delete",
          CUSTOMER_TYPES.REGULAR
        );

        expectCartState(cart, {
          totalQuantity: 0,
          subtotal: 0,
          discount: 0,
          total: 0,
          appliedDiscountType: "none",
        });
      });

      it("should handle adding same product multiple times", () => {
        cart = handleAddCartItem(cart, PRODUCTS.TSHIRT, CUSTOMER_TYPES.REGULAR);
        cart = handleAddCartItem(cart, PRODUCTS.TSHIRT, CUSTOMER_TYPES.REGULAR);
        cart = handleAddCartItem(cart, PRODUCTS.TSHIRT, CUSTOMER_TYPES.REGULAR);

        expect(cart.items).toHaveLength(1);
        expect(cart.items[0].quantity).toBe(3);
        expect(cart.items[0].productId).toBe(PRODUCTS.TSHIRT.id);
      });

      it("should handle non-existent product removal gracefully", () => {
        cart = addItems(PRODUCTS.TSHIRT, 2, CUSTOMER_TYPES.REGULAR);
        const nonExistentProductId = 999;

        cart = handleUpdateCartItem(
          cart,
          nonExistentProductId,
          "minus",
          CUSTOMER_TYPES.REGULAR
        );

        expectCartState(cart, {
          totalQuantity: 2,
          subtotal: PRODUCT_PRICES.TSHIRT * 2,
          discount: 0,
          total: PRODUCT_PRICES.TSHIRT * 2,
          appliedDiscountType: "none",
        });
      });

      test.each([
        {
          operation: "plus" as const,
          description: "increment quantity",
          expectedQuantity: 3,
        },
        {
          operation: "minus" as const,
          description: "decrement quantity",
          expectedQuantity: 1,
        },
      ])(
        "should $description for existing item",
        ({ operation, expectedQuantity }) => {
          cart = addItems(PRODUCTS.TSHIRT, 2, CUSTOMER_TYPES.REGULAR);
          cart = handleUpdateCartItem(
            cart,
            PRODUCTS.TSHIRT.id,
            operation,
            CUSTOMER_TYPES.REGULAR
          );

          expect(cart.items[0].quantity).toBe(expectedQuantity);
          expect(cart.totalQuantity).toBe(expectedQuantity);
        }
      );
    });

    describe("Discount Transition Scenarios", () => {
      it("should transition from VIP to Buy 3 Pay 2 when adding items", () => {
        cart = addItems(PRODUCTS.DRESS, 2, CUSTOMER_TYPES.VIP);
        expect(cart.appliedDiscountType).toBe("vip");

        cart = handleAddCartItem(cart, PRODUCTS.DRESS, CUSTOMER_TYPES.VIP);
        expect(cart.appliedDiscountType).toBe("buy3pay2");
      });

      it("should transition from Buy 3 Pay 2 to VIP when removing items", () => {
        cart = addItems(PRODUCTS.DRESS, 3, CUSTOMER_TYPES.VIP);
        expect(cart.appliedDiscountType).toBe("buy3pay2");

        cart = handleUpdateCartItem(
          cart,
          PRODUCTS.DRESS.id,
          "minus",
          CUSTOMER_TYPES.VIP
        );
        expect(cart.appliedDiscountType).toBe("vip");
      });

      it("should maintain Buy 3 Pay 2 discount when adding more expensive items", () => {
        cart = addItems(PRODUCTS.TSHIRT, 3, CUSTOMER_TYPES.VIP);
        expect(cart.appliedDiscountType).toBe("buy3pay2");

        cart = handleAddCartItem(cart, PRODUCTS.DRESS, CUSTOMER_TYPES.VIP);
        expect(cart.appliedDiscountType).toBe("buy3pay2");
        expect(cart.discount).toBeCloseTo(PRODUCT_PRICES.TSHIRT, 2);
      });
    });
  });
});
