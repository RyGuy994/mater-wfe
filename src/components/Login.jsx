import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Login.css'; // Import the CSS file
import './1.css'; //Import the CSS file for standard
import materImage from './static/MATER.png'; // Import the image file

const Login = ({ handleLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get the base URL from the environmental variable
      const baseUrl = process.env.REACT_APP_BASE_URL;
      // Construct the full URL for the login endpoint
      const loginUrl = `${baseUrl}/auth/login`;

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

      const responseData = await response.json();
      console.log(responseData);

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
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error.message);
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div>
      <h2 className="cool-text" data-text="MATER">
        MATER
      </h2>
      <img src={materImage} alt="MATER" className="center" />
      <h3>
        Login
      </h3>
      <form onSubmit={handleSubmit}>
        {/* Input fields for username and password */}
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        /><br></br>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        /><br></br>
        <button type="submit" color="white" className="standard-btn">Login</button> {/* Use type="submit" to trigger form submission */}
      </form>
      {errorMessage && <div>{errorMessage}</div>}

        {/* Add Link for Signup */}
        <Link to="/signup" className="standard-btn">Signup</Link>
    </div>
  );
};

export default Login;
