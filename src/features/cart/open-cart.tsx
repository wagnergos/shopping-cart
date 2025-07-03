interface OpenCartProps {
  quantity?: number;
}

export function OpenCart({ quantity }: OpenCartProps) {
  return (
    <div className="relative border border-neutral-200 text-black p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer">
      <svg
        className="w-4 h-4 transition-all ease-in-out hover:scale-110"
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
      {!!quantity && (
        <span className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded-sm bg-blue-600 text-[11px] font-medium text-white">
          {quantity}
        </span>
      )}
    </div>
  );
}
