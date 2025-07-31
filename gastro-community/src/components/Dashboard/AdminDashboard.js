import React, { useState } from 'react';
import JobOfferForm from './JobOfferForm';
import ActivityFeed from '../Common/ActivityFeed';
import { createRestaurant } from '../../services/restaurantService';

function AdminDashboard({ user }) {
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showRestaurantDialog, setShowRestaurantDialog] = useState(false);
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    type: 'restaurant',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const openJobDialog = () => setShowJobDialog(true);
  const closeJobDialog = () => setShowJobDialog(false);

  const openRestaurantDialog = () => setShowRestaurantDialog(true);
  const closeRestaurantDialog = () => {
    setShowRestaurantDialog(false);
    setRestaurantData({ name: '', type: 'restaurant', address: '' });
    setError('');
  };

  const handleRestaurantChange = (e) => {
    setRestaurantData({
      ...restaurantData,
      [e.target.name]: e.target.value
    });
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!restaurantData.name || !restaurantData.address) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createRestaurant({
        ...restaurantData,
        ownerId: user.uid,
        ownerName: user.displayName
      });
      alert('Restaurant creado exitosamente');
      closeRestaurantDialog();
    } catch (err) {
      setError('Error al crear el restaurant.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2>Panel de Administrador</h2>
      
      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h3>Gestión de Empleo</h3>
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
          <h3>Gestión de Restaurantes</h3>
          <button 
            onClick={openRestaurantDialog}
            className="btn btn-primary"
          >
            Crear Restaurant
          </button>
          
          {showRestaurantDialog && (
            <div className="dialog-overlay">
              <div className="dialog-content">
                <button className="dialog-close" onClick={closeRestaurantDialog}>X</button>
                <form onSubmit={handleRestaurantSubmit}>
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      name="name"
                      value={restaurantData.name}
                      onChange={handleRestaurantChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo *</label>
                    <select
                      name="type"
                      value={restaurantData.type}
                      onChange={handleRestaurantChange}
                      className="form-select"
                    >
                      <option value="bar">Bar</option>
                      <option value="cafeteria">Cafetería</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="pizzeria">Pizzería</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Dirección *</label>
                    <input
                      type="text"
                      name="address"
                      value={restaurantData.address}
                      onChange={handleRestaurantChange}
                      required
                      className="form-input"
                    />
                  </div>
                  {error && <p className="error-message">{error}</p>}
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Creando...' : 'Crear Restaurant'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <ActivityFeed userId={user?.uid} />
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
