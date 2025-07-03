import { CartSheet } from "@/components/cart/cart-sheet";

export async function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Store</h1>
        <nav aria-label="Shopping cart">
          <CartSheet />
        </nav>
      </div>
    </header>
  );
}
