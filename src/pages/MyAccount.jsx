
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import { adminEmails } from '../admin';
import './MyAccount.css';

const MyAccount = ({ onLogout }) => {
  const user = auth.currentUser;
  const isAdmin = user && adminEmails.includes(user.email);

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
        <Link to="/my-orders" className="visit-store-button">My Orders</Link>
        {isAdmin && (
          <>
            <Link to="/dashboard" className="visit-store-button admin-link">Dashboard</Link>
            <Link to="/orders" className="visit-store-button admin-link">All Orders</Link>
            <Link to="/users" className="visit-store-button admin-link">User Management</Link>
            <Link to="/analytics" className="visit-store-button admin-link">Analytics</Link>
          </>
        )}
        <Link to="/" className="visit-store-button">Visit Store</Link>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default MyAccount;
