import { SELECTORS, PRODUCTS, USER_TYPES } from "../constants";

export class AppPage {
  visit() {
    cy.visit("/");
    return this;
  }

  openCart() {
    cy.openCart();
    return this;
  }

  closeCart() {
    cy.closeCart();
    return this;
  }

  clearCart() {
    cy.clearCartItems();
    return this;
  }

  addToCart(productName: string, quantity: number = 1) {
    cy.addToCart(productName, quantity);
    return this;
  }

  addTshirtToCart(quantity: number = 1) {
    return this.addToCart(PRODUCTS.TSHIRT.name, quantity);
  }

  addJeansToCart(quantity: number = 1) {
    return this.addToCart(PRODUCTS.JEANS.name, quantity);
  }

  addDressToCart(quantity: number = 1) {
    return this.addToCart(PRODUCTS.DRESS.name, quantity);
  }

  setUserType(userType: "Common" | "VIP") {
    cy.setUserType(userType);
    return this;
  }

  setCommonUser() {
    return this.setUserType(USER_TYPES.COMMON);
  }

  setVipUser() {
    return this.setUserType(USER_TYPES.VIP);
  }

  verifyCartTotal(expectedTotal: string) {
    cy.verifyCartTotal(expectedTotal);
    return this;
  }

  verifyDiscountType(discountType: "none" | "buy3pay2" | "vip") {
    cy.verifyDiscountType(discountType);
    return this;
  }

  verifyCartSubtotal(expectedSubtotal: string) {
    cy.get(SELECTORS.CART_SUBTOTAL).should("contain", expectedSubtotal);
    return this;
  }

  verifyCartDiscount(expectedDiscount: string) {
    cy.get(SELECTORS.CART_DISCOUNT).should("contain", expectedDiscount);
    return this;
  }

  verifyUserType(expectedUserType: "Common" | "VIP") {
    cy.get(SELECTORS.USER_TYPE).should("contain", expectedUserType);
    return this;
  }

  verifyCartCounter(expectedCount: string) {
    cy.get(SELECTORS.CART_COUNTER).should("contain", expectedCount);
    return this;
  }

  verifyCartCounterNotVisible() {
    cy.get(SELECTORS.CART_COUNTER).should("not.exist");
    return this;
  }

  verifyProductsAreDisplayed() {
    cy.get(SELECTORS.PRODUCT_CARD).should("have.length", 3);

    cy.contains(PRODUCTS.TSHIRT.name).should("be.visible");
    cy.contains(`$${PRODUCTS.TSHIRT.price}`).should("be.visible");

    cy.contains(PRODUCTS.JEANS.name).should("be.visible");
    cy.contains(`$${PRODUCTS.JEANS.price}`).should("be.visible");

    cy.contains(PRODUCTS.DRESS.name).should("be.visible");
    cy.contains(`$${PRODUCTS.DRESS.price}`).should("be.visible");

    return this;
  }

  verifyEmptyCartState() {
    cy.get(SELECTORS.EMPTY_CART_MESSAGE).should("be.visible");
    return this;
  }

  decreaseQuantity() {
    cy.get(SELECTORS.DECREASE_QUANTITY).first().click();
    return this;
  }

  increaseQuantity() {
    cy.get(SELECTORS.INCREASE_QUANTITY).first().click();
    return this;
  }

  verifyToggleUserTypeButtonVisible() {
    cy.get(SELECTORS.TOGGLE_USER_TYPE).should("be.visible");
    return this;
  }

  resetAppState() {
    cy.resetAppState();
    return this;
  }
}
