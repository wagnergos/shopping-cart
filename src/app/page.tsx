import Image from "next/image";
import { AddToCart } from "@/components/cart/add-to-cart";
import type { Product } from "@/components/cart/types";

const products: Product[] = [
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

export default function Home() {
  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      aria-label="Product catalog"
    >
      <ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        role="list"
      >
        {products.map((product) => (
          <li key={product.id}>
            <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64">
                <Image
                  src={product.image}
                  alt={`${product.name} - Product image`}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p
                  className="text-2xl font-bold text-blue-600 mb-4"
                  aria-label={`Price: $${product.price}`}
                >
                  ${product.price}
                </p>
                <AddToCart product={product} />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
