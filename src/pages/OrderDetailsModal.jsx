
import React from 'react';
import { FiX } from 'react-icons/fi';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ order, show, onClose, onUpdateStatus, onReorder }) => {
  const [isUpdating, setIsUpdating] = React.useState(false);

  if (!show) {
    return null;
  }

  const macaronsTotal = order.macaronsTotal || 0;
  const deliveryFee = order.deliveryFee || 0;
  const grandTotal = macaronsTotal + deliveryFee;
  const depositAmount = order.depositAmount || 0;
  const balance = order.balance || 0;

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, { status: newStatus });
      onUpdateStatus(order.id, newStatus);
      toast.success("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status: ", error);
      toast.error("Failed to update order status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Details</h2>
          <button onClick={onClose} className="modal-close-button" aria-label="Close modal" title="Close">
            <FiX style={{ strokeWidth: '4', color: '#D0021B', display: 'block' }} />
          </button>
        </div>
        <div className="modal-body">
          <h3>Order #{order.id}</h3>
          <p><strong>Date:</strong> {new Date(order.createdAt?.toDate()).toLocaleString()}</p>
          <div className="status-selector">
            <strong>Status:</strong>
            {onUpdateStatus ? (
              <div className="selector-container">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdating}
                >
                  <option value="new">New</option>
                  <option value="deposit-paid">Deposit Paid</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processed">Processed</option>
                  <option value="delivered">Delivered</option>
                </select>
                {isUpdating && <div className="status-spinner"></div>}
              </div>
            ) : (
              <span className={`order-status ${order.status.toLowerCase().replace('-', '')}`}>{order.status}</span>
            )}
          </div>
          <hr />
          <h4>Items</h4>
          <div className="order-items-list">
            {order.cart.map(item => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-details">{item.quantity} x Box of {item.option.box}</span>
                </div>
                <span className="item-price">Ksh {(item.option.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="order-totals">
            <div className="total-row">
              <strong>Macarons Total:</strong>
              <span>Ksh {macaronsTotal.toLocaleString()}</span>
            </div>
            <div className="total-row">
              <strong>Delivery Fee:</strong>
              <span>Ksh {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="total-row grand-total">
              <strong>Grand Total:</strong>
              <strong>Ksh {grandTotal.toLocaleString()}</strong>
            </div>
            <div className="total-row financials">
              <strong>Deposit (30%):</strong>
              <span>Ksh {depositAmount.toLocaleString()}</span>
            </div>
            <div className="total-row financials">
              <strong>Balance Due:</strong>
              <span>Ksh {balance.toLocaleString()}</span>
            </div>
          </div>
          <p className="delivery-info"><strong>Delivery Option:</strong> {order.deliveryOption || 'N/A'}</p>
        </div>
        {onReorder && (
          <div className="modal-footer">
            <button onClick={() => onReorder(order)} className="reorder-button-modal">Order Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsModal;
