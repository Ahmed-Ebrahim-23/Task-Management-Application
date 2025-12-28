import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import '../../styles/layout.css';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1 className="header-title">Task Management</h1>
        </div>
        
        <div className="header-user">
          <div className="user-info">
            <span className="user-name">Welcome, {user?.name || 'User'}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          
          <Button
            variant="secondary"
            size="small"
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;