import { formatPrice } from "../../utils/format";
import { Cart } from "../../types/cart";

interface CartSummaryProps {
  cart: Cart | null;
}

export function CartSummary({ cart }: CartSummaryProps) {
  const total = cart?.total || 0;
  const hasItems = !!cart?.items?.length;

  return (
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
        {cart?.discount && cart.discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-600">
              {cart.appliedDiscountType === "vip"
                ? "VIP Discount:"
                : "Discount applied:"}
            </span>
            <span
              className="text-sm text-green-600"
              aria-label={`Discount: ${formatPrice(cart.discount)}`}
              role="status"
            >
              -{formatPrice(cart.discount)}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span
            className="text-lg font-bold text-gray-900"
            aria-label={`Total: ${formatPrice(total)}`}
            role="status"
            aria-live="polite"
          >
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        disabled={!hasItems}
      >
        Checkout
      </button>
    </footer>
  );
}
