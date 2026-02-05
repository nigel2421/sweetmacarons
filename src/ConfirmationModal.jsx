
import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ show, onClose, onConfirm, title, message, additionalInfo, isOrderSuccess }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        {additionalInfo && (
          <div className="whatsapp-message-container">
            <pre>{additionalInfo}</pre>
          </div>
        )}
        <div className="modal-actions">
          {isOrderSuccess ? (
            <button onClick={onClose} className="confirm-button">Close</button>
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
