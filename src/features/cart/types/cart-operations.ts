import type { UpdateType } from "./cart";
import { Product } from "@/features/products/types";

export type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: {
        productId: number;
        updateType: UpdateType;
        userIsVip: boolean;
      };
    }
  | {
      type: "ADD_ITEM";
      payload: { product: Product; userIsVip: boolean };
    };

export type CartActionType = CartAction["type"];

export type UpdateItemPayload = Extract<
  CartAction,
  { type: "UPDATE_ITEM" }
>["payload"];
export type AddItemPayload = Extract<
  CartAction,
  { type: "ADD_ITEM" }
>["payload"];
