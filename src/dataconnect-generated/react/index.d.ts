import { CreateDemoUserData, ListAvailableFlavorsData, CreateOrderData, CreateOrderVariables, GetUserOrdersData, GetUserOrdersVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateDemoUser(options?: useDataConnectMutationOptions<CreateDemoUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateDemoUserData, undefined>;
export function useCreateDemoUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateDemoUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateDemoUserData, undefined>;

export function useListAvailableFlavors(options?: useDataConnectQueryOptions<ListAvailableFlavorsData>): UseDataConnectQueryResult<ListAvailableFlavorsData, undefined>;
export function useListAvailableFlavors(dc: DataConnect, options?: useDataConnectQueryOptions<ListAvailableFlavorsData>): UseDataConnectQueryResult<ListAvailableFlavorsData, undefined>;

export function useCreateOrder(options?: useDataConnectMutationOptions<CreateOrderData, FirebaseError, CreateOrderVariables>): UseDataConnectMutationResult<CreateOrderData, CreateOrderVariables>;
export function useCreateOrder(dc: DataConnect, options?: useDataConnectMutationOptions<CreateOrderData, FirebaseError, CreateOrderVariables>): UseDataConnectMutationResult<CreateOrderData, CreateOrderVariables>;

export function useGetUserOrders(vars: GetUserOrdersVariables, options?: useDataConnectQueryOptions<GetUserOrdersData>): UseDataConnectQueryResult<GetUserOrdersData, GetUserOrdersVariables>;
export function useGetUserOrders(dc: DataConnect, vars: GetUserOrdersVariables, options?: useDataConnectQueryOptions<GetUserOrdersData>): UseDataConnectQueryResult<GetUserOrdersData, GetUserOrdersVariables>;
