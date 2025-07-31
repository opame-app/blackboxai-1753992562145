import React, { useState } from 'react';
import { updateUserProfile } from '../../services/userService';

function Profile({ user, userProfile }) {
  const [role, setRole] = useState(userProfile?.role || '');
  const [description, setDescription] = useState(userProfile?.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const roles = [
    'restaurant',
    'dueño de restaurant',
    'empleado',
    'proveedor',
    'influencer'
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await updateUserProfile(user.uid, { role, description });
      setMessage('Perfil actualizado correctamente.');
      // Refresh page to load new view based on role change
      window.location.reload();
    } catch (error) {
      setMessage('Error al actualizar el perfil.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container">
      <h2>Mi Perfil</h2>
      <section className="dashboard-section">
        <p><strong>Nombre:</strong> {userProfile?.displayName || user?.displayName}</p>
        <p><strong>Email:</strong> {userProfile?.email || user?.email}</p>
        <div className="form-group">
          <label>Rol:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
            {roles.map((r) => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            rows={4}
          />
        </div>
        {message && <p className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</p>}
        <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </section>
    </div>
  );
}

export default Profile;
