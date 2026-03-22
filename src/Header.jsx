import React from 'react';
import { FiShoppingCart, FiMenu, FiUser, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Header = ({ user, isAdmin, cart = [], toggleMenu, isMenuOpen, setIsCartVisible, closeMenu }) => {
  const safeCart = Array.isArray(cart) ? cart : [];
  const cartCount = safeCart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
          <Link to="/">
            <img src="/images/logo.jpeg" alt="Los Tres Macarons" className="logo" />
          </Link>
        </div>
        <div className="header-center">
          <Link to="/" className="header-title-link">
            <h1 className="header-title-text">Los Tres Macarons</h1>
          </Link>
        </div>
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
      <div className={`nav-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}></div>
      <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          <li><Link to="/flavor-explorer" onClick={closeMenu}>Flavor Explorer</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
          {isAdmin && <li><Link to="/dashboard" onClick={closeMenu} style={{ color: '#e75480', fontWeight: '700' }}>🛡️ Admin Console</Link></li>}
          {user ? (
            <li><Link to="/my-account" onClick={closeMenu}>My Account</Link></li>
          ) : (
            <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Header;
