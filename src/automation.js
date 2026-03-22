
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
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
  console.log(`Scheduling automations for order ${order.orderId} (Current status: ${order.status})`);
  
  if (order.status === 'deposit-paid') {
    // Stage 1: Move to In-Progress after a short delay (or the specified hour)
    setTimeout(() => {
      console.log(`Automation: Moving order ${order.orderId} to in-progress`);
      updateOrderStatus(order.id, 'in-progress', 'deposit-paid');
    }, IN_PROGRESS_TIMEOUT);

    // Stage 2: Move to Shipped
    setTimeout(() => {
      console.log(`Automation: Moving order ${order.orderId} to shipped`);
      updateOrderStatus(order.id, 'shipped', 'in-progress');
    }, SHIPPED_TIMEOUT);

    // Stage 3: Move to Delivered
    // Note: Admin can still manually mark as Completed at any time.
    setTimeout(() => {
      console.log(`Automation: Moving order ${order.orderId} to delivered`);
      updateOrderStatus(order.id, 'delivered', 'shipped');
    }, DELIVERED_TIMEOUT);
  }
};
