import React, { useState } from 'react';
import '../common/common.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      const resetUrl = `${baseUrl}/auth/reset_password/self`;  // Route for self-reset password
      const response = await fetch(resetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          jwt: jwtToken
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
        <br></br>
        <label>
          New Password: 
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <br></br>
        <label>
          Confirm New Password: 
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <br></br>
        <button className="standard-btn" type="submit">Update Password</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Profile;
