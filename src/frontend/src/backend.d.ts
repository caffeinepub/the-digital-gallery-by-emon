import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export interface Order {
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

export interface NewOrder {
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

export interface OrderUpdate {
    status: [] | [string];
    deliveryCharge: [] | [bigint];
    expectedDelivery: [] | [string];
}

export interface backendInterface {
    placeOrder(input: NewOrder): Promise<Order>;
    getOrders(): Promise<Order[]>;
    getOrdersByPhone(phone: string): Promise<Order[]>;
    updateOrder(id: string, update: OrderUpdate): Promise<[] | [Order]>;
    deleteOrder(id: string): Promise<boolean>;
    clearAllOrders(): Promise<void>;
}
