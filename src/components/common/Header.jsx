// src/components/common/Header.jsx

// Import React library
import React from 'react';

// Import Link component from React Router
import { Link } from 'react-router-dom';

// Import CSS file for styling
import './Header.css';

// Import Mater image
import materImage from '../static/favicon-16x16.png';

// Header component
const Header = ({ isLoggedIn, handleLogout, openAddAssetModal, openAddServiceModal }) => {
  return (
    // Header container
    <div className="header-container">
      {/* Navigation */}
      <nav>
        {/* Conditional rendering based on login status */}
        {isLoggedIn ? (
          // If user is logged in
          <ul>
            {/* Home link */}
            <li>
              <Link to="/home" className="icon-link">
                <div className="icon-container">
                  <img src={materImage} alt="Home" className="icon" />
                  <span>Home</span>
                </div>
              </Link>
            </li>
            {/* Assets dropdown */}
            <li className="dropdown">
              <span>Assets</span>
              <div className="dropdown-content">
                <span onClick={openAddAssetModal}>Add Asset</span>
                <Link to="/assets-view-all">View All Assets</Link>
              </div>
            </li>
            {/* Services dropdown */}
            <li className="dropdown">
              <span>Services</span>
              <div className="dropdown-content">
                <span onClick={openAddServiceModal}>Add Service</span>
                <Link to="/services-view-all">View All Services</Link>
              </div>
            </li>
            {/* Settings link */}
            <li>
              <Link to="/settings" className="dropdown">
                <span>Settings</span>
              </Link>
            </li>
            {/* Logout button */}
            <li>
              <span onClick={handleLogout}>Logout</span>
            </li>
          </ul>
        ) : (
          // If user is not logged in
          <ul>
            {/* Login link */}
            <li>
              <Link to="/" className="icon-link">
                <div className="icon-container">
                  <img src={materImage} alt="Home" className="icon" />
                  <span>Login</span>
                </div>
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
};

// Export the Header component
export default Header;
