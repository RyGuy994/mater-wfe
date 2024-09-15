// src/components/services/ServiceAddModal.jsx

// Import React library
import React from 'react';

// Import Material-UI components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

// Import ServiceAddForm component
import ServiceAddForm from '../services/ServiceAddForm.jsx';

// Style for the modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// ServiceAddModal component
const ServiceAddModal = ({ onClose }) => {
  return (
    // Modal component with Material-UI
    <Modal
      open={true} // Always open the modal
      onClose={onClose} // onClose event handler
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {/* Modal title */}
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Service
        </Typography>
        {/* ServiceAddForm component for adding a new service */}
        <ServiceAddForm onClose={onClose} />
        {/* Close button */}
        <Button className="standard-btn" onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  );
};

// Export the ServiceAddModal component
export default ServiceAddModal;