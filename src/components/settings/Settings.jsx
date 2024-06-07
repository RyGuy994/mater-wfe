import React, { useEffect, useState } from 'react';
import './settings.css';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editValue, setEditValue] = useState('');
  const baseUrl = import.meta.env.VITE_BASE_URL; // Use your base URL

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingUrl = `${baseUrl}/settings/appsettings`;
        const jwtToken = localStorage.getItem('jwt'); // Retrieve JWT from local storage

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
          setError('Failed to fetch settings');
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
      } else {
        setError('Failed to update setting');
      }
    } catch (err) {
      setError('An error occurred');
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
      } else {
        setError('Failed to update setting');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handleDelete = async (settingId) => {
    try {
      const deleteUrl = `${baseUrl}/settings/appsettings/delete`;
      const response = await fetch(deleteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: settingId }),
      });

      if (response.ok) {
        setSettings(prevSettings => prevSettings.filter(setting => setting.id !== settingId));
      } else {
        setError('Failed to delete setting');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div>
      <h1>Settings Page</h1>
      {error && <div className="error">{error}</div>}
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
                    {['global_service_status', 'global_asset_status'].includes(setting.whatfor) ? (
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
                {['service_status', 'asset_status'].includes(setting.whatfor) && (
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
    </div>
  );
};

export default Settings;
