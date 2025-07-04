export const PRODUCTS = {
  TSHIRT: {
    name: "T-shirt",
    price: 35.99,
  },
  JEANS: {
    name: "Jeans",
    price: 65.5,
  },
  DRESS: {
    name: "Dress",
    price: 80.75,
  },
} as const;

export const USER_TYPES = {
  COMMON: "Common",
  VIP: "VIP",
} as const;

export const DISCOUNT_TYPES = {
  NONE: "none",
  BUY3PAY2: "buy3pay2",
  VIP: "vip",
} as const;

export const SELECTORS = {
  CART_BUTTON: '[data-testid="cart-button"]',
  CART_COUNTER: '[data-testid="cart-counter"]',
  CLOSE_CART: '[data-testid="close-cart"]',
  CART_TOTAL: '[data-testid="cart-total"]',
  CART_SUBTOTAL: '[data-testid="cart-subtotal"]',
  CART_DISCOUNT: '[data-testid="cart-discount"]',

  USER_TYPE: '[data-testid="user-type"]',
  TOGGLE_USER_TYPE: '[data-testid="toggle-user-type"]',

  PRODUCT_CARD: '[data-testid="product-card"]',
  ADD_TO_CART: '[data-testid="add-to-cart"]',
  INCREASE_QUANTITY: '[data-testid="increase-quantity"]',
  DECREASE_QUANTITY: '[data-testid="decrease-quantity"]',

  DISCOUNT_INFO: '[data-testid="discount-info"]',

  REMOVE_ITEM_BUTTON: 'button[aria-label*="Remove"][aria-label*="from cart"]',

  EMPTY_CART_MESSAGE: 'p:contains("Your cart is empty")',
} as const;

export const DISCOUNT_LABELS = {
  BUY3PAY2: "Buy 3 Pay 2",
  VIP: "VIP Discount",
} as const;
