import React, { useState, useEffect } from 'react';
import './AssetForm.css';
import '../common/common.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssetEditForm = ({ asset, onSubmit, onClose }) => {
  const [assetData, setAssetData] = useState({
    name: '',
    asset_sn: '',
    description: '',
    acquired_date: '',
    asset_status: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (asset) {
      setAssetData({
        name: asset.name || '',
        asset_sn: asset.asset_sn || '',
        description: asset.description || '',
        acquired_date: asset.acquired_date || '',
        asset_status: asset.asset_status || 'Ready',
        image: asset.image_path || null,
      });
      if (asset.image_path) {
        setImagePreview(asset.image_path);
      }
    }
  }, [asset]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const file = e.target.files[0] || null;
      setAssetData({ ...assetData, image: file });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setAssetData({ ...assetData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const assetToSubmit = { ...assetData };

    // If there's a new image file, convert it to base64
    if (assetData.image && typeof assetData.image !== 'string') {
      const reader = new FileReader();
      reader.onloadend = async () => {
        assetToSubmit.image = reader.result.split(',')[1]; // Get the base64 string without the prefix
        await updateAsset(assetToSubmit);
      };
      reader.readAsDataURL(assetData.image);
    } else {
      await updateAsset(assetToSubmit);
    }
  };

  const updateAsset = async (assetToSubmit) => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const jwtToken = localStorage.getItem('jwt'); // Retrieve JWT from local storage

      // Include the JWT token in the request body
      const response = await fetch(`${baseUrl}/assets/asset_edit/${asset.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...assetToSubmit, jwt: jwtToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${result.error}`);
      }

      onSubmit(result);
      toast.success('Asset updated successfully!');
      // Optionally, delay the reload to give time for the toast to show
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error updating the asset:', error);
      toast.error('Failed to update asset. Please try again.');
    }
  };

  return (
    <div>
      <h3>Edit Asset</h3>
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
          required
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
        <button type="submit" className="standard-btn">Save</button>
        <button type="button" className="standard-btn" onClick={onClose}>Cancel</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AssetEditForm;
