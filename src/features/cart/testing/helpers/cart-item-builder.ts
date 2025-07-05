import type { CartItem } from "@/features/cart/types/cart";
import { PRODUCT_PRICES, PRODUCT_NAMES } from "../fixtures/products";

export class CartItemBuilder {
  private cartItem: CartItem;

  constructor() {
    this.cartItem = {
      id: "cart-item-1",
      productId: 1,
      name: PRODUCT_NAMES.TSHIRT,
      price: PRODUCT_PRICES.TSHIRT,
      quantity: 1,
      image: "t-shirt.jpg",
    };
  }

  withId(id: string): CartItemBuilder {
    this.cartItem.id = id;
    return this;
  }

  withProductId(productId: number): CartItemBuilder {
    this.cartItem.productId = productId;
    this.cartItem.id = `cart-item-${productId}`;
    return this;
  }

  withName(name: string): CartItemBuilder {
    this.cartItem.name = name;
    this.cartItem.image = `${name.toLowerCase().replace(/\s+/g, "-")}.jpg`;
    return this;
  }

  withPrice(price: number): CartItemBuilder {
    this.cartItem.price = price;
    return this;
  }

  withQuantity(quantity: number): CartItemBuilder {
    this.cartItem.quantity = quantity;
    return this;
  }

  withImage(image: string): CartItemBuilder {
    this.cartItem.image = image;
    return this;
  }

  asTShirt(): CartItemBuilder {
    return this.withName(PRODUCT_NAMES.TSHIRT)
      .withPrice(PRODUCT_PRICES.TSHIRT)
      .withImage("t-shirt.jpg");
  }

  asJeans(): CartItemBuilder {
    return this.withName(PRODUCT_NAMES.JEANS)
      .withPrice(PRODUCT_PRICES.JEANS)
      .withImage("jeans.jpg");
  }

  asDress(): CartItemBuilder {
    return this.withName(PRODUCT_NAMES.DRESS)
      .withPrice(PRODUCT_PRICES.DRESS)
      .withImage("dress.jpg");
  }

  build(): CartItem {
    return { ...this.cartItem };
  }
}

export const aCartItem = () => new CartItemBuilder();
