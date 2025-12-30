
import { NavLink } from 'react-router-dom';
import './AdminNav.css';

const AdminNav = () => {
  return (
    <nav className="admin-nav">
      <NavLink to="/orders" end>Orders</NavLink>
      <NavLink to="/analytics">Analytics</NavLink>
    </nav>
  );
};

export default AdminNav;
