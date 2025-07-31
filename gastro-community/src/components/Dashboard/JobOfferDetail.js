import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getJobOfferById } from '../../services/jobService';

function JobOfferDetail() {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const data = await getJobOfferById(id);
        setOffer(data);
      } catch (err) {
        setError('Error al obtener los detalles de la oferta de trabajo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  if (loading) return <p>Cargando detalles de la oferta...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!offer) return <p>No se encontraron detalles para esta oferta.</p>;

  return (
    <div className="container">
      <h2>{offer.title}</h2>
      <p><strong>Descripción:</strong> {offer.description}</p>
      <p><strong>Ubicación:</strong> {offer.location}</p>
      {offer.hourlyRate && <p><strong>Precio por hora:</strong> ${offer.hourlyRate}</p>}
      {offer.requirements && (
        <div>
          <strong>Requisitos:</strong>
          <p>{offer.requirements}</p>
        </div>
      )}
      <p><strong>Contacto:</strong> {offer.contactInfo}</p>
      <p><strong>Creado por:</strong> {offer.ownerName}</p>
    </div>
  );
}

export default JobOfferDetail;
