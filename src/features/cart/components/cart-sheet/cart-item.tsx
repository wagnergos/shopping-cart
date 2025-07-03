import Image from "next/image";
import { DeleteItemButton } from "../delete-item-button";
import { EditItemQuantityButton } from "../edit-item-quantity-button";
import { formatPrice } from "../../utils/format";
import { CartItem as CartItemType } from "../../types/cart";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  return (
    <li className="flex items-start space-x-4 py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-md"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {item.name}
            </h3>
            <p
              className="text-sm text-gray-500"
              aria-label={`Price per unit: ${formatPrice(item.price)}`}
            >
              {formatPrice(item.price)}
            </p>
          </div>
          <DeleteItemButton
            productId={item.productId}
            productName={item.name}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div
            className="flex items-center space-x-2"
            role="group"
            aria-label={`Quantity controls for ${item.name}`}
          >
            <EditItemQuantityButton item={item} type="minus" />
            <span
              className="text-sm font-medium text-gray-900 min-w-[2rem] text-center"
              aria-label={`Quantity: ${item.quantity}`}
            >
              {item.quantity}
            </span>
            <EditItemQuantityButton item={item} type="plus" />
          </div>
          <p
            className="text-sm font-bold text-gray-900"
            aria-label={`Subtotal for ${item.name}: ${formatPrice(item.price * item.quantity)}`}
          >
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </li>
  );
}
