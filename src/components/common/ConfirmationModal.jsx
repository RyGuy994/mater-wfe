// src/components/common/ConfirmationModal.jsx
import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>
        <button onClick={onConfirm} className="standard-btn">Yes</button>
        <button onClick={onCancel} className="standard-btn">No</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
