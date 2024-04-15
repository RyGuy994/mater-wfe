import React, { useEffect } from 'react';
import './Modal.css'; // Import the CSS file with modal styles

// Modal component responsible for rendering a modal window
const Modal = ({ isOpen, onClose, children }) => {
  // Conditionally apply the display style based on the isOpen prop
  const modalStyle = {
    display: isOpen ? 'block' : 'none'
  };

  // Log the value of isOpen prop whenever the component renders
  console.log("isOpen:", isOpen);

  // Log when the modal mounts and unmounts
  useEffect(() => {
    console.log(`Modal ${isOpen ? 'opened' : 'closed'}`);
    return () => {
      console.log('Modal unmounted');
    };
  }, [isOpen]);

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
