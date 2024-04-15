import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import AssetAddModal from './components/AssetAddModal';
import Signup from './components/Signup';
import Modal from './components/Modal'
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);

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
    console.log("Opening Add Asset modal..."); // Log the message when the function is invoked
    setIsAddAssetModalOpen(true);
    console.log("isAddAssetModalOpen after setting to true:", isAddAssetModalOpen); // Log the value of isAddAssetModalOpen after setting it to true
  };
  

  const closeAddAssetModal = () => {
    setIsAddAssetModalOpen(false);
  };

  const handleAddAsset = (assetData) => {
    // Handle adding asset data
    setIsAddAssetModalOpen(false); // Close the modal after adding the asset
  };

  // Log the final value of isAddAssetModalOpen after the component returns
  console.log("Final isAddAssetModalOpen value:", isAddAssetModalOpen);

  // Inside the component function
  useEffect(() => {
    console.log("isAddAssetModalOpen after setting to true:", isAddAssetModalOpen);
  }, [isAddAssetModalOpen]);

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} handleLogin={handleLogin} openAddAssetModal={openAddAssetModal} />
        <Routes>
          <Route path="/home" element={isLoggedIn ? <Home username={username} /> : <Navigate to="/" />} />
          <Route
            path="/add-asset"
            element={
              <AssetAddModal
                onAddAsset={handleAddAsset} // Pass handleAddAsset function to handle adding an asset
                isOpen={isAddAssetModalOpen} // Pass isOpen prop to control modal visibility
                onClose={closeAddAssetModal} // Pass onClose function to close the modal
              />
            }
          />
          <Route path="/login" element={<Login handleLogin={handleLogin} setError={setError} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login handleLogin={handleLogin} setError={setError} />} />
        </Routes>
        {error && <div className="error">{error}</div>}
      </div>
    </Router>
  );
}

export default App;
