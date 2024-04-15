import React, { useState } from 'react';
import './AssetForm.css';
import './1.css';

// AssetForm component responsible for rendering the form to add assets
const AssetForm = ({ onSubmit }) => {
  const [assetData, setAssetData] = useState({ // State to hold asset data
    name: '', // Asset name
    asset_sn: '', // Asset serial number
    description: '', // Asset description
    acquired_date: '', // Asset acquisition date
    asset_type: '', // Asset type
    asset_status: '', // Asset status
    asset_number_tracker: '', // Asset number tracker
  });

  // Function to handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData({ ...assetData, [name]: value }); // Update the corresponding state value
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(assetData); // Pass the asset data to the onSubmit function
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input field for asset name */}
      <input
        type="text"
        name="name"
        placeholder="Asset Name"
        value={assetData.name}
        onChange={handleChange}
        required
      />
      {/* Input field for asset serial number */}
      <input
        type="text"
        name="asset_sn"
        placeholder="Asset Serial Number"
        value={assetData.asset_sn}
        onChange={handleChange}
        required
      />
      {/* Input field for asset description */}
      <input
        type="text"
        name="description"
        placeholder="Asset Description"
        value={assetData.description}
        onChange={handleChange}
      />
      {/* Input field for asset acquisition date */}
      <input
        type="date"
        name="acquired_date"
        placeholder="Acquired Date"
        value={assetData.acquired_date}
        onChange={handleChange}
      />
      {/* Input field for asset type */}
      <input
        type="text"
        name="asset_type"
        placeholder="Asset Type"
        value={assetData.asset_type}
        onChange={handleChange}
      />
      {/* Input field for asset status */}
      <input
        type="text"
        name="asset_status"
        placeholder="Asset Status"
        value={assetData.asset_status}
        onChange={handleChange}
      />
      {/* Input field for asset number tracker */}
      <input
        type="number"
        name="asset_number_tracker"
        placeholder="Asset Number Tracker"
        value={assetData.asset_number_tracker}
        onChange={handleChange}
      />
      {/* Button to submit the form */}
      <button className="standard-btn" type="submit">Submit</button>
    </form>
  );
};

export default AssetForm;
