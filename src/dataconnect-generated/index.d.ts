import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateDemoUserData {
  user_insert: User_Key;
}

export interface CreateOrderData {
  order_insert: Order_Key;
}

export interface CreateOrderVariables {
  userId: UUIDString;
  notes?: string | null;
  shippingAddressSnapshot: string;
  status: string;
  totalAmount: number;
}

export interface Flavor_Key {
  id: UUIDString;
  __typename?: 'Flavor_Key';
}

export interface GetUserOrdersData {
  user?: {
    orders_on_user: ({
      id: UUIDString;
      orderDate: TimestampString;
      status: string;
      totalAmount: number;
      notes?: string | null;
      shippingAddressSnapshot?: string | null;
      orderItems_on_order: ({
        quantity: number;
        unitPrice: number;
        flavorNameSnapshot?: string | null;
      })[];
    } & Order_Key)[];
  };
}

export interface GetUserOrdersVariables {
  userId: UUIDString;
}

export interface ListAvailableFlavorsData {
  flavors: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    allergens?: string[] | null;
  } & Flavor_Key)[];
}

export interface OrderItem_Key {
  id: UUIDString;
  __typename?: 'OrderItem_Key';
}

export interface Order_Key {
  id: UUIDString;
  __typename?: 'Order_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateDemoUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateDemoUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateDemoUserData, undefined>;
  operationName: string;
}
export const createDemoUserRef: CreateDemoUserRef;

export function createDemoUser(): MutationPromise<CreateDemoUserData, undefined>;
export function createDemoUser(dc: DataConnect): MutationPromise<CreateDemoUserData, undefined>;

interface ListAvailableFlavorsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAvailableFlavorsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAvailableFlavorsData, undefined>;
  operationName: string;
}
export const listAvailableFlavorsRef: ListAvailableFlavorsRef;

export function listAvailableFlavors(): QueryPromise<ListAvailableFlavorsData, undefined>;
export function listAvailableFlavors(dc: DataConnect): QueryPromise<ListAvailableFlavorsData, undefined>;

interface CreateOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrderVariables): MutationRef<CreateOrderData, CreateOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateOrderVariables): MutationRef<CreateOrderData, CreateOrderVariables>;
  operationName: string;
}
export const createOrderRef: CreateOrderRef;

export function createOrder(vars: CreateOrderVariables): MutationPromise<CreateOrderData, CreateOrderVariables>;
export function createOrder(dc: DataConnect, vars: CreateOrderVariables): MutationPromise<CreateOrderData, CreateOrderVariables>;

interface GetUserOrdersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserOrdersVariables): QueryRef<GetUserOrdersData, GetUserOrdersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserOrdersVariables): QueryRef<GetUserOrdersData, GetUserOrdersVariables>;
  operationName: string;
}
export const getUserOrdersRef: GetUserOrdersRef;

export function getUserOrders(vars: GetUserOrdersVariables): QueryPromise<GetUserOrdersData, GetUserOrdersVariables>;
export function getUserOrders(dc: DataConnect, vars: GetUserOrdersVariables): QueryPromise<GetUserOrdersData, GetUserOrdersVariables>;

