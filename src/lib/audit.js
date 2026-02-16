import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Logs an administrative action to the auditLogs collection.
 * @param {string} action - The action performed (e.g., 'UPDATE_ORDER_STATUS')
 * @param {Object} details - Additional details about the action
 */
export const logAdminAction = async (action, details) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
        await addDoc(collection(db, 'auditLogs'), {
            adminEmail: user.email,
            adminUid: user.uid,
            action,
            details,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error logging admin action:", error);
    }
};
