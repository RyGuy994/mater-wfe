import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import the CSS file
import materImage from './static/favicon-16x16.png'; // Import the image file

// Header component responsible for rendering the application header
const Header = ({ isLoggedIn, handleLogout, openAddAssetModal }) => {
  return (
    <div className="header-container">
      <nav>
        {isLoggedIn ? ( // Render different menu items based on user authentication status
          <ul>
            {/* Link to home page */}
            <li>
              <Link to="/home" className="icon-link">
                <div className="icon-container">
                  <img src={materImage} alt="Home" className="icon" />
                  <span>Home</span>
                </div>
              </Link>
            </li>
            {/* Dropdown menu for assets */}
            <li className="dropdown">
              <span>Assets</span>
              <div className="dropdown-content">
                <span onClick={() => { console.log("Add Asset button clicked"); openAddAssetModal(); }}>Add Asset</span>
                <Link to="/view-assets">View All Assets</Link>
              </div>
            </li>
            {/* Menu item for logout */}
            <li>
              <span onClick={handleLogout}>Logout</span>
            </li>
          </ul>
        ) : (
          <ul>
            {/* Link to login page */}
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

export default Header;
