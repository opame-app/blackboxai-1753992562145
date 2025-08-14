import React, { useState, useEffect } from 'react';
import { getAllSuppliers, searchSuppliers } from '../../services/supplierService.js';
import SupplierCard from './SupplierCard.js';
import SupplierDetailModal from './SupplierDetailModal.js';
import ClaimProfileModal from './ClaimProfileModal.js';
import { Search } from 'lucide-react';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const allSuppliers = await getAllSuppliers();
        setSuppliers(allSuppliers);
        setFilteredSuppliers(allSuppliers);
        setError(null);
      } catch (err) {
        setError('No se pudieron cargar los proveedores. Inténtalo de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery) {
        setLoading(true);
        const results = await searchSuppliers(searchQuery);
        setFilteredSuppliers(results);
        setLoading(false);
      } else {
        setFilteredSuppliers(suppliers);
      }
    }, 300); // Debounce search

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, suppliers]);

  const handleSelectSupplier = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleCloseDetailModal = () => {
    setSelectedSupplier(null);
  };

  const handleOpenClaimModal = (supplier) => {
    setSelectedSupplier(supplier);
    setIsClaimModalOpen(true);
  };

  const handleCloseClaimModal = () => {
    setIsClaimModalOpen(false);
    setSelectedSupplier(null);
  };
  
  const handleClaimSubmit = (formData) => {
    // In a real app, you would send this to a server or a separate Firestore collection
    // for admin review.
    console.log("Claim form submitted for supplier:", selectedSupplier.id, formData);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Proveedores Gastronómicos</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Encuentra los mejores insumos y servicios para tu negocio en Argentina.
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, categoría o ubicación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>
          </div>
        ) : filteredSuppliers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredSuppliers.map(supplier => (
              <SupplierCard key={supplier.id} supplier={supplier} onSelect={handleSelectSupplier} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No se encontraron proveedores que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>

      <SupplierDetailModal 
        supplier={selectedSupplier} 
        onClose={handleCloseDetailModal}
        onClaimProfile={handleOpenClaimModal}
      />
      
      {isClaimModalOpen && (
        <ClaimProfileModal
          supplier={selectedSupplier}
          onClose={handleCloseClaimModal}
          onSubmit={handleClaimSubmit}
        />
      )}
    </div>
  );
};

export default SuppliersPage;
