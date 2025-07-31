import React, { useState } from 'react';
import JobOfferForm from './JobOfferForm';
import ActivityFeed from '../Common/ActivityFeed';

function OwnerDashboard({ user, userProfile }) {
  const [showJobDialog, setShowJobDialog] = useState(false);

  const openJobDialog = () => setShowJobDialog(true);
  const closeJobDialog = () => setShowJobDialog(false);

  return (
    <div className="container">
      <h2>Panel de Dueño de Restaurante</h2>
      
      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h3>Gestión de Empleados</h3>
          <button 
            onClick={openJobDialog}
            className="btn btn-primary"
          >
            Crear Oferta de Trabajo
          </button>
          
          {showJobDialog && (
            <div className="dialog-overlay">
              <div className="dialog-content">
                <button className="dialog-close" onClick={closeJobDialog}>X</button>
                <JobOfferForm 
                  user={user} 
                  onJobCreated={closeJobDialog}
                />
              </div>
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h3>Buscar Empleados</h3>
          <input type="text" placeholder="Buscar por nombre..." />
          {/* Aquí se mostrarían los resultados de búsqueda */}
        </section>

        <section className="dashboard-section">
          <h3>Contactar Proveedores</h3>
          <div className="card-grid">
            <div className="card">
              <h4>Proveedor Ejemplo</h4>
              <p>Ofrece: Ingredientes frescos</p>
              <button className="btn btn-secondary">Contactar</button>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <ActivityFeed userId={user?.uid} />
        </section>
      </div>
    </div>
  );
}

export default OwnerDashboard;
