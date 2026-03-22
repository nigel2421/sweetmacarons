import React, { useState, useEffect } from 'react';
import OrderDetailsModal from './OrderDetailsModal';
import { db, auth } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './Orders.css';

const Orders = ({ orders: initialOrders, isAdmin }) => {
    const [orders, setOrders] = useState(initialOrders || []);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('active');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [bulkStatus, setBulkStatus] = useState('');

    const [prevInitialOrders, setPrevInitialOrders] = useState(initialOrders);
    if (initialOrders !== prevInitialOrders) {
        setOrders(initialOrders || []);
        setPrevInitialOrders(initialOrders);
    }

    useEffect(() => {
        const filterOrders = () => {
            const activeStatuses = ['pending', 'deposit-paid', 'in-progress', 'shipped', 'delivered'];
            const completedStatuses = ['order-closed', 'cancelled'];

            if (activeTab === 'active') {
                setFilteredOrders(orders.filter(order => activeStatuses.includes(order.status)));
            } else {
                setFilteredOrders(orders.filter(order => completedStatuses.includes(order.status)));
            }
            // Clear selection on tab change
            setSelectedOrderIds([]);
        };

        filterOrders();
    }, [orders, activeTab]);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const handleUpdateStatus = (orderId, newStatus) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    };

    const toggleSelectOrder = (id) => {
        setSelectedOrderIds(prev => 
            prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedOrderIds.length === filteredOrders.length) {
            setSelectedOrderIds([]);
        } else {
            setSelectedOrderIds(filteredOrders.map(o => o.id));
        }
    };

    const handleBulkStatusUpdate = async () => {
        if (!bulkStatus || selectedOrderIds.length === 0) return;
        
        const confirmMsg = `Are you sure you want to update ${selectedOrderIds.length} orders to '${bulkStatus}'?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            const updatePromises = selectedOrderIds.map(async (id) => {
                const orderRef = doc(db, 'orders', id);
                return updateDoc(orderRef, {
                    status: bulkStatus,
                    statusHistory: arrayUnion({
                        status: bulkStatus,
                        timestamp: new Date().toISOString(),
                        updatedBy: auth.currentUser?.email || 'Admin Bulk'
                    })
                });
            });

            await Promise.all(updatePromises);
            toast.success(`Successfully updated ${selectedOrderIds.length} orders!`);
            setSelectedOrderIds([]);
            setBulkStatus('');
        } catch (error) {
            console.error("Bulk update error:", error);
            toast.error("Failed to update some orders.");
        }
    };

    return (
        <div className="orders-page">
            <h1>Order Management</h1>
            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active Orders
                </button>
                <button
                    className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed/Historical Orders
                </button>
            </div>
            {selectedOrderIds.length > 0 && (
                <div className="bulk-actions-bar">
                    <span className="selected-count">{selectedOrderIds.length} orders selected</span>
                    <div className="bulk-controls">
                        <select 
                            value={bulkStatus} 
                            onChange={(e) => setBulkStatus(e.target.value)}
                            className="bulk-status-select"
                        >
                            <option value="">Select Status...</option>
                            <option value="pending">Pending</option>
                            <option value="deposit-paid">Deposit Paid</option>
                            <option value="in-progress">In Progress</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="order-closed">Order Completed</option>
                        </select>
                        <button 
                            onClick={handleBulkStatusUpdate}
                            disabled={!bulkStatus}
                            className="apply-bulk-btn"
                        >
                            Apply to All
                        </button>
                    </div>
                </div>
            )}

            <div className="orders-container">
                {filteredOrders.length === 0 ? (
                    <div className="no-orders-wrapper">
                        <p>No orders found.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="table-wrapper desktop-only">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th className="checkbox-cell">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(order => (
                                        <tr key={order.id} className={`order-row ${selectedOrderIds.includes(order.id) ? 'selected' : ''}`}>
                                            <td className="checkbox-cell">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedOrderIds.includes(order.id)}
                                                    onChange={() => toggleSelectOrder(order.id)}
                                                />
                                            </td>
                                            <td className="order-id">#{order.orderId}</td>
                                            <td>{new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}</td>
                                            <td>{order.userName || 'Anonymous'}</td>
                                            <td className="order-total">Ksh {(order.grandTotal || 0).toLocaleString()}</td>
                                            <td>
                                                <span className={`order-status-badge ${order.status.toLowerCase().replace('-', '')}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button 
                                                    className="edit-order-btn"
                                                    onClick={() => handleOrderClick(order)}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="mobile-only orders-cards-list">
                            {filteredOrders.map(order => (
                                <div 
                                    key={order.id} 
                                    className={`order-mobile-card ${selectedOrderIds.includes(order.id) ? 'selected' : ''}`}
                                >
                                    <div className="card-selection-header">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedOrderIds.includes(order.id)}
                                            onChange={() => toggleSelectOrder(order.id)}
                                        />
                                        <span className="card-order-id">#{order.orderId}</span>
                                        <span className={`order-status-badge ${order.status.toLowerCase().replace('-', '')}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="card-body" onClick={() => handleOrderClick(order)}>
                                        <div className="card-info">
                                            <span className="label">Customer:</span>
                                            <span className="value">{order.userName || 'Anonymous'}</span>
                                        </div>
                                        <div className="card-info">
                                            <span className="label">Date:</span>
                                            <span className="value">{new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="card-info">
                                            <span className="label">Total:</span>
                                            <span className="value highlighting">Ksh {(order.grandTotal || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button className="view-details-mobile-btn" onClick={() => handleOrderClick(order)}>
                                            View & Edit Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    show={!!selectedOrder}
                    onClose={handleCloseModal}
                    onUpdateStatus={handleUpdateStatus}
                    isAdmin={isAdmin}
                />
            )}
        </div>
    );
};

export default Orders;
