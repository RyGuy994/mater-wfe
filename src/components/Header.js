import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import the CSS file
import materImage from './static/favicon-16x16.png'; // Import the image file

const Header = ({ isLoggedIn, handleLogout }) => {
  return (
    <div className="header-container">
      <nav>
        {isLoggedIn ? (
          <ul>
            <li>
            <Link to="/home" className="icon-link">
              <div className="icon-container">
                <img src={materImage} alt="Home Icon" className="icon" />
                <span>Home</span>
              </div>
            </Link>
            </li>
            <li className="dropdown">
              <span>Assets</span>
              <div className="dropdown-content">
                <Link to="/add-asset">Add Asset</Link>
                <Link to="/view-assets">View All Assets</Link>
              </div>
            </li>
            <li className="dropdown">
              <span>Services</span>
              <div className="dropdown-content">
                <Link to="/add-service">Add Service</Link>
                <Link to="/view-services">View All Services</Link>
              </div>
            </li>
            <li className="dropdown">
              <span>Calendar</span>
              <div className="dropdown-content">
                <Link to="/all-services-calendar">All Services Calendar</Link>
                <Link to="/not-completed-calendar">Not Completed Calendar</Link>
                <Link to="/completed-calendar">Completed Calendar</Link>
              </div>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
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
                <img src={materImage} alt="Home Icon" className="icon" />
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
