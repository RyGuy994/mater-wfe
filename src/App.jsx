import React, { useState, useEffect } from 'react'; // Import React and hooks for state and effects
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import router components for navigation
import Header from './components/common/Header'; // Import the Header component
import Home from './components/Home'; // Import the Home component
import Login from './components/auth/Login'; // Import the Login component
import AssetEditPage from './components/assets/AssetEditPage'; // Import the AssetEditPage component
import AssetViewAll from './components/assets/AssetViewAll'; // Import the AssetViewAll component
import Signup from './components/auth/Signup'; // Import the Signup component
import ServiceViewAll from './components/services/ServiceViewAll'; // Import the ServiceViewAll component
import SettingsGlobal from './components/settings/SettingsGlobal'; // Import the SettingsGlobal component
import SettingsLocal from './components/settings/SettingsLocal'; // Import the SettingsLocal component
import UsersManagement from './components/settings/SettingsUser'; // Import the UsersManagement component
import Profile from './components/settings/Profile'; // Import the Profile component
import './App.css'; // Import CSS styles for the app

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if user is logged in
  const [username, setUsername] = useState(''); // State to store the logged-in user's username
  const [error, setError] = useState(''); // State to hold error messages

  useEffect(() => {
    // Check local storage for a JWT to maintain login state
    const token = localStorage.getItem('jwt'); // Retrieve JWT from local storage
    if (token) {
      // Validate token here if necessary, for now we'll just set the logged-in state
      setIsLoggedIn(true); // Set logged-in state to true
      setUsername(localStorage.getItem('username') || ''); // Retrieve and set username from local storage
    }
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true); // Update login state
    setUsername(username); // Update username state
    setError(''); // Clear any existing error messages
    localStorage.setItem('username', username); // Store username in local storage
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Update login state
    setUsername(''); // Clear username state
    localStorage.removeItem('jwt'); // Remove JWT from local storage
    localStorage.removeItem('username'); // Remove username from local storage
  };

  return (
    <Router> 
      {/* Wrap the app in Router for routing functionality */}
      <div className="App">
        {/* Pass modal controls and authentication to Header */}
        <Header 
          isLoggedIn={isLoggedIn} // Pass login state to Header
          handleLogout={handleLogout} // Pass logout function to Header
        />
        <Routes>
          {/* Define routes for the app */}
          <Route path="/home" element={isLoggedIn ? <Home username={username} /> : <Navigate to="/" />} />
          <Route path="/asset-edit/:asset_id" element={<AssetEditPage />} />
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
        {error && <div className="error">{error}</div>} {/* Display error message if present */}
      </div>
    </Router>
  );
}

export default App; // Export the App component as default