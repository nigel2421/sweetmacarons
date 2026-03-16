
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from './firebase';
import { logAdminAction } from './lib/audit';

const IN_PROGRESS_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours
const SHIPPED_TIMEOUT = 72 * 60 * 60 * 1000; // 72 hours
const DELIVERED_TIMEOUT = 96 * 60 * 60 * 1000; // 96 hours

const updateOrderStatus = async (orderId, newStatus, previousStatus) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      statusHistory: arrayUnion({
        status: newStatus,
        timestamp: new Date().toISOString(),
        updatedBy: 'System Automation',
      }),
    });
    await logAdminAction('UPDATE_ORDER_STATUS', {
      orderId: orderId,
      newStatus: newStatus,
      previousStatus: previousStatus,
      updatedBy: 'System Automation',
    });
  } catch (error) {
    console.error(`Error updating order status to ${newStatus}:`, error);
  }
};

export const scheduleStatusUpdates = (order) => {
  if (order.status === 'deposit-paid') {
    setTimeout(() => {
      updateOrderStatus(order.id, 'in-progress', 'deposit-paid');
    }, IN_PROGRESS_TIMEOUT);

    setTimeout(() => {
      updateOrderStatus(order.id, 'shipped', 'in-progress');
    }, SHIPPED_TIMEOUT);

    setTimeout(() => {
      updateOrderStatus(order.id, 'delivered', 'shipped');
    }, DELIVERED_TIMEOUT);
  }
};
