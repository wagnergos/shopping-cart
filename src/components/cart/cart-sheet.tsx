"use client";

import { useState } from "react";
import { useCart } from "./cart-context";
import { OpenCart } from "./open-cart";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function CartSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const total = cart?.total || 0;
  const items = cart?.items;

  return (
    <>
      <button type="button" aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
        >
          <div
            className="absolute inset-0 bg-black opacity-50 transition-opacity"
            onClick={closeCart}
            aria-hidden="true"
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <header className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
                <h2
                  id="cart-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  My Cart
                </h2>
                <button
                  type="button"
                  onClick={closeCart}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </header>

              <section className="flex-1 overflow-y-auto px-6 py-4">
                {items?.length === 0 ? (
                  <div
                    className="text-center py-12"
                    role="status"
                    aria-live="polite"
                  >
                    <svg
                      className="mx-auto w-12 h-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l-1.5 1.5M6 16a2 2 0 100 4 2 2 0 000-4zM16 16a2 2 0 100 4 2 2 0 000-4z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                  </div>
                ) : (
                  <ul className="space-y-4" role="list" aria-label="Cart items">
                    {items?.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start space-x-4 py-4 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </h3>
                              <p
                                className="text-sm text-gray-500"
                                aria-label={`Price per unit: ${formatPrice(item.price)}`}
                              >
                                {formatPrice(item.price)}
                              </p>
                            </div>
                            <DeleteItemButton
                              productId={item.productId}
                              productName={item.name}
                            />
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div
                              className="flex items-center space-x-2"
                              role="group"
                              aria-label={`Quantity controls for ${item.name}`}
                            >
                              <EditItemQuantityButton
                                item={item}
                                type="minus"
                              />
                              <span
                                className="text-sm font-medium text-gray-900 min-w-[2rem] text-center"
                                aria-label={`Quantity: ${item.quantity}`}
                              >
                                {item.quantity}
                              </span>
                              <EditItemQuantityButton item={item} type="plus" />
                            </div>
                            <p
                              className="text-sm font-bold text-gray-900"
                              aria-label={`Subtotal for ${item.name}: ${formatPrice(item.price * item.quantity)}`}
                            >
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <footer className="border-t border-gray-300 bg-gray-50 px-6 py-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span
                      className="text-sm text-gray-600"
                      aria-label={`Subtotal: ${formatPrice(cart?.subtotal || 0)}`}
                    >
                      {formatPrice(cart?.subtotal || 0)}
                    </span>
                  </div>
                  {cart?.discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-600">
                        Discount applied:
                      </span>
                      <span
                        className="text-sm text-green-600"
                        aria-label={`Discount: ${formatPrice(cart.discount)}`}
                      >
                        -{formatPrice(cart.discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">
                      Total:
                    </span>
                    <span
                      className="text-lg font-bold text-gray-900"
                      aria-label={`Total: ${formatPrice(total)}`}
                    >
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium cursor-pointer"
                  aria-label="Go to checkout"
                >
                  Checkout
                </button>
              </footer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
