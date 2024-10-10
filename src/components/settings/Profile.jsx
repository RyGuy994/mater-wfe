import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../common/common.css'

const Profile = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(
    localStorage.getItem('backgroundColor') || '#c9d3e2'
  );
  const [primaryColor, setPrimaryColor] = useState(
    localStorage.getItem('primaryColor') || '#4CAF50'
  );
  const [secondaryColor, setSecondaryColor] = useState(
    localStorage.getItem('secondaryColor') || '#ffffff'
  );
  const [isGradient, setIsGradient] = useState(
    JSON.parse(localStorage.getItem('isGradient')) || true
  );
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    try {
      const jwtToken = localStorage.getItem('jwt');
      if (!jwtToken) {
        toast.error('JWT token is missing');
        return;
      }
      const resetUrl = `${baseUrl}/auth/reset_password/self`;
      const response = await fetch(resetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          jwt: jwtToken,
        }),
      });

      if (response.ok) {
        toast.success('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const errMessage = await response.json();
        toast.error(`Failed to update password: ${errMessage.error}`);
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const handleBackgroundColorChange = (e) => {
    const newColor = e.target.value;
    setBackgroundColor(newColor);
    localStorage.setItem('backgroundColor', newColor);
  };

  const handlePrimaryColorChange = (e) => {
    const newColor = e.target.value;
    setPrimaryColor(newColor);
    localStorage.setItem('primaryColor', newColor);
    document.documentElement.style.setProperty('--primary-color', newColor);
  };

  const handleSecondaryColorChange = (e) => {
    const newColor = e.target.value;
    setSecondaryColor(newColor);
    localStorage.setItem('secondaryColor', newColor);
  };

  const toggleGradient = () => {
    const newGradientState = !isGradient;
    setIsGradient(newGradientState);
    localStorage.setItem('isGradient', newGradientState);
  };

  const resetToDefault = () => {
    const defaultBackgroundColor = '#c9d3e2';
    const defaultPrimaryColor = '#4CAF50';
    const defaultSecondaryColor = '#ffffff';
    const defaultIsGradient = true;

    setBackgroundColor(defaultBackgroundColor);
    setPrimaryColor(defaultPrimaryColor);
    setSecondaryColor(defaultSecondaryColor);
    setIsGradient(defaultIsGradient);

    localStorage.setItem('backgroundColor', defaultBackgroundColor);
    localStorage.setItem('primaryColor', defaultPrimaryColor);
    localStorage.setItem('secondaryColor', defaultSecondaryColor);
    localStorage.setItem('isGradient', JSON.stringify(defaultIsGradient));
    document.documentElement.style.setProperty('--primary-color', defaultPrimaryColor);

    toast.success('Background settings have been reset to default');
  };

  useEffect(() => {
    const backgroundStyle = isGradient
      ? `linear-gradient(135deg, ${secondaryColor} 0%, ${backgroundColor} 100%)`
      : backgroundColor;

    document.body.style.background = backgroundStyle;
    document.documentElement.style.setProperty('--primary-color', primaryColor);
  }, [backgroundColor, primaryColor, secondaryColor, isGradient]);

  return (
    <div className="profile-container">
      <h1>Reset Your Password</h1>
      <form onSubmit={handlePasswordChange} className="profile-form">
        <label>
          Current Password:
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Confirm New Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button className="standard-btn" type="submit">
          Update Password
        </button>
      </form>
      <br />
      <h2>Select Colors</h2>
      <label>
        Primary Color:
        <input
          type="color"
          value={primaryColor}
          onChange={handlePrimaryColorChange}
        />
      </label>
      <br />
      <label>
        Background Color:
        <input
          type="color"
          value={backgroundColor}
          onChange={handleBackgroundColorChange}
        />
      </label>
      <br />
      {isGradient && (
        <label>
          Secondary Gradient Color:
          <input
            type="color"
            value={secondaryColor}
            onChange={handleSecondaryColorChange}
          />
        </label>
      )}
      <br />
      <button className="standard-btn" onClick={toggleGradient}>
        {isGradient ? 'Switch to Solid Color' : 'Switch to Gradient'}
      </button>
      <button className="standard-reset-btn" onClick={resetToDefault}>
        Reset to Default
      </button>
      <ToastContainer />
    </div>
  );
};

export default Profile;
