import React, { useState, useEffect } from 'react';
import StatusToggle from '../Common/StatusToggle';
import OffersFeed from './OffersFeed';
import ActivityFeed from '../Common/ActivityFeed';
import { getUserProfile, updateUserStatus } from '../../services/userService';
import { logActivity } from '../../services/activityService';

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

  if (loading) return <div className="text-sm text-gray-500">Cargando perfil...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">

        {/* Panel izquierdo - Perfil */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
          <div className="text-lg font-medium">{user.displayName}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
          <div className="text-sm">
            Estado: <span className={isAvailable ? 'text-green-600' : 'text-red-500'}>
              {isAvailable ? 'Disponible' : 'No Disponible'}
            </span>
          </div>
          <StatusToggle
            user={user}
            currentStatus={isAvailable}
            onStatusChange={handleStatusChange}
          />
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>

        {/* Panel central - Ofertas */}
        <div className="md:col-span-1 bg-white rounded-xl shadow-sm p-4">
          <OffersFeed />
        </div>

        {/* Panel derecho - Actividad */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <ActivityFeed userId={user?.uid} />
        </div>

      </div>
    </div>
  );
}

export default EmployeeDashboard;