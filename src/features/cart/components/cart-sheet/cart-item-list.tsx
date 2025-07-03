import { CartItem } from "./cart-item";
import { EmptyCart } from "./empty-cart";
import { CartItem as CartItemType } from "../../types/cart";

interface CartItemListProps {
  items: CartItemType[] | undefined;
}

export function CartItemList({ items }: CartItemListProps) {
  if (!items?.length) {
    return <EmptyCart />;
  }

  return (
    <ul className="space-y-4" role="list" aria-label="Cart items">
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
