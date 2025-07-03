"use client";

import { useState } from "react";
import { useCart } from "../cart-context";
import { OpenCart } from "../open-cart";
import { CartHeader } from "./cart-header";
import { CartItemList } from "./cart-item-list";
import { CartSummary } from "./cart-summary";

export function CartSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <>
      <button type="button" aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black opacity-50 transition-opacity"
            onClick={closeCart}
            aria-hidden="true"
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col overflow-hidden">
            <CartHeader onClose={closeCart} />

            <section className="flex-1 px-6 py-4 overflow-y-auto">
              <CartItemList items={cart?.items} />
            </section>

            <CartSummary cart={cart} />
          </div>
        </div>
      )}
    </>
  );
}
