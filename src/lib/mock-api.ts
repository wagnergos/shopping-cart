import type { Product, Cart, CartItem } from "@/components/cart/types";
import { calculateCartTotalsWithPromotion } from "@/components/cart/promotion-utils";

let serverCart: Cart = {
  items: [],
  subtotal: 0,
  discount: 0,
  total: 0,
  totalQuantity: 0,
};

const mockProducts: Record<number, Product> = {
  1: {
    id: 1,
    name: "T-shirt",
    price: 35.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
  },
  2: {
    id: 2,
    name: "Jeans",
    price: 65.5,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center",
  },
  3: {
    id: 3,
    name: "Dress",
    price: 80.75,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center",
  },
};

function calculateCartTotals() {
  const totals = calculateCartTotalsWithPromotion(serverCart.items);
  serverCart.subtotal = totals.subtotal;
  serverCart.discount = totals.discount;
  serverCart.total = totals.total;
  serverCart.totalQuantity = totals.totalQuantity;
}

export async function getCart(): Promise<Cart> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return serverCart;
}

export function updateCartData(updatedCart: Cart): void {
  serverCart = updatedCart;
}

export async function addToCart(productId: number): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const product = mockProducts[productId];
  if (!product) {
    return "Product not found";
  }

  const existingItem = serverCart.items.find(
    (item) => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const newItem: CartItem = {
      id: `cart-item-${productId}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    };
    serverCart.items.push(newItem);
  }

  calculateCartTotals();
  return "Product added to cart";
}

export async function removeFromCart(productId: number): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const itemIndex = serverCart.items.findIndex(
    (item) => item.productId === productId
  );

  if (itemIndex === -1) {
    return "Item not found";
  }

  serverCart.items.splice(itemIndex, 1);
  calculateCartTotals();
  return "Product removed from cart";
}

export async function updateCart(data: {
  productId: number;
  quantity: number;
}): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const { productId, quantity } = data;

  if (quantity <= 0) {
    return await removeFromCart(productId);
  }

  const itemIndex = serverCart.items.findIndex(
    (item) => item.productId === productId
  );

  if (itemIndex === -1) {
    return "Item not found";
  }

  const item = serverCart.items[itemIndex];
  item.quantity = quantity;

  calculateCartTotals();
  return "Item quantity updated";
}
