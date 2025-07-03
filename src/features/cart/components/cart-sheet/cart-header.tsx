import { UserStatusSection } from "./user-status-section";

interface CartHeaderProps {
  onClose: () => void;
}

export function CartHeader({ onClose }: CartHeaderProps) {
  return (
    <header className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h2 id="cart-title" className="text-lg font-semibold text-gray-900">
          My Cart
        </h2>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          onClick={onClose}
          aria-label="Close cart"
        >
          <svg
            className="h-6 w-6"
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
      </div>

      <UserStatusSection />
    </header>
  );
}
