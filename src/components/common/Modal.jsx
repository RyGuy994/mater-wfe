import React, { useEffect } from 'react';
import './Modal.css'; // Import the CSS file with modal styles

const Modal = ({ isOpen, onClose, children }) => {
  const modalStyle = {
    display: isOpen ? 'block' : 'none'
  };

  useEffect(() => {
    console.log(`Modal ${isOpen ? 'opened' : 'closed'}`);
    return () => {
      console.log('Modal unmounted');
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose(); // Call the onClose callback when the modal is closed
  };

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
