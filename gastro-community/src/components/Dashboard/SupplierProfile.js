import React from 'react';
import ActivityFeed from '../Common/ActivityFeed.js';

function SupplierProfile({ user, userProfile }) {
  return (
    <div className="container">
      <h2>Perfil del Proveedor</h2>
      <section className="dashboard-section">
        <h3>Información del Proveedor</h3>
        <p><strong>Nombre:</strong> {userProfile?.displayName || user?.displayName}</p>
        <p><strong>Email:</strong> {userProfile?.email || user?.email}</p>
        <p><strong>Descripción:</strong> {userProfile?.description || 'No hay descripción disponible.'}</p>
        <p><strong>Ofertas:</strong> {userProfile?.offers || 'No hay ofertas disponibles.'}</p>
      </section>
      <section className="dashboard-section">
        <ActivityFeed userId={user?.uid} />
      </section>
    </div>
  );
}

export default SupplierProfile;
