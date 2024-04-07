import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import the CSS file

const Header = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav>
      {isLoggedIn ? (
        <ul>
          <li>
            <Link to="/home">Home</Link>
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
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <Link to="/">Login</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Header;
