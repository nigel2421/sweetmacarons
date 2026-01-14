
import React from 'react';
import './DataDeletion.css';

const DataDeletion = () => {
  return (
    <div className="data-deletion-container">
      <h1>Data Deletion Instructions</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>How to Delete Your Data</h2>
      <p>We respect your right to control your personal data. If you wish to delete your account and all associated data from our systems, please follow the steps below:</p>
      
      <ol>
        <li><strong>Send an Email:</strong> Compose an email to our support team at <a href="mailto:lostresmacarons-support@example.com">lostresmacarons-support@example.com</a>.</li>
        <li><strong>Use the Subject Line:</strong> Please use the subject line "Account Deletion Request" to help us process your request quickly.</li>
        <li><strong>Include Your Details:</strong> In the body of the email, please include your full name and the email address associated with your account. This is to help us verify your identity.</li>
        <li><strong>Confirmation:</strong> We will send you a confirmation email once the deletion process is complete. This typically takes between 5-7 business days.</li>
      </ol>

      <h2>What Data is Deleted?</h2>
      <p>Upon receiving your request, we will permanently delete all of your personal information, including:</p>
      <ul>
        <li>Your account profile (name, email, etc.)</li>
        <li>Your order history</li>
        <li>Any reviews or comments you have posted</li>
      </ul>
      <p>Please note that some anonymized data may be retained for analytical purposes, but this data will not be linked to you in any way.</p>

      <h2>Contact Us</h2>
      <p>If you have any questions about our data deletion process, please contact us at <a href="mailto:lostresmacarons-support@example.com">lostresmacarons-support@example.com</a>.</p>
    </div>
  );
};

export default DataDeletion;
