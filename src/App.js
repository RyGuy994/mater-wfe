import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import AssetAddModal from './components/AssetAddModal';
import Signup from './components/Signup';
import './App.css';

function App() {
  // State variables for managing user authentication and error messages
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);

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

  // Function to open the Add Asset modal
  const openAddAssetModal = () => {
    setIsAddAssetModalOpen(true);
  };

  // Function to close the Add Asset modal
  const closeAddAssetModal = () => {
    setIsAddAssetModalOpen(false);
  };

  return (
    <Router>
      <div className="App">
        {/* Render the application header */}
        <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} handleLogin={handleLogin} openAddAssetModal={openAddAssetModal} />
        <Routes>
          {/* Route for the home page */}
          <Route path="/home" element={isLoggedIn ? <Home username={username} /> : <Navigate to="/" />} />
          {/* Route for the Add Asset modal */}
          <Route path="/add-asset" element={<AssetAddModal onAddAsset={() => {}} isOpen={isAddAssetModalOpen} onClose={closeAddAssetModal} />} />
          {/* Route for the login page */}
          <Route path="/login" element={<Login handleLogin={handleLogin} setError={setError} />} />
          {/* Route for the signup page */}
          <Route path="/signup" element={<Signup />} />
          {/* Default route redirects to login page */}
          <Route path="/" element={<Login handleLogin={handleLogin} setError={setError} />} />
        </Routes>
        {/* Display error message if there's an error */}
        {error && <div className="error">{error}</div>}
      </div>
    </Router>
  );
}

export default App;
