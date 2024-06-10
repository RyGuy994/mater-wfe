/* src/components/common/Modal.jsx */

// Import React library
import React, { useEffect } from 'react';

// Import CSS file with modal styles
import './Modal.css';

// Modal component
const Modal = ({ isOpen, onClose, children }) => {
  // Inline style to control modal display
  const modalStyle = {
    display: isOpen ? 'block' : 'none' // Show modal if isOpen is true, otherwise hide it
  };

  // Effect hook to log modal status
  useEffect(() => {
    console.log(`Modal ${isOpen ? 'opened' : 'closed'}`); // Log whether modal is opened or closed
    return () => {
      console.log('Modal unmounted'); // Log when modal is unmounted
    };
  }, [isOpen]); // Run effect only when isOpen changes

  // Function to handle modal close
  const handleClose = () => {
    onClose(); // Call the onClose callback when the modal is closed
  };

  // JSX for modal component
  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content">
        {/* Close button */}
        <span className="close" onClick={handleClose}>&times;</span>
        {/* Render children */}
        {children}
      </div>
    </div>
  );
};

// Export the Modal component
export default Modal;
