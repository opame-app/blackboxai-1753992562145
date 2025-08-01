import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById } from '../../services/restaurantService.js';

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (err) {
        setError('Error al obtener los detalles del restaurante.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <p>Cargando detalles del restaurante...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!restaurant) return <p>No se encontraron detalles para este restaurant.</p>;

  return (
    <div className="container">
      <h2>{restaurant.name}</h2>
      <p><strong>Ubicación:</strong> {restaurant.location}</p>
      <p><strong>Descripción:</strong> {restaurant.description}</p>
      {restaurant.imageUrl && (
        <img src={restaurant.imageUrl} alt={restaurant.name} style={{ maxWidth: '100%', borderRadius: '12px' }} />
      )}
      <p><strong>Contacto:</strong> {restaurant.contactInfo}</p>
    </div>
  );
}

export default RestaurantDetail;
