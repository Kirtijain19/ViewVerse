import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>ViewVerse</h1>
        </Link>

        <div className="header-search">
          <input 
            type="text" 
            placeholder="Search videos, channels..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                navigate(`/search?q=${e.target.value}`);
              }
            }}
          />
        </div>

        <div className="header-actions">
          {user ? (
            <>
              <Link to="/upload" className="upload-btn">
                📤 Upload
              </Link>
              
              <div className="user-menu">
                <button 
                  className="user-btn"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <img src={user.avatar} alt={user.username} className="avatar-small" />
                </button>

                {showMenu && (
                  <div className="dropdown-menu">
                    <Link to={`/profile/${user._id}`} onClick={() => setShowMenu(false)}>
                      Profile
                    </Link>
                    <Link to="/settings" onClick={() => setShowMenu(false)}>
                      Settings
                    </Link>
                    <Link to="/dashboard" onClick={() => setShowMenu(false)}>
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;