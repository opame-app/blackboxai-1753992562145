import React from 'react';
import { X, Phone, Mail, Globe, MessageSquare, Star } from 'lucide-react';

const SupplierDetailModal = ({ supplier, onClose, onClaimProfile }) => {
  if (!supplier) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{supplier.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">{supplier.description || 'No hay descripción disponible.'}</p>

          <div className="space-y-4">
            {supplier.phone && (
              <div className="flex items-center text-gray-700">
                <Phone size={18} className="mr-3 text-gray-500" />
                <span>{supplier.phone}</span>
              </div>
            )}
            {supplier.email && (
              <div className="flex items-center text-gray-700">
                <Mail size={18} className="mr-3 text-gray-500" />
                <a href={`mailto:${supplier.email}`} className="hover:underline">{supplier.email}</a>
              </div>
            )}
            {supplier.website && (
              <div className="flex items-center text-gray-700">
                <Globe size={18} className="mr-3 text-gray-500" />
                <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{supplier.website}</a>
              </div>
            )}
            {supplier.socialMedia && (
              <div className="flex items-center text-gray-700">
                <MessageSquare size={18} className="mr-3 text-gray-500" />
                <a href={supplier.socialMedia} target="_blank" rel="noopener noreferrer" className="hover:underline">Redes Sociales</a>
              </div>
            )}
          </div>

          {supplier.productHighlights && supplier.productHighlights.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Productos Destacados</h3>
              <ul className="space-y-2">
                {supplier.productHighlights.map((product, index) => (
                  <li key={index} className="flex items-start">
                    <Star size={16} className="mr-3 mt-1 text-yellow-500 flex-shrink-0" />
                    <span className="text-gray-700">{product}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 border-t pt-6">
            <button
              onClick={() => onClaimProfile(supplier)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Reclamar este Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailModal;
