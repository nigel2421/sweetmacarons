
import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Header = ({ cartCount, handleCartClick }) => {
  return (
    <header className="App-header">
      <img src="/images/logo.png" alt="Los Tres Macarons" className="logo" />
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/store">Store</Link></li>
          <li><Link to="/my-orders">My Orders</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </nav>
      <div className="cart-icon" onClick={handleCartClick} data-testid="cart-icon">
        <FiShoppingCart />
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </div>
    </header>
  );
};

export default Header;
