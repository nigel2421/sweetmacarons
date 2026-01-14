
import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2 className="logo-text">Los Tres Macarons</h2>
          <p>
            Deliciously handcrafted macarons made with love and the finest
            ingredients. Perfect for any occasion.
          </p>
        </div>
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </ul>
        </div>
        <div className="footer-section social">
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a href="https://www.facebook.com/profile.php?id=100090266093209" target="_blank" rel="noopener noreferrer"><FiFacebook /></a>
            <a href="https://www.instagram.com/lostresmacaronske/" target="_blank" rel="noopener noreferrer"><FiInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Los Tres Macarons. All Rights Reserved. | <Link to="/disclaimer">Disclaimer</Link> | <Link to="/privacy-policy">Privacy Policy</Link> | <Link to="/terms-of-service">Terms of Service</Link> | <Link to="/data-deletion">Data Deletion</Link>
      </div>
    </footer>
  );
};

export default Footer;
