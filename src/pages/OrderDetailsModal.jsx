
import React from 'react';
import { FiX } from 'react-icons/fi';
import { db, auth } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { logAdminAction } from '../lib/audit';
import { generateOrderReceipt } from '../lib/pdf';
import { toast } from 'react-toastify';
import { FiDownload } from 'react-icons/fi';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ order, show, onClose, onUpdateStatus, onReorder }) => {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isEditingDeposit, setIsEditingDeposit] = React.useState(false);
  const [tempDeposit, setTempDeposit] = React.useState(0);

  React.useEffect(() => {
    if (order?.depositAmount !== undefined) {
      setTempDeposit(order.depositAmount);
    } else if (order?.macaronsTotal) {
      setTempDeposit(Math.round(order.macaronsTotal * 0.5));
    }
  }, [order?.id, order?.depositAmount, order?.macaronsTotal]);

  if (!show || !order) {
    return null;
  }

  const macaronsTotal = order.macaronsTotal || 0;
  const deliveryFee = order.deliveryFee || 0;
  const grandTotal = macaronsTotal + deliveryFee;
  const depositAmount = order.depositAmount !== undefined ? order.depositAmount : (macaronsTotal * 0.5);
  const balance = grandTotal - depositAmount;

  const handleDepositUpdate = async () => {
    if (!order) return;
    setIsUpdating(true);
    try {
      const orderRef = doc(db, 'orders', order.id);

      const updateData = {
        depositAmount: tempDeposit,
        balance: grandTotal - tempDeposit
      };

      // Auto-update status to in-progress if it was pending
      if (order.status === 'pending') {
        updateData.status = 'in-progress';
        updateData.statusHistory = arrayUnion({
          status: 'in-progress',
          timestamp: new Date().toISOString(),
          updatedBy: auth.currentUser?.email || 'System (Deposit Set)'
        });
      }

      await updateDoc(orderRef, updateData);

      await logAdminAction('UPDATE_DEPOSIT', {
        orderId: order.orderId,
        oldDeposit: order.depositAmount || 0,
        newDeposit: tempDeposit,
        statusChanged: order.status === 'pending'
      });

      if (onUpdateStatus) onUpdateStatus(order.id, updateData.status || order.status);
      setIsEditingDeposit(false);
      toast.success("Deposit updated and status set to in-progress");
    } catch (error) {
      console.error("Error updating deposit:", error);
      toast.error("Failed to update deposit");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (statusValue) => {
    setIsUpdating(true);
    try {
      const orderRef = doc(db, 'orders', order.id);
      const previousStatus = order.status;

      await updateDoc(orderRef, {
        status: statusValue,
        statusHistory: arrayUnion({
          status: statusValue,
          timestamp: new Date().toISOString(),
          updatedBy: auth.currentUser?.email || 'System'
        })
      });

      await logAdminAction('UPDATE_ORDER_STATUS', {
        orderId: order.orderId,
        firestoreId: order.id,
        newStatus: statusValue,
        previousStatus
      });

      if (onUpdateStatus) onUpdateStatus(order.id, statusValue);
      toast.success(`Order status updated to ${statusValue}`);
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
            <FiX size={20} style={{ strokeWidth: '4' }} />
            <span>CLOSE</span>
          </button>
        </div>
        <div className="order-details-scrollable">
          <div className="modal-body">
            <div className="order-title-row">
              <h3>Order #{order.orderId}</h3>
              <button
                className="download-pdf-btn"
                onClick={() => generateOrderReceipt(order)}
                title="Download Receipt as PDF"
              >
                <FiDownload /> Receipt (PDF)
              </button>
            </div>
            <p><strong>Date:</strong> {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleString()}</p>
            <div className="status-selector">
              <strong>Status:</strong>
              {onUpdateStatus ? (
                <div className="selector-container">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={isUpdating}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="in-progress">In Progress</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
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
              {order.items.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.macaron.name}</span>
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
                <strong>Deposit Paid:</strong>
                {onUpdateStatus ? (
                  isEditingDeposit ? (
                    <div className="deposit-manage-box">
                      <div className="deposit-input-wrapper">
                        <span className="ksy-prefix">Ksh</span>
                        <input
                          type="number"
                          value={tempDeposit}
                          onChange={(e) => setTempDeposit(Number(e.target.value))}
                          className="deposit-input"
                          autoFocus
                        />
                      </div>
                      <div className="deposit-actions">
                        <button
                          className="btn-set-30"
                          onClick={() => setTempDeposit(Math.round(macaronsTotal * 0.3))}
                          title="Calculate 50% of macarons total"
                        >
                          Set 50%
                        </button>
                        <button
                          className="btn-save-deposit"
                          onClick={handleDepositUpdate}
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          className="btn-cancel-edit"
                          onClick={() => {
                            setIsEditingDeposit(false);
                            setTempDeposit(order.depositAmount || Math.round(macaronsTotal * 0.5));
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="deposit-view-box">
                      <span>Ksh {depositAmount.toLocaleString()}</span>
                      <button className="btn-edit-deposit" onClick={() => setIsEditingDeposit(true)}>Edit</button>
                    </div>
                  )
                ) : (
                  <span>Ksh {depositAmount.toLocaleString()}</span>
                )}
              </div>
              <div className="total-row financials">
                <strong>Balance Due:</strong>
                <span className={balance <= 0 ? 'balance-cleared' : ''}>
                  Ksh {balance.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="delivery-info"><strong>Delivery Option:</strong> {order.deliveryOption || 'N/A'}</p>
            {order.deliveryOption !== 'pickup' && order.deliveryAddress && (
              <div className="delivery-address-details">
                <h4>Delivery Address</h4>
                <p>{order.deliveryAddress}</p>
              </div>
            )}

            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="order-history-section">
                <hr />
                <h4>Status History</h4>
                <ul className="history-list">
                  {order.statusHistory.slice().reverse().map((entry, index) => (
                    <li key={index} className="history-item">
                      <span className="history-status">{entry.status}</span>
                      <span className="history-meta">
                        {new Date(entry.timestamp).toLocaleString()} by {entry.updatedBy}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {onReorder && (
            <div className="modal-footer">
              <button onClick={() => onReorder(order)} className="reorder-button-modal">Order Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
