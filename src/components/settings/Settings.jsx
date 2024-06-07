import React, { useEffect, useState } from 'react';
import './settings.css';
import '../common/common.css'

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [error, setError] = useState('');
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

  return (
    <div>
      <h1>Settings Page</h1>
      {error && <div className="error">{error}</div>}
      <table className= "standard-table">
        <thead>
          <tr>
            <th>Setting</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {settings.map(setting => (
            <tr key={setting.id}>
              <td>{setting.whatfor}</td>
              <td>
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
                  <span>{setting.value} (Global: {setting.globalsetting ? 'Yes' : 'No'})</span>
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
