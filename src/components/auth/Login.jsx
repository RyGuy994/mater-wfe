// src/components/auth/Login.jsx

// Import necessary modules and components
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Navigation hook for React Router
import { Link } from 'react-router-dom'; // Link component for React Router
import './Login.css'; // Import the CSS file for this component
import '../common/common.css'; // Import the CSS file for standard styles
import materImage from '../static/MATER.png'; // Import the image file

// Functional component for the login form
const Login = ({ handleLogin }) => {
  // State variables
  const [formData, setFormData] = useState({ username: '', password: '' }); // Form data
  const [errorMessage, setErrorMessage] = useState(''); // Error message
  const navigate = useNavigate(); // Navigation function from React Router

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get the base URL from the environmental variable
      const baseUrl = import.meta.env.VITE_BASE_URL;
      console.log('VITE_BASE_URL:', baseUrl); // Log base URL for debugging
      if (!baseUrl) {
        throw new Error('VITE_BASE_URL is not defined');
      }

      // Construct the full URL for the login endpoint
      const loginUrl = `${baseUrl}/auth/login`;

      // Make POST request to login endpoint
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      // Parse response JSON
      const responseData = await response.json();
      console.log(responseData); // Log response data for debugging

      if (response.ok) {
        // Store JWT token in local storage
        localStorage.setItem('jwt', responseData.jwt);
        
        // Call the handleLogin function passed from the parent component
        handleLogin(formData.username);
        
        // Set username in local storage
        localStorage.setItem('username', formData.username);
        
        // Redirect to the home page
        navigate('/home');
      } else {
        throw new Error(responseData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error.message); // Log error message
      setErrorMessage('Invalid username or password'); // Set error message
    }
  };

  // JSX for the login form
  return (
    <div>
      {/* Header */}
      <h2 className="cool-text" data-text="MATER">
        MATER
      </h2>
      {/* Logo */}
      <img src={materImage} alt="MATER" className="center" />
      {/* Login form */}
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        {/* Username input */}
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        /><br />
        {/* Password input */}
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        /><br />
        {/* Submit button */}
        <button type="submit" className="standard-btn">Login</button>
      </form>
      {/* Error message display */}
      {errorMessage && <div>{errorMessage}</div>}
      {/* Link to Signup page */}
      <Link to="/signup" className="standard-btn">Signup</Link>
    </div>
  );
};

// Export the Login component
export default Login;
