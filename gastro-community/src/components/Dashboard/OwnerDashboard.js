import React, { useState } from 'react';
import JobOfferForm from './JobOfferForm.js';
import ActivityFeed from '../Common/ActivityFeed.js';
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
  Star
} from 'lucide-react';

function OwnerDashboard({ user, userProfile }) {
  const [showJobDialog, setShowJobDialog] = useState(false);

  const openJobDialog = () => setShowJobDialog(true);
  const closeJobDialog = () => setShowJobDialog(false);

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

          <button className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
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
          </button>

          <button className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Proveedores</p>
                <p className="text-xs text-gray-500">Gestiona tus contactos</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>

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
