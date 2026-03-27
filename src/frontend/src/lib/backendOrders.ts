// Backend order integration helpers
// Converts between frontend Order type (strings/numbers) and backend bigint fields

import type { Order } from "./data";

export interface BackendOrder {
  id: string;
  customerName: string;
  phone: string;
  productName: string;
  price: bigint;
  deliveryCharge: bigint;
  status: string;
  pickupCity: string;
  createdAt: bigint;
  thickness: string;
  expectedDelivery: string;
  frameOptions: string;
  customSize: string;
  quantity: bigint;
}

export interface BackendNewOrder {
  customerName: string;
  phone: string;
  productName: string;
  price: bigint;
  deliveryCharge: bigint;
  status: string;
  pickupCity: string;
  thickness: string;
  expectedDelivery: string;
  frameOptions: string;
  customSize: string;
  quantity: bigint;
}

export interface BackendOrderUpdate {
  status: [] | [string];
  deliveryCharge: [] | [bigint];
  expectedDelivery: [] | [string];
}

export interface BackendActorWithOrders {
  placeOrder(input: BackendNewOrder): Promise<BackendOrder>;
  getOrders(): Promise<BackendOrder[]>;
  getOrdersByPhone(phone: string): Promise<BackendOrder[]>;
  updateOrder(
    id: string,
    update: BackendOrderUpdate,
  ): Promise<[] | [BackendOrder]>;
  deleteOrder(id: string): Promise<boolean>;
  clearAllOrders(): Promise<void>;
}

export function orderFromBackend(o: BackendOrder): Order {
  return {
    id: o.id,
    customerName: o.customerName,
    phone: o.phone,
    productId: "",
    productName: o.productName,
    size: o.frameOptions || "",
    thickness: o.thickness,
    quantity: Number(o.quantity),
    price: Number(o.price),
    advanceAmount: Math.ceil(Number(o.price) * 0.3),
    advancePaid: true,
    deliveryCharge: Number(o.deliveryCharge),
    pickupCity: o.pickupCity,
    photoRef: "via WhatsApp",
    status: (o.status as Order["status"]) || "pending",
    expectedDelivery: o.expectedDelivery,
    createdAt: new Date(Number(o.createdAt) / 1_000_000).toISOString(),
    notes: "",
    frameColour: o.customSize || undefined,
  };
}

export function orderToBackendNew(
  order: Omit<Order, "id" | "createdAt">,
): BackendNewOrder {
  return {
    customerName: order.customerName,
    phone: order.phone,
    productName: order.productName,
    price: BigInt(Math.round(order.price)),
    deliveryCharge: BigInt(Math.round(order.deliveryCharge)),
    status: order.status,
    pickupCity: order.pickupCity,
    thickness: order.thickness,
    expectedDelivery: order.expectedDelivery,
    frameOptions: order.size || "",
    customSize: order.frameColour || "",
    quantity: BigInt(order.quantity),
  };
}

export function getBackendActor(actor: unknown): BackendActorWithOrders | null {
  if (!actor) return null;
  return actor as BackendActorWithOrders;
}
