"use server";

import { revalidatePath } from "next/cache";
import { addToCart, removeFromCart, updateCart } from "@/lib/mock-api";

export async function addItem(prevState: any, productId: number) {
  if (!productId) return "Product not found";

  try {
    await addToCart(productId);
    revalidatePath("/");
  } catch {
    return "Error adding item to cart";
  }
}

export async function removeItem(prevState: any, productId: number) {
  if (!productId) return "Product not found";

  try {
    await removeFromCart(productId);
    revalidatePath("/");
  } catch {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    productId: number;
    quantity: number;
  }
) {
  if (!payload.productId) return "Product not found";

  try {
    await updateCart(payload);
    revalidatePath("/");
  } catch {
    return "Error updating item quantity";
  }
}
