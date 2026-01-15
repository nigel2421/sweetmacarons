
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import './MyAccount.css';

const MyAccount = ({ onLogout }) => {
  const user = auth.currentUser;

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
        {/* Add other user details here if available */}
      </div>
      <div className="account-actions">
        <Link to="/my-orders" className="visit-store-button">My Orders</Link>
        <Link to="/" className="visit-store-button">Visit Store</Link>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default MyAccount;
