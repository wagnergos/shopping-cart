"use server";

import type { Cart, CartItem } from "@/features/cart/types/cart";
import { calculateCartTotalsWithPromotion } from "@/features/cart/services/discount";
import { cookies } from "next/headers";
import { MOCK_PRODUCTS_MAP } from "./constants";

const USER_COOKIE_NAME = "user-is-vip";

let serverCart: Cart = {
  items: [],
  subtotal: 0,
  discount: 0,
  total: 0,
  totalQuantity: 0,
  appliedDiscountType: "none",
};

async function getUserFromServerCookies(): Promise<{ isVip: boolean }> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get(USER_COOKIE_NAME);

    if (userCookie) {
      return { isVip: userCookie.value === "true" };
    }
  } catch (error) {
    console.warn("Error reading server cookie:", error);
  }

  return { isVip: false };
}

async function calculateCartTotals() {
  const userFromServer = await getUserFromServerCookies();
  const totals = calculateCartTotalsWithPromotion(
    serverCart.items,
    userFromServer.isVip
  );
  serverCart = {
    ...serverCart,
    ...totals,
  };
}

export async function getCart(): Promise<Cart> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return serverCart;
}

export async function getUser() {
  const userFromServer = await getUserFromServerCookies();
  return userFromServer;
}

export async function updateUserType(isVip: boolean): Promise<string> {
  const cookieStore = await cookies();
  cookieStore.set(USER_COOKIE_NAME, isVip.toString());

  await calculateCartTotals();
  return `User tier updated to ${isVip ? "VIP" : "Common"}`;
}

export async function addToCart(productId: number): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const product = MOCK_PRODUCTS_MAP[productId];
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

  await calculateCartTotals();
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
  await calculateCartTotals();
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

  await calculateCartTotals();
  return "Item quantity updated";
}
