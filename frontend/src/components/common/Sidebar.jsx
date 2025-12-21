import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button 
        className="toggle-btn"
        onClick={() => setCollapsed(!collapsed)}
      >
        ☰
      </button>

      <nav className="sidebar-nav">
        <Link to="/" className="nav-item">
          <span className="icon">🏠</span>
          {!collapsed && <span>Home</span>}
        </Link>

        <Link to="/shorts" className="nav-item">
          <span className="icon">⚡</span>
          {!collapsed && <span>Shorts</span>}
        </Link>

        <Link to="/subscriptions" className="nav-item">
          <span className="icon">🔔</span>
          {!collapsed && <span>Subscriptions</span>}
        </Link>

        {user && (
          <>
            <hr />

            <Link to={`/profile/${user._id}`} className="nav-item">
              <span className="icon">👤</span>
              {!collapsed && <span>Your Channel</span>}
            </Link>

            <Link to="/playlists" className="nav-item">
              <span className="icon">📋</span>
              {!collapsed && <span>Playlists</span>}
            </Link>

            <Link to="/history" className="nav-item">
              <span className="icon">⏱️</span>
              {!collapsed && <span>History</span>}
            </Link>

            <Link to="/likes" className="nav-item">
              <span className="icon">❤️</span>
              {!collapsed && <span>Liked Videos</span>}
            </Link>

            <hr />

            <Link to="/dashboard" className="nav-item">
              <span className="icon">📊</span>
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;