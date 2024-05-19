// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Home from './components/Home';
import Login from './components/auth/Login';
import AssetAddModal from './components/assets/AssetAddModal';
import AssetViewAll from './components/assets/AssetViewAll';
import Signup from './components/auth/Signup';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    setError('');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
  };

  const openAddAssetModal = () => {
    setModalOpen(true);
  };

  const closeAddAssetModal = () => {
    setModalOpen(false);
  };

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} openAddAssetModal={openAddAssetModal} />
        <Routes>
          <Route path="/home" element={isLoggedIn ? <Home username={username} /> : <Navigate to="/" />} />
          <Route path="/assets" element={<AssetAddModal onClose={closeAddAssetModal} />} />
          <Route path="/assets-view-all" element={<AssetViewAll />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} setError={setError} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login handleLogin={handleLogin} setError={setError} />} />
        </Routes>
        {isModalOpen && <AssetAddModal onClose={closeAddAssetModal} />}
        {error && <div className="error">{error}</div>}
      </div>
    </Router>
  );
}

export default App;
