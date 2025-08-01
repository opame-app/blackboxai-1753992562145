import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobOfferForm from './JobOfferForm.js';
import ActivityFeed from '../Common/ActivityFeed.js';
import { getRestaurantsByOwner } from '../../services/restaurantService.js';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package,
  Calendar,
  MoreVertical,
  Plus,
  Search,
  Filter,
  Bell,
  Settings,
  ChevronRight,
  Clock,
  CreditCard,
  Utensils,
  Star,
  Store,
  MapPin
} from 'lucide-react';

function OwnerDashboard({ user, userProfile }) {
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);

  const openJobDialog = () => setShowJobDialog(true);
  const closeJobDialog = () => setShowJobDialog(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (user?.uid) {
        try {
          const data = await getRestaurantsByOwner(user.uid);
          setRestaurants(data);
        } catch (error) {
          console.error('Error fetching restaurants:', error);
        } finally {
          setLoadingRestaurants(false);
        }
      }
    };

    fetchRestaurants();
  }, [user?.uid]);

  // Datos de ejemplo para las métricas
  const metrics = {
    totalAcumulado: 321106.00,
    ventas: { value: 24, percentage: 1100, trend: 'up' },
    cubiertos: { value: 11, percentage: 0, trend: 'neutral' },
    pedidos: { value: 21, percentage: 950, trend: 'up' },
    productos: { value: 33, percentage: 313, trend: 'up' },
    anulaciones: { value: 2, percentage: 100, trend: 'up' }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Hola, {userProfile?.name || 'Usuario'} 👋
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Bienvenido a tu panel de control
              </p>
            </div>
            {/* <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Clock className="w-4 h-4 inline mr-2" />
                Historial de turnos
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Calendar className="w-4 h-4 inline mr-2" />
                Ver turno
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="p-6">

        {/* My Restaurants Section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Mis Restaurantes</h3>
                <Link 
                  to="/restaurants"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Ver todos los restaurantes
                </Link>
              </div>
            </div>
            <div className="p-6">
              {loadingRestaurants ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
              ) : restaurants.length === 0 ? (
                <div className="text-center py-8">
                  <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No tienes restaurantes registrados</h4>
                  <p className="text-gray-600 mb-4">Agrega tu primer restaurante para comenzar a gestionar tu negocio</p>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Agregar Restaurante
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {restaurants.slice(0, 3).map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      to={`/restaurant/${restaurant.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {restaurant.name}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {restaurant.published ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Publicado
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              Borrador
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{restaurant.address}, {restaurant.city}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {restaurant.type || 'Tipo no especificado'}
                        </span>
                        <div className="flex items-center space-x-2">
                          {restaurant.openForBusiness ? (
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          ) : (
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                          <span className="text-xs text-gray-500">
                            {restaurant.openForBusiness ? 'Abierto' : 'Cerrado'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección de acciones rápidas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={openJobDialog}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Gestión de Empleados</p>
                <p className="text-xs text-gray-500">Crear ofertas de trabajo</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>

          <Link 
            to="/search"
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Buscar Empleados</p>
                <p className="text-xs text-gray-500">Encuentra talento</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </Link>

          <Link 
            to="/restaurants"
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Ver Restaurantes</p>
                <p className="text-xs text-gray-500">Explora la comunidad</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </Link>

          <button className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Configuración</p>
                <p className="text-xs text-gray-500">Ajustes del restaurante</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Activity Feed */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            </div>
            <div className="p-6">
              <ActivityFeed userId={user?.uid} />
            </div>
          </div>
        </div>
      </div>

      {/* Dialog para crear oferta de trabajo */}
      {showJobDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Crear Oferta de Trabajo</h2>
              <button 
                onClick={closeJobDialog}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-500 text-xl">×</span>
              </button>
            </div>
            <div className="p-6">
              <JobOfferForm 
                user={user} 
                onJobCreated={closeJobDialog}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;
