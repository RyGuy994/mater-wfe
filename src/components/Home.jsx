// src/components/Home.jsx

import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './home.css'; // Import your common styles

const Home = () => {
  // Retrieve username from local storage
  const username = localStorage.getItem('username');

  // State to manage assets data
  const [assets, setAssets] = useState([
    { name: "Asset 1", asset_status: "Active" },
    { name: "Asset 2", asset_status: "Inactive" },
    // ... placeholder for gathering all assets
  ]);

  // Define the layout for the grid items
  const layout = [
    { i: 'assetsCard', x: 0, y: 0, w: 4, h: 2 },
    { i: 'slideshowCard', x: 4, y: 0, w: 4, h: 2 }
  ];

  return (
    <div>
      {/* Welcome message with the username */}
      <h2>Welcome, {username} to MATER!</h2>
      <h3>Your Dashboard</h3>
      {/* GridLayout component to create a grid layout */}
      <GridLayout className="layout" layout={layout} cols={12} rowHeight={100} width={1200}>
        {/* Grid item for displaying assets */}
        <div key="assetsCard" className="grid-item">
          <h4>Your Assets</h4>
          <ul>
            {/* Mapping through assets data */}
            {assets.map((asset, index) => (
              <li key={index}>
                <strong>{asset.name}</strong>: {asset.asset_status}
              </li>
            ))}
          </ul>
        </div>
        {/* Grid item for displaying slideshow (placeholder) */}
        <div key="slideshowCard" className="grid-item">
          <h4>Slideshow</h4>
          {/* Placeholder content for slideshow */}
          <p>Slideshow will be here one day</p>
        </div>
      </GridLayout>
    </div>
  );
};

export default Home;
