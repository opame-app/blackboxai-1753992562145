import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase.js';

function Header({ user, userProfile }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content container">
        <Link to="/" className="logo">GastroCommunity</Link>
        <nav className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-secondary">Cerrar sesión</button>
            </>
          ) : (
            <Link to="/signin" className="nav-link">Iniciar sesión</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
