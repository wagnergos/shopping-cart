import Image from "next/image";
import { AddToCart } from "@/features/cart/components/add-to-cart";
import { Product } from "@/features/products/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <li className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
    </li>
  );
}
