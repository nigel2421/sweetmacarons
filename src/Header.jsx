
import React from 'react';
import { FiShoppingCart, FiMenu, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Header = ({ user, cart = [], toggleMenu, isMenuOpen, setIsCartVisible }) => {
  const safeCart = Array.isArray(cart) ? cart : [];
  const cartCount = safeCart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <FiMenu />
        </button>
        <Link to="/">
          <img src="/images/logo.png" alt="Los Tres Macarons" className="logo" />
        </Link>
      </div>
      <div className="header-center">
        <Link to="/" className="header-title-link">
          <h1 className="header-title-text">Los Tres Macarons</h1>
        </Link>
      </div>
      <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
          {user ? (
            <li className="mobile-only-nav-item"><Link to="/my-account" onClick={toggleMenu}>My Account</Link></li>
          ) : (
            <li className="mobile-only-nav-item"><Link to="/login" onClick={toggleMenu}>Login</Link></li>
          )}
        </ul>
      </nav>
      <div className="header-right">
        <div className="cart-icon-container" onClick={() => setIsCartVisible(true)} data-testid="cart-icon">
          <FiShoppingCart size={24} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
        <Link to="/my-account" className="user-icon-link" aria-label="My Account">
          <FiUser size={24} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
