import React, { useEffect, useState } from 'react';

const Home = () => {
  const username = localStorage.getItem('username');
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      const jwtToken = localStorage.getItem('jwt');
      const baseUrl = import.meta.env.VITE_BASE_URL;

      try {
        const response = await fetch(`${baseUrl}/assets/asset_all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ jwt: jwtToken })
        });

        const data = await response.json();
        if (response.ok) {
          setAssets(data);
          console.log('Assets fetched successfully:', data);
        } else {
          console.error('Failed to fetch assets:', data.error);
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, []);

  return (
    <div>
      <h2>Welcome, {username} to MATER!</h2>
      <h3>Your Assets</h3>
      <ul>
        {assets.map((asset, index) => (
          <li key={index}>
            <strong>{asset.name}</strong>: {asset.asset_status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
