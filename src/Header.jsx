
import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';

const Header = ({ cartCount, handleCartClick }) => {
  return (
    <header className="App-header">
      <img src="/images/logo.png" alt="Los Tres Macarons" className="logo" />
      <div className="cart-icon" onClick={handleCartClick} data-testid="cart-icon">
        <FiShoppingCart />
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </div>
    </header>
  );
};

export default Header;
