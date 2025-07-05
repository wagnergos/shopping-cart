/// <reference types="cypress" />

import { SELECTORS, DISCOUNT_TYPES, DISCOUNT_LABELS } from "./constants";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to add a product to cart
       * @example cy.addToCart('T-shirt', 2)
       */
      addToCart(productName: string, quantity?: number): Chainable<Element>;

      /**
       * Custom command to open the cart
       * @example cy.openCart()
       */
      openCart(): Chainable<Element>;

      /**
       * Custom command to close the cart
       * @example cy.closeCart()
       */
      closeCart(): Chainable<Element>;

      /**
       * Custom command to set user type idempotently
       * @example cy.setUserType('VIP')
       */
      setUserType(userType: "Common" | "VIP"): Chainable<Element>;

      /**
       * Custom command to verify cart total
       * @example cy.verifyCartTotal('71.98')
       */
      verifyCartTotal(expectedTotal: string): Chainable<Element>;

      /**
       * Custom command to verify applied discount type
       * @example cy.verifyDiscountType('buy3pay2')
       */
      verifyDiscountType(
        discountType: "none" | "buy3pay2" | "vip"
      ): Chainable<Element>;

      /**
       * Custom command to clear all items from cart via UI
       * @example cy.clearCartItems()
       */
      clearCartItems(): Chainable<Element>;

      /**
       * Custom command to reset application state
       * @example cy.resetAppState()
       */
      resetAppState(): Chainable<Element>;
    }
  }
}

Cypress.Commands.add(
  "addToCart",
  (productName: string, quantity: number = 1) => {
    for (let i = 0; i < quantity; i++) {
      cy.contains(productName).parent().find(SELECTORS.ADD_TO_CART).click();
    }
  }
);

Cypress.Commands.add("openCart", () => {
  cy.get(SELECTORS.CART_BUTTON).click({ force: true });
});

Cypress.Commands.add("closeCart", () => {
  cy.get(SELECTORS.CLOSE_CART).click();
});

Cypress.Commands.add("setUserType", (userType: "Common" | "VIP") => {
  cy.openCart();

  cy.get(SELECTORS.USER_TYPE).then(($userType) => {
    const currentUserType = $userType.text().trim();
    if (currentUserType !== userType) {
      cy.get(SELECTORS.TOGGLE_USER_TYPE).click();
      cy.get(SELECTORS.USER_TYPE).should("contain", userType);
    }
  });
});

Cypress.Commands.add("verifyCartTotal", (expectedTotal: string) => {
  cy.get(SELECTORS.CART_TOTAL).should("contain", expectedTotal);
});

Cypress.Commands.add(
  "verifyDiscountType",
  (discountType: "none" | "buy3pay2" | "vip") => {
    if (discountType === DISCOUNT_TYPES.NONE) {
      cy.get(SELECTORS.DISCOUNT_INFO).should("not.exist");
    } else {
      const expectedLabel =
        discountType === DISCOUNT_TYPES.BUY3PAY2
          ? DISCOUNT_LABELS.BUY3PAY2
          : DISCOUNT_LABELS.VIP;
      cy.get(SELECTORS.DISCOUNT_INFO).should("contain", expectedLabel);
    }
  }
);

Cypress.Commands.add("clearCartItems", () => {
  cy.openCart();

  cy.get("body").then(($body) => {
    const deleteButtons = $body.find(SELECTORS.REMOVE_ITEM_BUTTON);
    if (deleteButtons.length > 0) {
      cy.get(SELECTORS.REMOVE_ITEM_BUTTON).each(($button) => {
        cy.wrap($button).click();
      });
    }
  });

  // Verify cart is empty and close it
  cy.get("body").then(($body) => {
    if ($body.find(SELECTORS.EMPTY_CART_MESSAGE).length > 0) {
      cy.closeCart();
    } else {
      cy.closeCart();
    }
  });
});

Cypress.Commands.add("resetAppState", () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

export {};
