import React, { useState, useEffect } from 'react';
import StatusToggle from '../Common/StatusToggle.js';
import OffersFeed from './OffersFeed.js';
import ActivityFeed from '../Common/ActivityFeed.js';
import PostsFeed from '../Common/PostsFeed.js';
import { getUserProfile, updateUserStatus } from '../../services/userService.js';
import { logActivity } from '../../services/activityService.js';
   
function EmployeeDashboard({ user }) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setIsAvailable(profile.isAvailable || false);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateUserStatus(user.uid, newStatus);
      await logActivity(user.uid, 'status_change', `Estado cambiado a ${newStatus ? 'Disponible' : 'No Disponible'}`);
      setIsAvailable(newStatus);
    } catch (error) {
      setError('Error al actualizar el estado');
      console.error(error);
    }
  };

  if (loading) return <div className="text-xs text-gray-500 p-2">Cargando...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 min-h-screen pb-20 md:pb-4">
      {/* Compact Header - Profile & Status - Responsive */}
      <div className="bg-red-500 text-white p-4">TEST</div>
      <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="min-w-0 flex-1 sm:flex-none">
            <div className="text-sm font-medium truncate">{user.displayName}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span>Estado:</span>
            <span className={`font-medium ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
              {isAvailable ? 'Disponible' : 'No Disponible'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <StatusToggle
            user={user}
            currentStatus={isAvailable}
            onStatusChange={handleStatusChange}
          />
        </div>
        {error && <p className="text-xs text-red-500 w-full">{error}</p>}
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
        
        {/* Ofertas de Trabajo */}
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 h-[35vh] sm:h-[40vh] lg:h-[calc(100vh-140px)] overflow-hidden">
          <h3 className="text-sm font-medium mb-2 text-gray-700 flex items-center">
            <span className="mr-2">💼</span>
            Ofertas Disponibles
          </h3>
          <div className="h-[calc(100%-2rem)] overflow-y-auto">
            <OffersFeed />
          </div>
        </div>

        {/* Publicaciones Comunitarias */}
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 h-[35vh] sm:h-[40vh] lg:h-[calc(100vh-140px)] overflow-hidden">
          <h3 className="text-sm font-medium mb-2 text-gray-700 flex items-center">
            <span className="mr-2">📸</span>
            Comunidad
          </h3>
          <div className="h-[calc(100%-2rem)] overflow-y-auto">
            <PostsFeed user={user} showCreatePost={true} />
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 h-[35vh] sm:h-[40vh] lg:h-[calc(100vh-140px)] overflow-hidden">
          <h3 className="text-sm font-medium mb-2 text-gray-700 flex items-center">
            <span className="mr-2">📊</span>
            Actividad Reciente
          </h3>
          <div className="h-[calc(100%-2rem)] overflow-y-auto">
            <ActivityFeed userId={user?.uid} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default EmployeeDashboard;
