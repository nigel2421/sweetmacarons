
import React from 'react';
import './TermsOfService.css';

const TermsOfService = () => {
  return (
    <div className="terms-of-service-container">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>Agreement to Terms</h2>
      <p>By using our website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

      <h2>Purchases and Payments</h2>
      <p>We accept various forms of payment, as specified during the checkout process. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site.</p>

      <h2>Intellectual Property</h2>
      <p>The content on our website, including text, graphics, logos, and images, is our property and is protected by copyright and other intellectual property laws.</p>

      <h2>Contact Us</h2>
      <p>If you have any questions about these Terms of Service, please contact us at: lostresmacarons@example.com</p>
    </div>
  );
};

export default TermsOfService;
