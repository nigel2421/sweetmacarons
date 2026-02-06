
import React from 'react';
import './LegalInfo.css';

const LegalInfo = () => {
  return (
    <div className="privacy-policy-container">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>Introduction</h2>
      <p>Los Tres Macarons ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>

      <h2>Information We Collect</h2>
      <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
      <ul>
        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.</li>
        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
      </ul>

      <h2>Use of Your Information</h2>
      <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
      <ul>
        <li>Create and manage your account.</li>
        <li>Process your transactions and send you related information, including purchase confirmations and invoices.</li>
        <li>Email you regarding your account or order.</li>
      </ul>

      <h2>Contact Us</h2>
      <p>If you have questions or comments about this Privacy Policy, please contact us at: lostresmacarons@example.com</p>
    </div>
  );
};

export default LegalInfo;
