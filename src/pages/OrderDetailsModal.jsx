
import React from 'react';
import { FiX } from 'react-icons/fi';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ order, show, onClose, onUpdateStatus }) => {
  if (!show) {
    return null;
  }

  const macaronsTotal = order.macaronsTotal || 0;
  const deliveryFee = order.deliveryFee || 0;
  const grandTotal = macaronsTotal + deliveryFee;
  const depositAmount = order.depositAmount || 0;
  const balance = order.balance || 0;

  const handleStatusChange = async (newStatus) => {
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, { status: newStatus });
      onUpdateStatus(order.id, newStatus);
      toast.success("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status: ", error);
      toast.error("Failed to update order status.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Details</h2>
          <button onClick={onClose} className="modal-close-button">
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          <h3>Order #{order.id}</h3>
          <p><strong>Date:</strong> {new Date(order.createdAt?.toDate()).toLocaleString()}</p>
          <div className="status-selector">
            <strong>Status:</strong>
            <select value={order.status} onChange={(e) => handleStatusChange(e.target.value)}>
              <option value="new">New</option>
              <option value="deposit-paid">Deposit Paid</option>
              <option value="confirmed">Confirmed</option>
              <option value="processed">Processed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <hr />
          <h4>Items</h4>
          <ul>
            {order.cart.map(item => (
              <li key={item.id}>
                {item.quantity} x {item.name} (Box of {item.option.box}) - Ksh {(item.option.price * item.quantity).toLocaleString()}
              </li>
            ))}
          </ul>
          <hr />
          <div className="order-totals">
            <p><strong>Macarons Total:</strong> Ksh {macaronsTotal.toLocaleString()}</p>
            <p><strong>Delivery Fee:</strong> Ksh {deliveryFee.toLocaleString()}</p>
            <p><strong>Grand Total:</strong> Ksh {grandTotal.toLocaleString()}</p>
            <hr />
            <p><strong>Deposit (30%):</strong> Ksh {depositAmount.toLocaleString()}</p>
            <p><strong>Balance Due:</strong> Ksh {balance.toLocaleString()}</p>
          </div>
          <p><strong>Delivery Option:</strong> {order.deliveryOption || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
