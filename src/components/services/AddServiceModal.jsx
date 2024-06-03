// src/components/services/AddServiceModal.jsx
import React, { useState } from 'react';
import '../common/Modal.css';

const AddServiceModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [serviceStatus, setServiceStatus] = useState('');
  const [attachments, setAttachments] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    formData.append('service_status', serviceStatus);
    formData.append('jwt', localStorage.getItem('jwt'));
    if (attachments) {
      for (let i = 0; i < attachments.length; i++) {
        formData.append('attachments', attachments[i]);
      }
    }

    try {
      const response = await fetch('/service_add', {
        method: 'POST',
        body: formData,
        headers: {
          // No need to set 'Content-Type' header to 'multipart/form-data'
          // Fetch will automatically set the correct headers
        },
      });

      const data = await response.json();

      if (data.status_code === 200) {
        onClose();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('An error occurred while adding the service.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Add Service</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </label>
          <label>
            Start Date:
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </label>
          <label>
            End Date:
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </label>
          <label>
            Status:
            <input type="text" value={serviceStatus} onChange={(e) => setServiceStatus(e.target.value)} required />
          </label>
          <label>
            Attachments:
            <input type="file" onChange={(e) => setAttachments(e.target.files)} multiple />
          </label>
          <button type="submit">Add Service</button>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
