// src/components/common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import materImage from '../static/favicon-16x16.png';

const Header = ({ isLoggedIn, handleLogout, openAddAssetModal, openAddServiceModal }) => {
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
                <span onClick={openAddAssetModal}>Add Asset</span>
                <Link to="/assets-view-all">View All Assets</Link>
              </div>
            </li>
            <li className="dropdown">
              <span>Services</span>
              <div className="dropdown-content">
                <span onClick={openAddServiceModal}>Add Service</span>
                <Link to="/services-view-all">View All Services</Link>
              </div>
            </li>
            <li>
              <Link to="/settings" className="icon-link">
                <span>Settings</span>
              </Link>
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
