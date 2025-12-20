
import React from 'react';
import { FiX } from 'react-icons/fi';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ order, show, onClose }) => {
  if (!show) {
    return null;
  }

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
          <p><strong>Status:</strong> <span className={`order-status ${order.status}`}>{order.status}</span></p>
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
            <p><strong>Macarons Total:</strong> Ksh {order.macaronsTotal.toLocaleString()}</p>
            <p><strong>Delivery Fee:</strong> Ksh {order.deliveryFee.toLocaleString()}</p>
            <p><strong>Grand Total:</strong> Ksh {order.grandTotal.toLocaleString()}</p>
          </div>
          <p><strong>Delivery Option:</strong> {order.deliveryOption}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
