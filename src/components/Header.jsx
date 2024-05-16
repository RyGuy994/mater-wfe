import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import materImage from './static/favicon-16x16.png';

const Header = ({ isLoggedIn, handleLogout, openAddAssetModal }) => {
  return (
    <div className="header-container">
      <nav>
        {isLoggedIn ? (
          <ul>
            <li>
              <Link to="/home" className="icon-link">
                <div className="icon-container">
                  <img src={materImage} alt="Home" className="icon" />
                  <span>Home</span>
                </div>
              </Link>
            </li>
            <li className="dropdown">
              <span>Assets</span>
              <div className="dropdown-content">
                <span onClick={() => { console.log("Add Asset button clicked"); openAddAssetModal(); }}>Add Asset</span>
                <Link to="/view-assets">View All Assets</Link>
              </div>
            </li>
            <li>
              <span onClick={handleLogout}>Logout</span>
            </li>
          </ul>
        ) : (
          <ul>
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
