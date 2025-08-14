import React from 'react';
import { Package, MapPin } from 'lucide-react';

const SupplierCard = ({ supplier, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{supplier.name}</h3>
        <div className="flex items-center text-gray-500 mb-1">
          <Package size={16} className="mr-2" />
          <span>{supplier.category || 'Categoría no especificada'}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <MapPin size={16} className="mr-2" />
          <span>{supplier.location || 'Ubicación no especificada'}</span>
        </div>
        <button
          onClick={() => onSelect(supplier)}
          className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md transition-colors duration-300"
        >
          Ver más
        </button>
      </div>
    </div>
  );
};

export default SupplierCard;
