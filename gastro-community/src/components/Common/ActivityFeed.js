import React, { useState, useEffect } from 'react';
import { getUserActivities } from '../../services/activityService.js';

function ActivityFeed({ userId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const userActivities = await getUserActivities(userId);
        // Limit to 4 most recent activities for minimalist view
        setActivities(userActivities.slice(0, 4));
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchActivities();
    }
  }, [userId]);

  if (loading) return <div className="text-xs text-gray-500">Cargando...</div>;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.toDate());
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays}d`;
    }
  };

  return (
    <div className="space-y-1 sm:space-y-2">
      {activities.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-4">No hay actividad reciente</p>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} className="border-l-2 border-blue-200 pl-2 sm:pl-3 py-1 sm:py-2">
            <div className="text-xs text-gray-700 mb-1 leading-tight">
              {activity.description}
            </div>
            <div className="text-xs text-gray-400">
              {formatTimestamp(activity.timestamp)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ActivityFeed;
