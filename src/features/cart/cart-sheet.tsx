"use client";

import { useState } from "react";

import { OpenCart } from "./open-cart";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const items: Product[] = [
  {
    id: 1,
    name: "T-shirt",
    price: 35.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
  },
  {
    id: 2,
    name: "Jeans",
    price: 65.5,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center",
  },
  {
    id: 3,
    name: "Dress",
    price: 80.75,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center",
  },
];

export function CartSheet() {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const total = items.reduce((total, item) => total + item.price, 0).toFixed(2);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={items.length} />
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
                {items.length === 0 ? (
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
                    {items.map((item) => (
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
                              <p className="text-sm text-gray-500">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <button
                              className="group p-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <svg
                                className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div
                              className="flex items-center space-x-2"
                              role="group"
                              aria-label={`Quantity controls for ${item.name}`}
                            >
                              <button
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>
                              <span
                                className="text-sm font-medium text-gray-900 min-w-[2rem] text-center"
                                aria-label={`Quantity: 1`}
                              >
                                1
                              </span>
                              <button
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </button>
                            </div>
                            <p className="text-sm font-bold text-gray-900">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {items.length > 0 && (
                <footer className="border-t border-gray-300 px-6 py-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total:
                    </span>
                    <span
                      className="text-lg font-bold text-blue-600"
                      aria-label={`Total price: $${items.reduce((total, item) => total + item.price, 0).toFixed(2)}`}
                    >
                      ${total}
                    </span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium cursor-pointer">
                    Checkout
                  </button>
                </footer>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
