import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ userProfile }) {
  if (!userProfile) return null;

  const links = [
    { to: '/home', label: 'Inicio', icon: '🏡' },
    { to: '/dashboard', label: 'Panel', icon: '🏠' },
  ];

  if (userProfile.role === 'dueño de restaurant') {
    links.push({ to: '/owner-employed-view', label: 'Empleados', icon: '🧑🏻‍💼' });
    links.push({ to: '/owner-supplier-view', label: 'Proveedores', icon: '📦' });
    // links.push({ to: '/create-restaurant', label: 'Gestionar', icon: '⚙️' });
    // links.push({ to: '/job-offer-form', label: 'Ofertas de Trabajo', icon: '📋' });
  }

  if (userProfile.role === 'empleado') {
    links.push({ to: '/offers-feed', label: 'Ofertas de Trabajo', icon: '📋' });
  }

  if (userProfile.role === 'restaurant') {
    links.push({ to: '/restaurant-list', label: 'Restaurants', icon: '🍽️' });
  }

  // if (userProfile.role === 'proveedor') {
  //   links.push({ to: '/supplier-profile', label: 'Perfil Proveedor', icon: '📦' });
  // }

  // if (userProfile.role === 'influencer') {
  //   links.push({ to: '/influencer-dashboard', label: 'Dashboard Influencer', icon: '⭐' });
  // }

  if (userProfile.isAdmin) {
    links.push({ to: '/admin-dashboard', label: 'Dashboard Admin', icon: '🛠️' });
  }

  links.push({ to: '/profile', label: 'Perfil', icon: '👤' });
  links.push({ to: '/logout', label: 'Cerrar sesión', icon: '🚪' });

  return (
    <aside className="sidebar" style={{
      backgroundColor: '#fff',
      color: '#3c3c50',
      height: '100vh',
      padding: '1rem',
      width: '220px',
      borderRadius: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{
          marginBottom: '2rem',
          padding: '1rem',
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          borderRadius: '12px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.25rem',
          color: '#2c2c3c'
        }}>
          cactus<br />Invierno '25
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#e0e0e0',
            borderRadius: '8px'
          }}>
            {/* Placeholder for user avatar */}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#2c2c3c' }}>
              {userProfile.displayName || 'Usuario'}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#8b8b9f',
              textTransform: 'lowercase',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              padding: '0 6px',
              display: 'inline-block',
              marginTop: '2px'
            }}>
              pro
            </div>
          </div>
        </div>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {links.map(({ to, label, icon }) => (
              <li key={to} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: '#8b8b9f' }}>
                <span style={{ fontSize: '1.25rem' }}>{icon}</span>
                <NavLink
                  to={to}
                  style={({ isActive }) => ({
                    color: isActive ? '#3c3c50' : '#8b8b9f',
                    textDecoration: 'none',
                    fontWeight: isActive ? '600' : '400',
                    fontSize: '1rem',
                    flexGrow: 1
                  })}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div style={{ fontSize: '0.875rem', color: '#8b8b9f', textAlign: 'center', marginTop: 'auto' }}>
        © 2025 Cactus Community
      </div>
    </aside>
  );
}

export default Sidebar;
