import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AssetForm.css';
import '../1.css';

const AddAssetForm = () => {
  const [assetData, setAssetData] = useState({
    name: '',
    asset_sn: '',
    description: '',
    acquired_date: '',
    image: null, // Add image property to state
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // For file inputs, access the files property
    const newValue = type === 'file' ? e.target.files[0] : value;
    setAssetData({ ...assetData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      for (const key in assetData) {
        formData.append(key, assetData[key]);
      }

      // Send form data using fetch API
      const response = await fetch('/assets/asset_add', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Asset added successfully:', responseData.message);
        navigate('/view-assets');
      } else {
        throw new Error(responseData.error || 'Failed to add asset');
      }
    } catch (error) {
      console.error('Failed to add asset:', error.message);
      setErrorMessage('Failed to add asset');
    }
  };

  return (
    <div>
      <h3>Add New Asset</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Asset Name"
          value={assetData.name}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="asset_sn"
          placeholder="Asset Serial Number"
          value={assetData.asset_sn}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="description"
          placeholder="Asset Description"
          value={assetData.description}
          onChange={handleChange}
        /><br />
        <input
          type="date"
          name="acquired_date"
          placeholder="Acquired Date"
          value={assetData.acquired_date}
          onChange={handleChange}
        /><br />
        {/* Add input for image upload */}
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*" // Allow only image files
        /><br />
        <button type="submit" className="standard-btn">Submit</button>
      </form>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default AddAssetForm;
