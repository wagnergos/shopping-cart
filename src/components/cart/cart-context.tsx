"use client";

import { createContext, useContext, useMemo, use } from "react";
import { useOptimistic } from "react";
import type { Cart, CartItem, Product, UpdateType } from "./types";
import { calculateCartTotalsWithPromotion } from "./promotion-utils";

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { productId: number; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: { product: Product };
    };

type CartContextType = {
  cart: Cart;
  updateCartItem: (productId: number, updateType: UpdateType) => void;
  addCartItem: (product: Product) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function createEmptyCart(): Cart {
  return {
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    totalQuantity: 0,
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { productId, updateType } = action.payload;
      let updatedItems = [...currentCart.items];

      if (updateType === "delete") {
        updatedItems = updatedItems.filter(
          (item) => item.productId !== productId
        );
      } else {
        const itemIndex = updatedItems.findIndex(
          (item) => item.productId === productId
        );
        if (itemIndex !== -1) {
          const item = updatedItems[itemIndex];
          const newQuantity =
            updateType === "plus" ? item.quantity + 1 : item.quantity - 1;

          if (newQuantity <= 0) {
            updatedItems.splice(itemIndex, 1);
          } else {
            updatedItems[itemIndex] = { ...item, quantity: newQuantity };
          }
        }
      }

      const totals = calculateCartTotalsWithPromotion(updatedItems);
      return {
        items: updatedItems,
        subtotal: totals.subtotal,
        discount: totals.discount,
        total: totals.total,
        totalQuantity: totals.totalQuantity,
      };
    }
    case "ADD_ITEM": {
      const { product } = action.payload;
      const existingItem = currentCart.items.find(
        (item) => item.productId === product.id
      );

      let updatedItems;
      if (existingItem) {
        updatedItems = currentCart.items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `cart-item-${product.id}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        };
        updatedItems = [...currentCart.items, newItem];
      }

      const totals = calculateCartTotalsWithPromotion(updatedItems);
      return {
        items: updatedItems,
        subtotal: totals.subtotal,
        discount: totals.discount,
        total: totals.total,
        totalQuantity: totals.totalQuantity,
      };
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart>;
}) {
  const initialCart = use(cartPromise);

  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer
  );

  const updateCartItem = (productId: number, updateType: UpdateType) => {
    updateOptimisticCart({
      type: "UPDATE_ITEM",
      payload: { productId, updateType },
    });
  };

  const addCartItem = (product: Product) => {
    updateOptimisticCart({ type: "ADD_ITEM", payload: { product } });
  };

  const value = useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
    }),
    [optimisticCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
