import React from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 40, textAlign: 'center' }}>
          <h1>404</h1>
          <p>Page not found.</p>
          <p>
            <Link to="/">Go back home</Link>
          </p>
        </main>
      </div>
    </div>
  );
};

export default NotFound;