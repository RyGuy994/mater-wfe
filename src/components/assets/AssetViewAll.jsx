// src/components/assets/AssetViewAll.jsx
import React, { useEffect, useState } from 'react';

const AssetViewAll = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      const jwtToken = localStorage.getItem('jwt'); // Retrieve JWT from local storage
      const baseUrl = import.meta.env.VITE_BASE_URL;

      const response = await fetch(`${baseUrl}/assets/asset_all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jwt: jwtToken }) // Send JWT in the body
      });

      const data = await response.json();
      if (response.ok) {
        setAssets(data);
      } else {
        console.error('Failed to fetch assets:', data.error);
      }
    };

    fetchAssets();
  }, []);

  return (
    <div>
      <h3>All Assets</h3>
      <ul>
        {assets.map((asset, index) => (
          <li key={index}>
            <h4>{asset.name}</h4>
            <p>{asset.description}</p>
            <p>Serial Number: {asset.asset_sn}</p>
            <p>Acquired Date: {asset.acquired_date}</p>
            <p>Status: {asset.asset_status}</p>
            {asset.image_path && <img src={asset.image_path} alt={asset.name} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetViewAll;
