import React, { useState, useEffect } from 'react';
import OrderDetailsModal from './OrderDetailsModal';
import './Orders.css';

const Orders = ({ orders: initialOrders }) => {
    const [orders, setOrders] = useState(initialOrders || []);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('active');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        setOrders(initialOrders || []);
    }, [initialOrders]);

    useEffect(() => {
        const filterOrders = () => {
            const activeStatuses = ['pending', 'deposit-paid', 'in-progress', 'shipped', 'delivered'];
            const completedStatuses = ['order-closed', 'cancelled'];

            if (activeTab === 'active') {
                setFilteredOrders(orders.filter(order => activeStatuses.includes(order.status)));
            } else {
                setFilteredOrders(orders.filter(order => completedStatuses.includes(order.status)));
            }
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
            <div className="orders-list">
                {filteredOrders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="order-card" onClick={() => handleOrderClick(order)}>
                            <div className="order-card-header">
                                <h3>Order #{order.orderId}</h3>
                                <span className={`order-status ${order.status.toLowerCase().replace('-', '')}`}>{order.status}</span>
                            </div>
                            <p><strong>Date:</strong> {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}</p>
                            <p><strong>Total:</strong> Ksh {(order.grandTotal || 0).toLocaleString()}</p>
                        </div>
                    ))
                )}
            </div>
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    show={!!selectedOrder}
                    onClose={handleCloseModal}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    );
};

export default Orders;
