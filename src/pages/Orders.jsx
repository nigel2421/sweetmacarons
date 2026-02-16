
import { useState } from 'react';
import Papa from 'papaparse';
import OrderDetailsModal from './OrderDetailsModal';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { logAdminAction } from '../lib/audit';
import { toast } from 'react-toastify';
import './Orders.css';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';

const Orders = ({ orders: allOrders = [], isAdmin: userIsAdmin = false, onLogout, onReorder }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const orders = allOrders; // Use the passed orders
  const isAdmin = userIsAdmin; // Use the passed isAdmin status

  // No need for internal loading state if App handle it, 
  // but we can add a check if orders is still empty and user is admin.
  const loading = false;


  const handleLogout = () => {
    auth.signOut().then(() => {
      if (onLogout) onLogout();
    });
  };

  const handleViewMore = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });

      await logAdminAction('UPDATE_ORDER_STATUS_QUICK', {
        orderId,
        newStatus
      });

      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status: ", error);
      toast.error("Failed to update status.");
    }
  };

  const handleDownloadCsv = () => {
    const csvData = orders.map(order => ({
      'Order ID': order.orderId,
      'Date': new Date(order.createdAt?.toDate()).toLocaleString(),
      'Macarons Total': order.macaronsTotal || 0,
      'Delivery Fee': order.deliveryFee || 0,
      'Grand Total': (order.macaronsTotal || 0) + (order.deliveryFee || 0),
      'Deposit Amount': order.depositAmount || 0,
      'Balance': order.balance || 0,
      'Delivery Option': order.deliveryOption || 'N/A',
      'Delivery Address': order.deliveryAddress || 'N/A',
      'Status': order.status,
      'Cart Items': order.items.map(item => `${item.quantity} x ${item.macaron.name} (Box of ${item.option.box})`).join(', ')
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
    (order.orderId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOrdersPerPageChange = (e) => {
    setOrdersPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!auth.currentUser) {
    return <p>Please login to view this page.</p>;
  }

  return (
    <div className="orders-page">
      <div className="orders-header-top">
        <Link to="/my-account" className="back-to-account-link">
          <FaArrowLeft /> Back to Account
        </Link>
      </div>
      <div className="orders-header">
        <h1>{isAdmin ? 'All Orders' : 'My Orders'}</h1>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search by Order ID..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="admin-actions">
            <select
              value={ordersPerPage}
              onChange={handleOrdersPerPageChange}
              className="page-size-selector"
              title="Items per page"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
            {isAdmin && <button onClick={handleDownloadCsv} className="download-csv-button">Download as CSV</button>}
            <Link to="/" className="visit-store-button">Visit Store</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </div>
      {filteredOrders.length > 0 ? (
        <>
          <div className="orders-table-container">
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
                      <td data-label="Order ID">{order.orderId}</td>
                      <td data-label="Date">{order.createdAt ? new Date(order.createdAt.toDate()).toLocaleString() : 'Pending...'}</td>
                      <td data-label="Total">Ksh {grandTotal.toLocaleString()}</td>
                      <td data-label="Status"><span className={`order-status ${(order.status || '').toLowerCase().replace(/\s+/g, '-')}`}>{order.status}</span></td>
                      <td data-label="Actions">
                        <button onClick={() => handleViewMore(order)} className="view-more-button">View More</button>
                        {!isAdmin && <button onClick={() => onReorder(order)} className="reorder-button">Order Again</button>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              <FaChevronLeft />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
              <FaChevronRight />
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
        onUpdateStatus={isAdmin ? handleUpdateStatus : undefined}
        onReorder={!isAdmin ? onReorder : undefined}
      />
    </div>
  );
};

export default Orders;
