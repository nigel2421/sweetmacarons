
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import * as dataconnect from '../dataconnect-generated/react';
import Orders from './Orders';

// The GraphQL query to fetch orders for a user
const GetUserOrdersQuery = `
query GetUserOrders($userId: UUID!) @auth(level: USER) {
  user(id: $userId) {
    orders_on_user {
      id
      orderDate
      status
      totalAmount
      notes
      shippingAddressSnapshot
      orderItems_on_order {
        quantity
        unitPrice
        flavorNameSnapshot
      }
    }
  }
}`;

const MyOrders = ({ onLogout, onReorder }) => {
  return <Orders onLogout={onLogout} onReorder={onReorder} />;
};

export default MyOrders;
