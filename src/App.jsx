import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Home from './components/Home';
import Login from './components/auth/Login';
import AssetViewAll from './components/assets/AssetViewAll';
import Signup from './components/auth/Signup';
import ServiceViewAll from './components/services/ServiceViewAll';
import SettingsGlobal from './components/settings/SettingsGlobal';
import SettingsLocal from './components/settings/SettingsLocal';
import UsersManagement from './components/settings/SettingsUser';
import Profile from './components/settings/Profile';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check local storage for a JWT to maintain login state
    const token = localStorage.getItem('jwt');
    if (token) {
      // Validate token here if necessary, for now we'll just set the logged-in state
      setIsLoggedIn(true);
      setUsername(localStorage.getItem('username') || '');
    }
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    setError('');
    localStorage.setItem('username', username); // Store username in local storage
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
  };

  return (
    <Router>
      <div className="App">
        {/* Pass modal controls and authentication to Header */}
        <Header 
          isLoggedIn={isLoggedIn} 
          handleLogout={handleLogout} 
        />
        <Routes>
          <Route path="/home" element={isLoggedIn ? <Home username={username} /> : <Navigate to="/" />} />
          <Route path="/assets-view-all" element={<AssetViewAll />} />
          <Route path="/services-view-all" element={<ServiceViewAll />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} setError={setError} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/settings-global" element={isLoggedIn ? <SettingsGlobal /> : <Navigate to="/" />} />
          <Route path="/settings-local" element={isLoggedIn ? <SettingsLocal /> : <Navigate to="/" />} />
          <Route path="/settings-user" element={isLoggedIn ? <UsersManagement /> : <Navigate to="/" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
          <Route path="/" element={<Login handleLogin={handleLogin} setError={setError} />} />
        </Routes>
        {error && <div className="error">{error}</div>}
      </div>
    </Router>
  );
}

export default App;
