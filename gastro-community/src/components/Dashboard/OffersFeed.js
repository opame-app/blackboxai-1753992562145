import React, { useState, useEffect } from 'react';
import { getJobOffers } from '../../services/jobService.js';
import JobOfferDetail from './JobOfferDetail.js';

function OffersFeed() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getJobOffers();
        // Limit to 5 most recent offers for minimalist view
        setOffers(data.slice(0, 5));
      } catch (err) {
        setError('Error cargando ofertas');
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) return <p className="text-xs text-gray-500">Cargando...</p>;
  if (error) return <p className="text-xs text-red-500">{error}</p>;

  const openOfferDetail = (id) => {
    setSelectedOfferId(id);
  };

  const closeOfferDetail = () => {
    setSelectedOfferId(null);
  };

  return (
    <div className="space-y-1 sm:space-y-2">
      {offers.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-4">No hay ofertas disponibles</p>
      ) : (
        offers.map((offer) => (
          <div 
            key={offer.id} 
            className="border border-gray-200 rounded-md p-2 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => openOfferDetail(offer.id)}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
              <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate flex-1">{offer.title}</h4>
              {offer.hourlyRate && (
                <span className="text-xs font-medium text-green-600 whitespace-nowrap">${offer.hourlyRate}/h</span>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-1 leading-tight">
              {offer.description?.length > 60 
                ? `${offer.description.substring(0, 60)}...` 
                : offer.description}
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="text-xs text-gray-400 truncate">
                {offer.location || 'Ubicación no especificada'}
              </span>
              <span className="text-xs text-blue-600 hover:text-blue-800 self-start sm:self-auto">Ver detalles →</span>
            </div>
          </div>
        ))
      )}

      {selectedOfferId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-sm sm:max-w-md max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-2 sm:p-3 border-b">
              <h3 className="text-sm font-medium">Detalles de la Oferta</h3>
              <button 
                className="text-gray-400 hover:text-gray-600 text-lg p-1"
                onClick={closeOfferDetail}
              >
                ×
              </button>
            </div>
            <div className="p-2 sm:p-3">
              <JobOfferDetail offerId={selectedOfferId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OffersFeed;
