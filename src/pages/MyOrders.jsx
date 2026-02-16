
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // onAuthStateChanged is a better way to get the current user
    // as it handles the case where the component mounts before auth is initialized.
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchOrders(user.uid);
      } else {
        setLoading(false);
        setError("Please log in to see your orders.");
        setOrders([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchOrders = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await dataconnect.execute({
        query: GetUserOrdersQuery,
        variables: { userId: userId },
      });

      if (result.errors) {
        throw new Error(result.errors.map(e => e.message).join('\n'));
      }

      if (result.data && result.data.user && result.data.user.orders_on_user) {
        // The Orders component expects a certain data format, so we transform the data.
        const formattedOrders = result.data.user.orders_on_user.map(o => ({
            id: o.id,
            orderId: o.id,
            createdAt: { toDate: () => new Date(o.orderDate) }, // Mimic Firestore timestamp
            macaronsTotal: o.totalAmount,
            deliveryFee: 0, // Not available in the query result
            status: o.status,
            items: o.orderItems_on_order.map(item => ({
                quantity: item.quantity,
                macaron: { name: item.flavorNameSnapshot },
                option: { box: 'Custom' } // Not available in the query result
            })),
            deliveryAddress: o.shippingAddressSnapshot,
            notes: o.notes
        }));
        setOrders(formattedOrders);
      } else {
        setOrders([]); // No orders found for the user
      }
    } catch (e) {
      console.error("Error fetching user orders:", e);
      setError("Failed to fetch your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <div className="loading-container"><p>Loading your orders...</p></div>;
  }

  if (error) {
    return <div className="error-container"><p>{error}</p></div>;
  }

  // Pass the fetched orders to the Orders component
  return <Orders orders={orders} onLogout={onLogout} onReorder={onReorder} isAdmin={false} />;
};

export default MyOrders;
