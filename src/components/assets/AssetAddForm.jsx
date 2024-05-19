import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AssetForm.css';
import '../common/common.css';

const AddAssetForm = () => {
  const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  const [assetData, setAssetData] = useState({
    name: '',
    asset_sn: '',
    description: '',
    acquired_date: currentDate, // Set acquired_date to today's date
    image: null,
    asset_status: 'Ready'
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'file' ? (e.target.files[0] || null) : value;
    setAssetData({ ...assetData, [name]: newValue });

    if (type === 'file') {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(e.target.files[0]);
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jwtToken = localStorage.getItem('jwt'); // Retrieve JWT from local storage
    const requestData = { ...assetData, jwt: jwtToken }; // Include JWT in request body

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const AddAssetUrl = `${baseUrl}/assets/asset_add`;

      const response = await fetch(AddAssetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.message) {
          console.log('Asset added successfully:', responseData.message);
        } else {
          console.log('Asset added successfully');
        }
        const addAnother = window.confirm('Do you want to add another asset?');
        if (addAnother) {
          setAssetData({
            name: '',
            asset_sn: '',
            description: '',
            acquired_date: currentDate,
            image: null,
            asset_status: 'Ready'
          });
          setImagePreview(null);
        } else {
          navigate('/assets-view-all');
        }
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
      <label htmlFor="asset_status">Asset Status:</label>
      <br />
      <select
        name="asset_status"
        value={assetData.asset_status}
        onChange={handleChange}
        required
      >
        <option value="Ready">Ready</option>
        <option value="Needs Attention">Needs Attention</option>
        <option value="Sold">Sold</option>
      </select><br />
      <label htmlFor="image">Asset Image:</label>
      <input
        type="file"
        name="image"
        className="standard-btn"
        onChange={handleChange}
        accept="image/*"
      /><br />
      {imagePreview && (
        <div id="image-preview">
          <img 
            src={imagePreview} 
            alt="Image Preview" 
            style={{ maxWidth: '200px', maxHeight: '200px', border: '3px solid green', marginBottom: '10px' }} 
          />
          </div>
        )}
        <button type="submit" className="standard-btn">Submit</button>
      </form>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
  
};

export default AddAssetForm;
