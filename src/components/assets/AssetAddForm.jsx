import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../common/form.css';
import '../common/common.css';
import ConfirmationModal from '../common/ConfirmationModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssetAddForm = ({ onClose }) => {
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusOptions, setStatusOptions] = useState(['Ready', 'Needs Attention', 'Sold']); // Default options
  const navigate = useNavigate();

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
    const formData = new FormData(); // Using FormData to handle file upload

    // Append other asset data
    formData.append('name', assetData.name);
    formData.append('asset_sn', assetData.asset_sn);
    formData.append('description', assetData.description);
    formData.append('acquired_date', assetData.acquired_date);
    formData.append('asset_status', assetData.asset_status);
    formData.append('jwt', jwtToken);

    // Append the image file
    if (assetData.image) {
      formData.append('image', assetData.image);
    }

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const AddAssetUrl = `${baseUrl}/assets/asset_add`;

      const response = await fetch(AddAssetUrl, {
        method: 'POST',
        body: formData, // Sending FormData
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message || 'Asset added successfully');
        setShowConfirmation(true);
      } else {
        throw new Error(responseData.error || 'Failed to add asset');
      }
    } catch (error) {
      console.error('Failed to add asset:', error.message);
      setErrorMessage('Failed to add asset');
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    setAssetData({
      name: '',
      asset_sn: '',
      description: '',
      acquired_date: currentDate,
      image: null,
      asset_status: 'Ready'
    });
    setImagePreview(null);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    onClose(); // Close the modal
    navigate('/assets-view-all');
  };

  return (
    <div className="form-container">
      <h3>Add New Asset</h3>
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
        <label htmlFor="acquired_date">Acquired Date:</label>
        <input
          type="date"
          id="acquired_date"
          name="acquired_date"
          className="form-input"
          value={assetData.acquired_date}
          onChange={handleChange}
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
          <div className="image-preview">
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
      {showConfirmation && (
        <ConfirmationModal
          message="Do you want to add another asset?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default AssetAddForm;
