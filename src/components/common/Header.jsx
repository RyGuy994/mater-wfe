// Import React and necessary hooks
import React, { useState } from 'react';

// Import Link from React Router
import { Link } from 'react-router-dom';

// Import CSS file for styling
import './Header.css';

// Import Mater image
import materImage from '../static/favicon-16x16.png';

// Import Modal component
import Modal from '../common/Modal';

// Header component
const Header = ({ isLoggedIn, handleLogout }) => {
  // State to manage modal visibility and type
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'asset' or 'service'

  // Open Add Asset modal
  const openAddAssetModal = () => {
    setModalType('asset');
    setModalOpen(true);
  };

  // Open Add Service modal
  const openAddServiceModal = () => {
    setModalType('service');
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

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
              <Link to="/settings">
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

      {/* Conditionally render the Modal component */}
      {modalOpen && (
        <Modal
          type={modalType}
          mode="add"
          onClose={handleCloseModal}
          onSubmit={() => {
            // Define what happens after form submission
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
};

// Export the Header component
export default Header;
