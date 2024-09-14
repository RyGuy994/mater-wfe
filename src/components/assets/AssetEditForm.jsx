import React, { useState, useEffect } from 'react';
import '../common/form.css'; // Use form.css for styling
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
  const [statusOptions, setStatusOptions] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (asset) {
      setAssetData({
        name: asset.name || '',
        asset_sn: asset.asset_sn || '',
        description: asset.description || '',
        acquired_date: asset.acquired_date || '',
        asset_status: asset.asset_status || 'Ready',
        image: null,
      });

      if (asset.image_path) {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        setImagePreview(`${baseUrl}/static/assets/${asset.id}/image/${asset.image_path.split('/').pop()}`);
      }
    }
  }, [asset]);

  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const jwtToken = localStorage.getItem('jwt'); // Retrieve JWT from local storage
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const statusUrl = `${baseUrl}/settings/appsettings/assets/status`;

        const response = await fetch(statusUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jwt: jwtToken }),
        });

        if (response.ok) {
          const data = await response.json();
          setStatusOptions(data.map(setting => setting.value));
        } else {
          const errMessage = await response.json();
          setErrorMessage(`Failed to fetch status options: ${errMessage.error}`);
          toast.error(`Failed to fetch status options: ${errMessage.error}`);
        }
      } catch (err) {
        setErrorMessage('An error occurred while fetching status options');
        toast.error('An error occurred while fetching status options');
      }
    };

    fetchStatusOptions();
  }, []);

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

    const jwtToken = localStorage.getItem('jwt');

    const formData = new FormData();
    formData.append('name', assetData.name);
    formData.append('asset_sn', assetData.asset_sn);
    formData.append('description', assetData.description);
    formData.append('acquired_date', assetData.acquired_date);
    formData.append('asset_status', assetData.asset_status);
    formData.append('jwt', jwtToken);

    if (assetData.image) {
      formData.append('image', assetData.image);
    }

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const EditAssetUrl = `${baseUrl}/assets/asset_edit/${asset.id}`;

      const response = await fetch(EditAssetUrl, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message || 'Asset updated successfully');
        onSubmit();
      } else {
        throw new Error(responseData.error || 'Failed to update asset');
      }
    } catch (error) {
      console.error('Failed to update asset:', error.message);
      setErrorMessage('Failed to update asset');
    }
  };

  return (
    <div className="form-container">
      <h3>Edit Asset</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" className="required-field">Asset Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-input"
          placeholder="Asset Name"
          value={assetData.name}
          onChange={handleChange}
          required
        /><br />
        <label htmlFor="asset_sn" className="required-field">Asset Serial Number:</label>
        <input
          type="text"
          id="asset_sn"
          name="asset_sn"
          className="form-input"
          placeholder="Asset Serial Number"
          value={assetData.asset_sn}
          onChange={handleChange}
          required
        /><br />
        <label htmlFor="description">Asset Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          className="form-input"
          placeholder="Asset Description"
          value={assetData.description}
          onChange={handleChange}
        /><br />
        <label htmlFor="acquired_date" className="required-field">Acquired Date:</label>
        <input
          type="date"
          id="acquired_date"
          name="acquired_date"
          className="form-input"
          value={assetData.acquired_date}
          onChange={handleChange}
          required
        /><br />
        <label htmlFor="asset_status" className="required-field">Asset Status:</label>
        <select
          id="asset_status"
          name="asset_status"
          className="form-input"
          value={assetData.asset_status}
          onChange={handleChange}
          required
        >
          {statusOptions.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select><br />
        <label htmlFor="image">Asset Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          className="form-input"
          onChange={handleChange}
          accept="image/*"
        /><br />
        {imagePreview && (
          <div id="image-preview" className="image-preview">
            <img
              src={imagePreview}
              alt="Image Preview"
              style={{ maxWidth: '200px', maxHeight: '200px', border: '3px solid green', marginBottom: '10px' }}
            />
          </div>
        )}
        <button type="submit" className="standard-btn">Save</button>
        <button type="button" className="standard-del-btn" onClick={onClose}>Cancel</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <ToastContainer />
    </div>
  );
};

export default AssetEditForm;
