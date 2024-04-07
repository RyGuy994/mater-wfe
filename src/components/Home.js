import React from 'react';

const Home = () => {
  // Retrieve username from local storage
  const username = localStorage.getItem('username');

  return (
    <div>
      <h2>Welcome, {username} to MATER!</h2>
      {/* Other content for the home page */}
    </div>
  );
};

export default Home;
