import React, { useState, useEffect } from 'react';
import './AssetForm.css';
import '../common/common.css';

const AssetEditForm = ({ asset, onSubmit, onClose }) => {
  const [assetData, setAssetData] = useState(asset);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (asset.image) {
      setImagePreview(asset.image);
    }
  }, [asset]);

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
    onSubmit(assetData);
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
    </div>
  );
};

export default AssetEditForm;
