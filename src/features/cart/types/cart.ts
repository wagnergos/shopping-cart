export type CartItem = {
  id: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  totalQuantity: number;
  appliedDiscountType: "none" | "buy3pay2" | "vip";
};

export type UpdateType = "plus" | "minus" | "delete";
