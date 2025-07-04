"use client";

import { createContext, useContext, useMemo, use, useCallback } from "react";
import { useOptimistic } from "react";
import type { Cart, UpdateType } from "../types/cart";
import { Product } from "@/types/product";
import { useUser } from "@/context/user-context";
import { createEmptyCart } from "../utils/cart-operations";
import {
  handleUpdateCartItem,
  handleAddCartItem,
} from "../services/cart-operations";
import { CartAction } from "../types/cart-operations";

type CartContextType = {
  cart: Cart;
  updateCartItem: (productId: number, updateType: UpdateType) => void;
  addCartItem: (product: Product) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  switch (action.type) {
    case "UPDATE_ITEM": {
      const { productId, updateType, userIsVip } = action.payload;
      return handleUpdateCartItem(state, productId, updateType, userIsVip);
    }
    case "ADD_ITEM": {
      const { product, userIsVip } = action.payload;
      return handleAddCartItem(state, product, userIsVip);
    }
    default:
      return state || createEmptyCart();
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart>;
}) {
  const { user } = useUser();
  const initialCart = use(cartPromise);

  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer
  );

  const updateCartItem = useCallback((productId: number, updateType: UpdateType) => {
    updateOptimisticCart({
      type: "UPDATE_ITEM",
      payload: { productId, updateType, userIsVip: user.isVip },
    });
  }, [updateOptimisticCart, user.isVip]);

  const addCartItem = useCallback((product: Product) => {
    updateOptimisticCart({
      type: "ADD_ITEM",
      payload: { product, userIsVip: user.isVip },
    });
  }, [updateOptimisticCart, user.isVip]);

  const value = useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
    }),
    [optimisticCart, updateCartItem, addCartItem]
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
