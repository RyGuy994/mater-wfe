import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Home from './components/Home';
import Login from './components/auth/Login';
import AssetAddModal from './components/hold-over/AssetAddModal';
import AssetViewAll from './components/assets/AssetViewAll';
import Signup from './components/auth/Signup';
import ServiceAddModal from './components/hold-over/ServiceAddModal';
import ServiceViewAll from './components/services/ServiceViewAll';
import Settings from './components/settings/Settings';
import './App.css';

function App() {
  // State variables for managing authentication and modals
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isAssetModalOpen, setAssetModalOpen] = useState(false);
  const [isServiceModalOpen, setServiceModalOpen] = useState(false);

  // Function to handle user login
  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    setError('');
  };

  // Function to handle user logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
  };

  // Function to open the asset add modal
  const openAddAssetModal = () => {
    setAssetModalOpen(true);
  };

  // Function to close the asset add modal
  const closeAddAssetModal = () => {
    setAssetModalOpen(false);
  };

  // Function to open the service add modal
  const openAddServiceModal = () => {
    setServiceModalOpen(true);
  };

  // Function to close the service add modal
  const closeAddServiceModal = () => {
    setServiceModalOpen(false);
  };

  return (
    <Router>
      <div className="App">
        {/* Header component with authentication and modal controls */}
        <Header 
          isLoggedIn={isLoggedIn} 
          handleLogout={handleLogout} 
          openAddAssetModal={openAddAssetModal} 
          openAddServiceModal={openAddServiceModal} 
        />
        <Routes>
          {/* Routes for different pages */}
          <Route path="/home" element={isLoggedIn ? <Home username={username} /> : <Navigate to="/" />} />
          <Route path="/assets" element={<AssetAddModal onClose={closeAddAssetModal} />} />
          <Route path="/assets-view-all" element={<AssetViewAll />} />
          <Route path="/services-view-all" element={<ServiceViewAll />} /> {/* Add this line */}
          <Route path="/login" element={<Login handleLogin={handleLogin} setError={setError} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/" />} />
          <Route path="/" element={<Login handleLogin={handleLogin} setError={setError} />} />
        </Routes>
        {/* Modals for adding assets and services */}
        {isAssetModalOpen && <AssetAddModal onClose={closeAddAssetModal} />}
        {isServiceModalOpen && <ServiceAddModal onClose={closeAddServiceModal} />} 
        {/* Display error messages */}
        {error && <div className="error">{error}</div>}
      </div>
    </Router>
  );
}

export default App;
