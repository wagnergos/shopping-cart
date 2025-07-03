export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

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
  total: number;
  totalQuantity: number;
};

export type UserType = "common" | "vip";

export type UpdateType = "plus" | "minus" | "delete";
