import { ProductCard } from "@/features/products/product-card";
import { MOCK_PRODUCTS } from "@/lib/constants";

export function ProductList() {
  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      aria-label="Product catalog"
    >
      <ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        role="list"
      >
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </section>
  );
}
