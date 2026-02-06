
import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import './ConfirmationModal.css';

const ConfirmationModal = ({ show, onClose, onConfirm, title, message, additionalInfo, isOrderSuccess }) => {

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content confirmation-modal">
        {isOrderSuccess && (
          <div className="success-icon">
            <FiCheckCircle size={60} color="#4CAF50" />
          </div>
        )}
        <h2>{title}</h2>
        <p className="modal-message">{message}</p>

        {additionalInfo && (
          <>
            <div className="message-section">
              <h3>📱 Message to Share on WhatsApp:</h3>
              <div className="whatsapp-message-container">
                <pre>{additionalInfo}</pre>
              </div>
            </div>

            <div className="mpesa-reminder">
              <h3>💳 Important Reminder:</h3>
              <p className="reminder-text">
                After making your M-Pesa payment, please <strong>share the M-Pesa confirmation message</strong> on the same WhatsApp chat to complete your order.
              </p>
              <div className="reminder-steps">
                <p>✓ Copy the message above</p>
                <p>✓ Send it via WhatsApp</p>
                <p>✓ Share your M-Pesa confirmation</p>
              </div>
            </div>
          </>
        )}

        <div className="modal-actions">
          {isOrderSuccess ? (
            <button onClick={onClose} className="confirm-button">Got it!</button>
          ) : (
            <>
              <button onClick={onClose} className="cancel-button">Cancel</button>
              <button onClick={onConfirm} className="confirm-button">Confirm</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
