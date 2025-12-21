import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import '../../styles/Navbar.css';

const Navbar = ({ children }) => {
  return (
    <div className="navbar-layout">
      <Header />
      <div className="navbar-body">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Navbar;