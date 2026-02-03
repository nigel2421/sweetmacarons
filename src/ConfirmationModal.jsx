
import React from 'react';
import { FiX } from 'react-icons/fi';

const ConfirmationModal = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <div className="confirmation-modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="confirmation-modal-close" aria-label="Close">
            <FiX size={18} style={{ strokeWidth: '4' }} />
            <span>CLOSE</span>
          </button>
        </div>
        <div className="confirmation-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirmation-modal-footer">
          <button onClick={onClose} className="confirmation-modal-cancel">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirmation-modal-confirm">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
