import type { Product } from "@/components/products/types";

export const MOCK_PRODUCTS: Product[] = [
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

export const MOCK_PRODUCTS_MAP: Record<number, Product> = MOCK_PRODUCTS.reduce(
  (acc, product) => {
    acc[product.id] = product;
    return acc;
  },
  {} as Record<number, Product>
);
