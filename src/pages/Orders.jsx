
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import OrderDetailsModal from './OrderDetailsModal';
import Dashboard from './Dashboard';
import './Orders.css';

const Orders = ({ onLogout, orders, loading }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

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

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Orders</h1>
        <div className="admin-actions">
          <Link to="/analytics" className="analytics-button-mobile">Analytics</Link>
          <button onClick={handleDownloadCsv} className="download-csv-button">Download as CSV</button>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
      <div className="dashboard-desktop">
        <Dashboard orders={orders} />
      </div>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        <>
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
              {currentOrders.map((order) => (
                <tr key={order.id}>
                  <td data-label="Order ID">{order.id}</td>
                  <td data-label="Date">{new Date(order.createdAt?.toDate()).toLocaleString()}</td>
                  <td data-label="Total">Ksh {order.grandTotal.toLocaleString()}</td>
                  <td data-label="Status"><span className={`order-status ${order.status}`}>{order.status}</span></td>
                  <td data-label="Actions">
                    <button onClick={() => handleViewMore(order)} className="view-more-button">View More</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
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
