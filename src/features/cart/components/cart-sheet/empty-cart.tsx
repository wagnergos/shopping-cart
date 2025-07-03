export function EmptyCart() {
  return (
    <div className="text-center py-12" role="status" aria-live="polite">
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
  );
}
