
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import OrderDetailsModal from './OrderDetailsModal';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { adminEmails } from '../admin';
import './Orders.css';
import { Link } from 'react-router-dom';

const Orders = ({ onLogout, onReorder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const userIsAdmin = adminEmails.includes(user.email);
        setIsAdmin(userIsAdmin);

        const ordersQuery = userIsAdmin
          ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
          : query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));

        const unsubscribeFirestore = onSnapshot(ordersQuery, (querySnapshot) => {
          const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(ordersData);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching orders: ", error);
          setLoading(false);
        });

        return () => unsubscribeFirestore();
      } else {
        console.log('No user authenticated');
        setIsAdmin(false);
        setOrders([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

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

  const handleUpdateStatus = (orderId, newStatus) => {
    // In a real app, you would update this in Firestore
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
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
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!auth.currentUser) {
    return <p>Please login to view this page.</p>;
  }

  return (
    <div className="orders-page">
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
                      <td data-label="Status"><span className={`order-status ${order.status.toLowerCase().replace('-', '')}`}>{order.status}</span></td>
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
        onUpdateStatus={isAdmin ? handleUpdateStatus : undefined}
        onReorder={!isAdmin ? onReorder : undefined}
      />
    </div>
  );
};

export default Orders;
