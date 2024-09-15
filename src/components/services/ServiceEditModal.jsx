import React, { useState, useEffect } from 'react';
import './Modal.css';

const ServiceEditModal = ({ service, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(service);

  useEffect(() => {
    setFormData(service);
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Edit Service</h4>
        <form onSubmit={handleSubmit}>
          <label>Asset Name:</label>
          <input type="text" name="asset_name" value={formData.asset_name} onChange={handleChange} required />
          <label>Service Type:</label>
          <input type="text" name="service_type" value={formData.service_type} onChange={handleChange} required />
          <label>Service Date:</label>
          <input type="date" name="service_date" value={formData.service_date} onChange={handleChange} required />
          <label>Service Cost:</label>
          <input type="number" name="service_cost" value={formData.service_cost} onChange={handleChange} required />
          <label>Service Status:</label>
          <input type="text" name="service_status" value={formData.service_status} onChange={handleChange} required />
          <div className="modal-actions">
            <button type="submit" className="standard-btn">Save</button>
            <button type="button" className="standard-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceEditModal;
