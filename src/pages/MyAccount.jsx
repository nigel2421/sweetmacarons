
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import { checkIsAdmin } from '../admin';
import './MyAccount.css';

const MyAccount = ({ onLogout }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      checkIsAdmin(user).then(res => setIsAdmin(res));
    }
  }, [user]);
  const handleLogout = () => {
    auth.signOut().then(() => {
      if (onLogout) onLogout();
    });
  };

  if (!user) {
    return <p>Please login to view this page.</p>;
  }

  return (
    <div className="my-account-page">
      <h1>My Account</h1>
      <div className="account-details">
        <p><strong>Email:</strong> {user.email}</p>
        {isAdmin && <p className="admin-badge">Admin Account</p>}
      </div>
      <div className="account-actions">
        <div className="action-section">
          <h3>Customer Tools</h3>
          <div className="button-group">
            <Link to="/my-orders" className="visit-store-button">My Order History</Link>
            <Link to="/" className="visit-store-button second">Continue Shopping</Link>
          </div>
        </div>

        {isAdmin && (
          <div className="action-section admin-section">
            <h3>Admin Management</h3>
            <div className="button-group">
              <Link to="/dashboard" className="visit-store-button admin-link">Performance Dashboard</Link>
              <Link to="/orders" className="visit-store-button admin-link">Order Fulfillment</Link>
              <Link to="/users" className="visit-store-button admin-link">User Management</Link>
            </div>
          </div>
        )}

        <div className="account-footer">
          <button onClick={handleLogout} className="logout-button">Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
