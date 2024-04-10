// Modal.js
import React from 'react';
import './Modal.css'; // Import the CSS file with modal styles

// Modal component responsible for rendering a modal window
const Modal = ({ onClose, children }) => {
  return (
    <div className="modal"> {/* Main container for the modal */}
      <div className="modal-content"> {/* Content area of the modal */}
        {/* Close button (X) to close the modal */}
        <span className="close" onClick={onClose}>&times;</span>
        {/* Children elements passed to the modal */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
