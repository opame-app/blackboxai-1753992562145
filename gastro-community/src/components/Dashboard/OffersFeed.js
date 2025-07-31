import React, { useState, useEffect } from 'react';
import { getJobOffers } from '../../services/jobService';
import JobOfferDetail from './JobOfferDetail';

function OffersFeed() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getJobOffers();
        setOffers(data);
      } catch (err) {
        setError('Error cargando las ofertas.');
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) return <p>Cargando ofertas...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const openOfferDetail = (id) => {
    setSelectedOfferId(id);
  };

  const closeOfferDetail = () => {
    setSelectedOfferId(null);
  };

  return (
    <div>
      {offers.length === 0 ? (
        <p>No hay ofertas disponibles en este momento</p>
      ) : (
        offers.map((offer) => (
          <div key={offer.id} className="card" onClick={() => openOfferDetail(offer.id)} style={{ cursor: 'pointer' }}>
            <h4>{offer.title}</h4>
            <p>{offer.description}</p>
            {offer.hourlyRate && <p><strong>Precio por hora:</strong> ${offer.hourlyRate}</p>}
          </div>
        ))
      )}

      {selectedOfferId && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <button className="dialog-close" onClick={closeOfferDetail}>X</button>
            <JobOfferDetail offerId={selectedOfferId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default OffersFeed;
