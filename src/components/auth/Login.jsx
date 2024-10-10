import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import '../common/common.css';
import materImage from '../static/MATER.png';

const Login = ({ handleLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showText, setShowText] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      if (!baseUrl) {
        throw new Error('VITE_BASE_URL is not defined');
      }
      const loginUrl = `${baseUrl}/auth/login`;

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        localStorage.setItem('jwt', responseData.jwt);
        handleLogin(formData.username);
        localStorage.setItem('username', formData.username);

        if (rememberMe) {
          localStorage.setItem('rememberedUser', formData.username);
        } else {
          localStorage.removeItem('rememberedUser');
        }

        navigate('/home');
      } else {
        throw new Error(responseData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error.message);
      toast.error('Invalid username or password');
    }
  };

  const materLetters = "MATER".split('');

  return (
    <div>
      <div className="background-word word-maintenance">Maintenance.</div>
      <div className="background-word word-asset">Asset.</div>
      <div className="background-word word-tracking">Tracking.</div>
      <div className="background-word word-equipment">Equipment.</div>
      <div className="background-word word-registry">Registry.</div>

      <div className="login">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        <h2 className="cool-text">
          {materLetters.map((letter, index) => (
            <span className="letter" key={index}>{letter}</span>
          ))}
        </h2>
        <div className="cool-text-subtitle">
          <span className="word">Maintenance. </span>
          <span className="word">Asset. </span>
          <span className="word">Tracking. </span>
          <span className="word">Equipment. </span>
          <span className="word">Registry.</span>
        </div>
        <img src={materImage} alt="MATER" className="center" />
        <h3>Login</h3>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="login-input"
          /><br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="login-input"
          /><br />
          <div className="remember-me-container">
            <label className="switch">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <span className="slider"></span>
            </label>
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          <button type="submit" className="standard-btn">Login</button>
        </form>
        <Link to="/signup" className="standard-btn signup-btn">Signup</Link>
      </div>
    </div>
  );
};

export default Login;
