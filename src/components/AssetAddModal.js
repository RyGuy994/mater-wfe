import React, { useEffect } from 'react';
import Modal from './Modal.js';
import AssetForm from './AssetAddForm.js';

const AssetAddModal = ({ isOpen, onAddAsset, onClose }) => {
  const handleAddAsset = (assetData) => {
    console.log("Adding asset:", assetData); // Log the asset data before adding
    onAddAsset(assetData);
    onClose(); // Close the modal after adding the asset
  };

  console.log("isOpen:", isOpen); // Log the value of isOpen

  // Log when the modal mounts and unmounts
  useEffect(() => {
    console.log(`Modal ${isOpen ? 'opened' : 'closed'}`);
    return () => {
      console.log('Modal unmounted');
    };
  }, [isOpen]);

  return (
    <>
      <button onClick={onClose}>Close Modal</button>
      {/* Render the modal based on the isOpen prop */}
      {isOpen ? (
        <Modal onClose={onClose}>
          <AssetForm onSubmit={handleAddAsset} />
        </Modal>
      ) : null}
    </>
  );
};

export default AssetAddModal;
