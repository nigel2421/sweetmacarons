
import { useState } from 'react';
import Papa from 'papaparse';
import OrderDetailsModal from './OrderDetailsModal';
import './Orders.css';

const Orders = ({ onLogout, orders, loading, setOrders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleUpdateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  const handleDownloadCsv = () => {
    const csvData = orders.map(order => ({
      'Order ID': order.id,
      'Date': new Date(order.createdAt?.toDate()).toLocaleString(),
      'Macarons Total': order.macaronsTotal || 0,
      'Delivery Fee': order.deliveryFee || 0,
      'Grand Total': (order.macaronsTotal || 0) + (order.deliveryFee || 0),
      'Delivery Option': order.deliveryOption || 'N/A',
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

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Orders</h1>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search by Order ID..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="admin-actions">
            <button onClick={handleDownloadCsv} className="download-csv-button">Download as CSV</button>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </div>
      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length > 0 ? (
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
              {currentOrders.map((order) => {
                const grandTotal = (order.macaronsTotal || 0) + (order.deliveryFee || 0);
                return (
                  <tr key={order.id}>
                    <td data-label="Order ID">{order.id}</td>
                    <td data-label="Date">{new Date(order.createdAt?.toDate()).toLocaleString()}</td>
                    <td data-label="Total">Ksh {grandTotal.toLocaleString()}</td>
                    <td data-label="Status"><span className={`order-status ${order.status.toLowerCase().replace('-', '')}`}>{order.status}</span></td>
                    <td data-label="Actions">
                      <button onClick={() => handleViewMore(order)} className="view-more-button">View More</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>              Next
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
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default Orders;
