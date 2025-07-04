import { AppPage } from "../support/page-objects/AppPage";
import { PRODUCTS, USER_TYPES, DISCOUNT_TYPES } from "../support/constants";

describe("Shopping Cart E2E Tests", () => {
  let appPage: AppPage;

  beforeEach(() => {
    appPage = new AppPage();

    appPage.resetAppState();

    appPage.visit();

    appPage.clearCart();

    appPage.setCommonUser().closeCart();
  });

  describe("Common Customer Scenarios", () => {
    context("Buy 3 Pay 2 Promotion", () => {
      it("should apply Buy 3 Pay 2 discount when purchasing 3 T-shirts", () => {
        appPage.openCart().verifyUserType(USER_TYPES.COMMON).closeCart();

        appPage.addTshirtToCart(3);

        appPage
          .openCart()
          .verifyCartTotal("71.98")
          .verifyDiscountType(DISCOUNT_TYPES.BUY3PAY2)
          .verifyCartSubtotal("107.97")
          .verifyCartDiscount("35.99");
      });

      it("should apply Buy 3 Pay 2 discount on cheapest item for mixed product cart", () => {
        appPage.openCart().verifyUserType(USER_TYPES.COMMON).closeCart();

        appPage.addTshirtToCart(2).addJeansToCart(2);

        appPage
          .openCart()
          .verifyCartTotal("166.99")
          .verifyDiscountType(DISCOUNT_TYPES.BUY3PAY2)
          .verifyCartSubtotal("202.98")
          .verifyCartDiscount("35.99");
      });
    });

    context("No Promotion Scenarios", () => {
      it("should not apply any discount when purchasing fewer than 3 items", () => {
        appPage.addTshirtToCart(2);

        appPage
          .openCart()
          .verifyCartTotal("71.98")
          .verifyDiscountType(DISCOUNT_TYPES.NONE)
          .verifyCartSubtotal("71.98");
      });
    });
  });

  describe("VIP Customer Scenarios", () => {
    context("Optimal Discount Selection", () => {
      it("should choose Buy 3 Pay 2 over VIP discount when purchasing 3 Dresses", () => {
        appPage.setVipUser().closeCart();

        appPage.addDressToCart(3);

        appPage
          .openCart()
          .verifyUserType(USER_TYPES.VIP)
          .verifyCartTotal("161.50")
          .verifyDiscountType(DISCOUNT_TYPES.BUY3PAY2)
          .verifyCartSubtotal("242.25")
          .verifyCartDiscount("80.75");
      });

      it("should choose Buy 3 Pay 2 over VIP discount for mixed expensive items", () => {
        appPage.setVipUser().closeCart();

        appPage.addJeansToCart(2).addDressToCart(2);

        appPage
          .openCart()
          .verifyUserType(USER_TYPES.VIP)
          .verifyCartTotal("227.00")
          .verifyDiscountType(DISCOUNT_TYPES.BUY3PAY2)
          .verifyCartSubtotal("292.50")
          .verifyCartDiscount("65.5");
      });

      it("should handle complex scenario with 4 T-shirts and 1 Jeans", () => {
        appPage.setVipUser().closeCart();

        appPage.addTshirtToCart(4).addJeansToCart(1);

        appPage
          .openCart()
          .verifyUserType(USER_TYPES.VIP)
          .verifyCartTotal("173.47")
          .verifyDiscountType(DISCOUNT_TYPES.BUY3PAY2)
          .verifyCartSubtotal("209.46")
          .verifyCartDiscount("35.99");
      });

      it("should apply VIP discount when more advantageous than Buy 3 Pay 2", () => {
        appPage.setVipUser().closeCart();

        appPage.addTshirtToCart(2);

        appPage
          .openCart()
          .verifyUserType(USER_TYPES.VIP)
          .verifyCartTotal("61.18")
          .verifyDiscountType(DISCOUNT_TYPES.VIP)
          .verifyCartSubtotal("71.98");
      });
    });
  });

  describe("Complete Shopping Flow", () => {
    context("Cart Management Operations", () => {
      it("should handle adding items, removing items, and changing user types", () => {
        appPage.addTshirtToCart(2);

        appPage
          .openCart()
          .verifyUserType(USER_TYPES.COMMON)
          .verifyCartTotal("71.98")
          .verifyDiscountType(DISCOUNT_TYPES.NONE)
          .closeCart();

        appPage.addTshirtToCart(1);

        appPage
          .openCart()
          .verifyCartTotal("71.98")
          .verifyDiscountType(DISCOUNT_TYPES.BUY3PAY2)
          .closeCart();

        appPage
          .setVipUser()
          .verifyCartTotal("71.98")
          .verifyDiscountType(DISCOUNT_TYPES.BUY3PAY2);

        appPage
          .decreaseQuantity()
          .verifyCartTotal("61.18")
          .verifyDiscountType(DISCOUNT_TYPES.VIP)
          .closeCart();

        appPage.addDressToCart(2);

        appPage
          .openCart()
          .verifyCartSubtotal("233.48")
          .verifyDiscountType(DISCOUNT_TYPES.BUY3PAY2)
          .verifyCartTotal("197.49");
      });
    });
  });

  describe("User Interface Validation", () => {
    context("Product Display and Cart States", () => {
      it("should display all products correctly with proper pricing", () => {
        appPage.verifyProductsAreDisplayed();
      });

      it("should display empty cart state correctly", () => {
        appPage.verifyCartCounterNotVisible();

        appPage.addTshirtToCart(1).verifyCartCounter("1");

        appPage
          .openCart()
          .verifyToggleUserTypeButtonVisible()
          .verifyUserType(USER_TYPES.COMMON);

        appPage.setVipUser().verifyUserType(USER_TYPES.VIP);
      });
    });
  });

  describe("Error Handling and Edge Cases", () => {
    context("Cart State Persistence", () => {
      it("should maintain cart state across page reloads", () => {
        appPage.addTshirtToCart(2).setVipUser().closeCart();

        appPage.visit();

        appPage
          .openCart()
          .verifyUserType(USER_TYPES.VIP)
          .verifyCartTotal("61.18")
          .verifyDiscountType(DISCOUNT_TYPES.VIP);
      });

      it("should handle empty cart operations gracefully", () => {
        appPage.openCart().verifyEmptyCartState().closeCart();

        appPage.clearCart();
      });
    });
  });
});
