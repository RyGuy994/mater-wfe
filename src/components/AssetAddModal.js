// AssetAddModal.js
import React, { useState } from 'react';
import Modal from './Modal.js'; // Import Modal component
import AssetForm from './AssetAddForm.js'; // Import updated Asset_AddForm component

const AssetAddModal = ({ onAddAsset }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddAsset = (assetData) => {
    // Call the onAddAsset function passed from the parent component
    onAddAsset(assetData);
    // Close the modal after adding the asset
    closeModal();
  };

  return (
    <>
      <button onClick={openModal}>Add Asset</button>
      {isOpen && (
        <Modal onClose={closeModal}>
          {/* Render the Asset_AddForm component with the onSubmit handler */}
          <AssetForm onSubmit={handleAddAsset} />
        </Modal>
      )}
    </>
  );
};

export default AssetAddModal;
