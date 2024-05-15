import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file
import './1.css'; //Import the CSS file for standard
import materImage from './static/MATER.png'; // Import the image file

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Get the base URL from the environmental variable
      const baseUrl = process.env.REACT_APP_BASE_URL;
      // Construct the full URL for the signup endpoint
      const signupUrl = `${baseUrl}/auth/signup`;

      const response = await fetch(signupUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);

      if (response.ok) {
        // Redirect to the login page after successful signup
        navigate('/login');
      } else {
        throw new Error(responseData.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup failed:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h2 className="cool-text" data-text="MATER">
        MATER
      </h2>
      <img src={materImage} alt="MATER" className="center" />
      <h3>Signup</h3>
      <form onSubmit={handleSubmit}>
        {/* Input fields for username and password */}
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <br />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <br />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        <br />
        <button type="submit" className="standard-btn">
          Signup
        </button> {/* Use type="submit" to trigger form submission */}
      </form>
      {errorMessage && <div>{errorMessage}</div>}

      {/* Link to the login page */}
      <Link to="/login" className="standard-btn">
        Go to Login
      </Link>
    </div>
  );
};

export default Signup;
