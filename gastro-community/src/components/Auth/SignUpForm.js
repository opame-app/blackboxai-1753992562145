import React, { useState } from 'react';
import { createUserProfile } from '../../services/userService.js';
import { useNavigate } from 'react-router-dom';

function SignUpForm({ user, setUserProfile }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      setError('Por favor, selecciona un rol.');
      return;
    }
    try {
      await createUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName,
        role,
        profileComplete: true,
      });
      setUserProfile({
        email: user.email,
        displayName: user.displayName,
        role,
        profileComplete: true,
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Error al guardar el perfil. Intenta nuevamente.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">Completa tu Perfil</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={user.email} disabled className="form-input" />
          </div>
          <div className="form-group">
            <label>Selecciona tu rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-select"
              required
            >
              <option value="">-- Selecciona --</option>
            <option value="dueño de restaurant">Dueño de Restaurant</option>
            <option value="restaurant">Restaurant</option>
            <option value="empleado">Empleado</option>
            <option value="proveedor">Proveedor</option>
            <option value="influencer">Influencer</option>
            </select>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary">Guardar y Continuar</button>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
