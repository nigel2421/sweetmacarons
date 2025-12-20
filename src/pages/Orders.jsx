
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Papa from 'papaparse';
import OrderDetailsModal from './OrderDetailsModal';
import './Orders.css';

const Orders = ({ onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, 'orders');
        const q = query(ordersCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders: ", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    onLogout();
  };

  const handleViewMore = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDownloadCsv = () => {
    const csvData = orders.map(order => ({
      'Order ID': order.id,
      'Date': new Date(order.createdAt?.toDate()).toLocaleString(),
      'Macarons Total': order.macaronsTotal,
      'Delivery Fee': order.deliveryFee,
      'Grand Total': order.grandTotal,
      'Delivery Option': order.deliveryOption,
      'Status': order.status,
      'Cart Items': order.cart.map(item => `${item.quantity} x ${item.name} (Box of ${item.option.box})`).join(', ')
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Orders</h1>
        <div className="admin-actions">
          <button onClick={handleDownloadCsv} className="download-csv-button">Download as CSV</button>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.createdAt?.toDate()).toLocaleString()}</td>
                <td>Ksh {order.grandTotal.toLocaleString()}</td>
                <td><span className={`order-status ${order.status}`}>{order.status}</span></td>
                <td>
                  <button onClick={() => handleViewMore(order)} className="view-more-button">View More</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
      <OrderDetailsModal
        order={selectedOrder}
        show={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Orders;
