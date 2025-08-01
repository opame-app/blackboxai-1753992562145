import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedRestaurants } from '../../services/restaurantService.js';
import { 
  MapPin, 
  Clock, 
  Star,
  Store,
  Truck,
  Users,
  Search,
  Filter
} from 'lucide-react';

function RestaurantsList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getPublishedRestaurants();
        setRestaurants(data);
      } catch (err) {
        setError('Error al cargar los restaurantes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || restaurant.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getUniqueTypes = () => {
    const types = restaurants.map(r => r.type).filter(Boolean);
    return [...new Set(types)];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando restaurantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Restaurantes</h1>
              <p className="text-gray-600 mt-1">
                Descubre {restaurants.length} restaurantes disponibles
              </p>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar restaurantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Todos los tipos</option>
                  {getUniqueTypes().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron restaurantes
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' 
                ? 'Intenta ajustar tus filtros de búsqueda'
                : 'No hay restaurantes disponibles en este momento'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
              >
                {/* Restaurant Image */}
                <div className="relative h-48 bg-gradient-to-r from-purple-400 to-pink-400">
                  {restaurant.coverPic ? (
                    <img
                      src={restaurant.coverPic}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="w-12 h-12 text-white opacity-80" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {restaurant.openForBusiness ? (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                        Abierto
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        Cerrado
                      </span>
                    )}
                  </div>

                  {/* Featured Badge */}
                  {restaurant.isFeatured && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                        Destacado
                      </span>
                    </div>
                  )}
                </div>

                {/* Restaurant Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                      {restaurant.name}
                    </h3>
                    {restaurant.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{restaurant.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{restaurant.address}, {restaurant.city}</span>
                  </div>

                  {restaurant.type && (
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {restaurant.type}
                      </span>
                    </div>
                  )}

                  {/* Services Icons */}
                  <div className="flex items-center space-x-4 text-gray-500">
                    {restaurant.onSite?.isActive && (
                      <div className="flex items-center" title="Servicio en el local">
                        <Store className="w-4 h-4" />
                      </div>
                    )}
                    {restaurant.delivery?.isActive && (
                      <div className="flex items-center" title="Delivery disponible">
                        <Truck className="w-4 h-4" />
                      </div>
                    )}
                    {restaurant.onSite?.tableQuantity && (
                      <div className="flex items-center" title={`${restaurant.onSite.tableQuantity} mesas`}>
                        <Users className="w-4 h-4" />
                        <span className="text-xs ml-1">{restaurant.onSite.tableQuantity}</span>
                      </div>
                    )}
                  </div>

                  {/* Promo Code */}
                  {restaurant.promoCode && (
                    <div className="mt-3 p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                      <p className="text-xs text-gray-700">
                        Código promocional: <code className="font-mono font-semibold">{restaurant.promoCode}</code>
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantsList;
