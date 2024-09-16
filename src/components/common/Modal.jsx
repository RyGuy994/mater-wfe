import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AssetAddForm from '../assets/AssetAddForm.jsx';
import AssetEditForm from '../assets/AssetEditForm.jsx';
import ServiceAddForm from '../services/ServiceAddForm.jsx';

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

const GenericModal = ({ type, mode, item, onClose, onSubmit }) => {
  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h4" component="h2">
          {mode === 'edit'
            ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`
            : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </Typography>
        
        {/* Render the appropriate form based on the type and mode */}
        {type === 'asset' && mode === 'edit' && (
          <AssetEditForm asset={item} onSubmit={onSubmit} onClose={onClose} />
        )}
        {type === 'asset' && mode === 'add' && (
          <AssetAddForm onClose={onClose} onSubmit={onSubmit} />
        )}
        {type === 'service' && mode === 'add' && (
          <ServiceAddForm onClose={onClose} onSubmit={onSubmit} />
        )}
        
        <button className="standard-del-btn" onClick={onClose}>Close</button>
      </Box>
    </Modal>
  );
};

export default GenericModal;
