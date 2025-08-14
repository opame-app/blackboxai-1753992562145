import React, { useState } from 'react';
import JobOfferForm from './JobOfferForm.js';
import ActivityFeed from '../Common/ActivityFeed.js';
import RecordCreation from '../Admin/RecordCreation.js';
import { createRestaurant } from '../../services/restaurantService.js';
import { Users, Building, FilePlus, ChevronRight } from 'lucide-react';

function AdminDashboard({ user, userProfile }) {
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showRestaurantDialog, setShowRestaurantDialog] = useState(false);
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    type: 'restaurant',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const openJobDialog = () => setShowJobDialog(true);
  const closeJobDialog = () => setShowJobDialog(false);

  const openRestaurantDialog = () => setShowRestaurantDialog(true);
  const closeRestaurantDialog = () => {
    setShowRestaurantDialog(false);
    setRestaurantData({ name: '', type: 'restaurant', address: '' });
    setError('');
  };

  const openRecordDialog = () => setShowRecordDialog(true);
  const closeRecordDialog = () => setShowRecordDialog(false);

  const handleRestaurantChange = (e) => {
    setRestaurantData({
      ...restaurantData,
      [e.target.name]: e.target.value
    });
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!restaurantData.name || !restaurantData.address) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createRestaurant({
        ...restaurantData,
        ownerId: user.uid,
        ownerName: user.displayName
      });
      alert('Restaurant creado exitosamente');
      closeRestaurantDialog();
    } catch (err) {
      setError('Error al crear el restaurant.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Panel de Administrador
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Bienvenido, {userProfile?.displayName || user?.displayName || 'Admin'}. Aquí puedes gestionar la plataforma.
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Job Management Card */}
          <button 
            onClick={openJobDialog}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Gestión de Empleo</p>
                <p className="text-xs text-gray-500">Crear ofertas de trabajo</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>

          {/* Restaurant Management Card */}
          <button 
            onClick={openRestaurantDialog}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Gestión de Restaurantes</p>
                <p className="text-xs text-gray-500">Crear nuevos restaurantes</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>

          {/* Record Management Card */}
          <button 
            onClick={openRecordDialog}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FilePlus className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Gestión de Registros</p>
                <p className="text-xs text-gray-500">Crear usuarios y proveedores</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Activity Feed */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Actividad de la Plataforma</h3>
            </div>
            <div className="p-6">
              <ActivityFeed userId={user?.uid} />
            </div>
          </div>
        </div>
      </div>

      {/* Job Offer Dialog */}
      {showJobDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-auto max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Crear Oferta de Trabajo</h2>
              <button onClick={closeJobDialog} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-500 text-2xl leading-none">&times;</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <JobOfferForm user={user} onJobCreated={closeJobDialog} />
            </div>
          </div>
        </div>
      )}

      {/* Restaurant Dialog */}
      {showRestaurantDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-auto max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Crear Restaurant</h2>
              <button onClick={closeRestaurantDialog} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-500 text-2xl leading-none">&times;</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleRestaurantSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    name="name"
                    value={restaurantData.name}
                    onChange={handleRestaurantChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                  <select
                    name="type"
                    value={restaurantData.type}
                    onChange={handleRestaurantChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="bar">Bar</option>
                    <option value="cafeteria">Cafetería</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="pizzeria">Pizzería</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <input
                    type="text"
                    name="address"
                    value={restaurantData.address}
                    onChange={handleRestaurantChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={closeRestaurantDialog} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50" disabled={isSubmitting}>
                    {isSubmitting ? 'Creando...' : 'Crear Restaurant'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Record Creation Dialog */}
      {showRecordDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-auto max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">Crear Registros</h2>
              <button onClick={closeRecordDialog} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-500 text-2xl leading-none">&times;</span>
              </button>
            </div>
            <div className="overflow-y-auto">
              <RecordCreation onClose={closeRecordDialog} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
