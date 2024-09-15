import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../common/form.css';
import '../common/common.css';
import ConfirmationModal from '../common/ConfirmationModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ServiceAddForm = ({ onClose }) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusOptions, setStatusOptions] = useState([]);
  const [serviceTypeOptions, setServiceTypeOptions] = useState([]);
  const [serviceData, setServiceData] = useState({
    asset_id: '',
    service_type: '',
    service_date: currentDate,
    service_cost: '',
    service_status: '',
    service_notes: '',
    service_add_again_check: false,
    service_add_again_days_cal: '',
    attachments: null,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [attachmentsPreview, setAttachmentsPreview] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  // Fetch status options
  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const jwtToken = localStorage.getItem('jwt');
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const statusUrl = `${baseUrl}/settings/appsettings/services/status`;

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

  // Fetch service type options
  useEffect(() => {
    const fetchServiceTypeOptions = async () => {
      try {
        const jwtToken = localStorage.getItem('jwt');
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const serviceTypeUrl = `${baseUrl}/settings/appsettings/services/type`;

        const response = await fetch(serviceTypeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jwt: jwtToken }),
        });

        if (response.ok) {
          const data = await response.json();
          setServiceTypeOptions(data.map(setting => setting.value));
        } else {
          const errMessage = await response.json();
          setErrorMessage(`Failed to fetch service type options: ${errMessage.error}`);
          toast.error(`Failed to fetch service type options: ${errMessage.error}`);
        }
      } catch (err) {
        setErrorMessage('An error occurred while fetching service type options');
        toast.error('An error occurred while fetching service type options');
      }
    };

    fetchServiceTypeOptions();
  }, []);

  // Fetch assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const jwtToken = localStorage.getItem('jwt');
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/assets/asset_all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jwt: jwtToken }),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error('Error fetching assets:', errorResponse);
          return;
        }

        const assetsData = await response.json();
        setAssets(assetsData);
        setFilteredAssets(assetsData);
      } catch (error) {
        console.error('Error during fetch operation:', error);
      }
    };
    fetchAssets();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'file' ? e.target.files : (type === 'checkbox' ? checked : value);
    setServiceData({ ...serviceData, [name]: newValue });

    if (type === 'file') {
      const files = Array.from(e.target.files);
      const previews = files.map(file => URL.createObjectURL(file));
      setAttachmentsPreview(previews);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = assets.filter(asset => asset.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredAssets(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jwtToken = localStorage.getItem('jwt');
    const formData = new FormData();

    for (const key in serviceData) {
      if (key !== 'attachments') {
        formData.append(key, serviceData[key]);
      }
    }
    formData.append('jwt', jwtToken);

    if (serviceData.attachments) {
      Array.from(serviceData.attachments).forEach(file => {
        formData.append('attachments', file);
      });
    }

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const AddServiceUrl = `${baseUrl}/services/service_add`;

      const response = await fetch(AddServiceUrl, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message || 'Service added successfully');
        setShowConfirmation(true);
      } else {
        throw new Error(responseData.error || 'Failed to add service');
      }
    } catch (error) {
      console.error('Failed to add service:', error.message);
      setErrorMessage('Failed to add service');
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    setServiceData({
      asset_id: '',
      service_type: '',
      service_date: currentDate,
      service_cost: '',
      service_status: '',
      service_notes: '',
      service_add_again_check: false,
      service_add_again_days_cal: '',
      attachments: null,
    });
    setAttachmentsPreview([]);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    onClose();
    navigate('/services-view-all');
  };

  const addDaysToDate = (addDays) => {
    const today = new Date();
    const newDate = new Date(today.setDate(today.getDate() + addDays));
    const formattedDate = newDate.toISOString().split('T')[0];
    setServiceData({ ...serviceData, service_add_again_days_cal: formattedDate });
  };

  const handleAssetSelect = (assetId) => {
    setServiceData({ ...serviceData, asset_id: assetId });
    const selectedAsset = assets.find(asset => asset.id === assetId);
    setSearchTerm(selectedAsset ? selectedAsset.name : '');
    setFilteredAssets([]);
  };

  return (
    <div className="form-container">
      <h3>Add New Service</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="asset_id" className="required-field">Asset Name:</label>
        <input
          type="text"
          id="asset_search"
          name="asset_search"
          className="form-input"
          placeholder="Search Asset Name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && filteredAssets.length > 0 && (
          <ul className="asset-dropdown-list">
            {filteredAssets.map(asset => (
              <li
                key={asset.id}
                className="asset-dropdown-list-item"
                onClick={() => handleAssetSelect(asset.id)}
              >
                {asset.name}
              </li>
            ))}
          </ul>
        )}
        <br />
        <label htmlFor="service_type" className="required-field">Service Type:</label>
        <select
          id="service_type"
          name="service_type"
          className="form-input"
          value={serviceData.service_type}
          onChange={handleChange}
          required
        >
          <option value="">Select Service Type</option>
          {serviceTypeOptions.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select><br />
        <label htmlFor="service_date" className="required-field">Service Date:</label>
        <input
          type="date"
          id="service_date"
          name="service_date"
          className="form-input"
          value={serviceData.service_date}
          onChange={handleChange}
          required
        /><br />
        <label htmlFor="service_cost">Service Cost:</label>
        <input
          type="number"
          id="service_cost"
          name="service_cost"
          className="form-input"
          value={serviceData.service_cost}
          onChange={handleChange}
        /><br />
        <label htmlFor="service_status" className="required-field">Service Status:</label>
        <select
          id="service_status"
          name="service_status"
          className="form-input"
          value={serviceData.service_status}
          onChange={handleChange}
          required
        >
          <option value="">Select Service Status</option>
          {statusOptions.map((status, index) => (
            <option key={index} value={status}>{status}</option>
          ))}
        </select><br />
        <label htmlFor="service_notes">Service Notes:</label>
        <textarea
          id="service_notes"
          name="service_notes"
          className="form-input"
          value={serviceData.service_notes}
          onChange={handleChange}
        ></textarea><br />
        <label htmlFor="attachments">Upload attachments to service:</label>
        <input
          type="file"
          id="attachments"
          name="attachments"
          className="form-input"
          multiple
          onChange={handleChange}
        /><br />
        <div className="attachments-preview">
          {attachmentsPreview.map((preview, index) => (
            <img key={index} src={preview} alt={`Attachment Preview ${index + 1}`} />
          ))}
        </div>
        <button type="submit" className="standard-btn">Add Service</button>
        <button type="button" className="standard-del-btn" onClick={onClose}>Cancel</button>
      </form>
      {showConfirmation && (
        <ConfirmationModal
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          message="Service added successfully. Do you want to add another service?"
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default ServiceAddForm;
