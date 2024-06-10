/* src/components/Settings.jsx */

import React, { useEffect, useState } from 'react';
import './settings.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newSetting, setNewSetting] = useState({ whatfor: 'service_status', value: '', globalsetting: false });
  const baseUrl = import.meta.env.VITE_BASE_URL; // Use your base URL

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingUrl = `${baseUrl}/settings/appsettings`;
        const jwtToken = localStorage.getItem('jwt'); // Retrieve JWT from local storage

        if (!jwtToken) {
          setError('JWT token is missing');
          return;
        }

        console.log('Fetching settings with JWT:', jwtToken);

        const response = await fetch(settingUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jwt: jwtToken // Include JWT token in the body
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          const errMessage = await response.json();
          setError(`Failed to fetch settings: ${errMessage.error}`);
        }
      } catch (err) {
        setError('An error occurred');
      }
    };

    fetchSettings();
  }, [baseUrl]);

  const handleToggle = async (settingId, currentValue) => {
    const newValue = currentValue === 'Yes' ? 'No' : 'Yes';
    try {
      const updateUrl = `${baseUrl}/settings/appsettings/update`;
      const response = await fetch(updateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: settingId,
          value: newValue
        }),
      });

      if (response.ok) {
        setSettings(prevSettings =>
          prevSettings.map(setting =>
            setting.id === settingId ? { ...setting, value: newValue } : setting
          )
        );
        toast.success('Setting updated successfully');
      } else {
        const errMessage = await response.json();
        setError(`Failed to update setting: ${errMessage.error}`);
        toast.error(`Failed to update setting: ${errMessage.error}`);
      }
    } catch (err) {
      setError('An error occurred');
      toast.error('An error occurred');
    }
  };

  const handleEdit = async (settingId) => {
    try {
      const updateUrl = `${baseUrl}/settings/appsettings/update`;
      const response = await fetch(updateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: settingId,
          value: editValue
        }),
      });

      if (response.ok) {
        setSettings(prevSettings =>
          prevSettings.map(setting =>
            setting.id === settingId ? { ...setting, value: editValue } : setting
          )
        );
        setEditMode(null);
        setEditValue('');
        toast.success('Setting updated successfully');
      } else {
        const errMessage = await response.json();
        setError(`Failed to update setting: ${errMessage.error}`);
        toast.error(`Failed to update setting: ${errMessage.error}`);
      }
    } catch (err) {
      setError('An error occurred');
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (settingId) => {
    try {
      const jwtToken = localStorage.getItem('jwt'); // Retrieve JWT from local storage
      const deleteUrl = `${baseUrl}/settings/appsettings/delete/${settingId}`;
      console.log('Sending delete request:', deleteUrl, jwtToken); // Add logging

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
      });

      if (response.ok) {
        setSettings(prevSettings => prevSettings.filter(setting => setting.id !== settingId));
        toast.success('Setting deleted successfully');
      } else {
        const errMessage = await response.json();
        setError(`Failed to delete setting: ${errMessage.error}`);
        toast.error(`Failed to delete setting: ${errMessage.error}`);
      }
    } catch (err) {
      setError('An error occurred');
      toast.error('An error occurred');
    }
  };

  const handleAddSetting = async (e) => {
    e.preventDefault();
    try {
      const jwtToken = localStorage.getItem('jwt'); // Retrieve JWT from local storage

      if (!jwtToken) {
        setError('JWT token is missing');
        toast.error('JWT token is missing');
        return;
      }

      const addUrl = `${baseUrl}/settings/appsettings/add`;
      console.log('Adding new setting with JWT:', jwtToken);

      const response = await fetch(addUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newSetting, jwt: jwtToken }),
      });

      if (response.ok) {
        const newAddedSetting = await response.json();
        setSettings([...settings, newAddedSetting]);
        setNewSetting({ whatfor: 'service_status', value: '', globalsetting: false });
        toast.success('Setting added successfully');
      } else {
        const errMessage = await response.json();
        setError(`Failed to add setting: ${errMessage.error}`);
        toast.error(`Failed to add setting: ${errMessage.error}`);
      }
    } catch (err) {
      setError('An error occurred');
      toast.error('An error occurred');
    }
  };

  return (
    <div className="scrollable-container">
      <h1>Settings Page</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleAddSetting} className="add-setting-form">
        <label>
          Setting Type:
          <select
            value={newSetting.whatfor}
            onChange={(e) => setNewSetting({ ...newSetting, whatfor: e.target.value })}
          >
            <option value="service_status">Service Status</option>
            <option value="service_type">Service Type</option>
            <option value="asset_status">Asset Status</option>
          </select>
        </label>
        <label>
          Value:
          <input
            type="text"
            value={newSetting.value}
            onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
          />
        </label>
        <label>
          Global:
          <input
            type="checkbox"
            checked={newSetting.globalsetting}
            onChange={(e) => setNewSetting({ ...newSetting, globalsetting: e.target.checked })}
          />
        </label>
        <button type="submit">Add Setting</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Setting</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {settings.map(setting => (
            <tr key={setting.id}>
              <td>{setting.whatfor}</td>
              <td>
                {editMode === setting.id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                ) : (
                  <span>
                    {['global_service_status', 'global_asset_status', 'global_service_type'].includes(setting.whatfor) ? (
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={setting.value === 'Yes'} 
                          onChange={() => handleToggle(setting.id, setting.value)} 
                        />
                        <span className="slider round"></span>
                      </label>
                    ) : (
                      setting.value
                    )}
                  </span>
                )}
              </td>
              <td>
                {['service_status', 'asset_status','service_type'].includes(setting.whatfor) && (
                  <>
                    {editMode === setting.id ? (
                      <>
                        <button onClick={() => handleEdit(setting.id)}>Save</button>
                        <button onClick={() => { setEditMode(null); setEditValue(''); }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditMode(setting.id); setEditValue(setting.value); }}>Edit</button>
                        <button onClick={() => handleDelete(setting.id)}>Delete</button>
                      </>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Settings;
