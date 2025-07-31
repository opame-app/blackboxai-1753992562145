import React, { useState, useEffect } from 'react';
import { getUserActivities } from '../../services/activityService';

function ActivityFeed({ userId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const userActivities = await getUserActivities(userId);
        setActivities(userActivities);
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

  if (loading) return <div>Cargando actividad...</div>;

  return (
    <div className="activity-feed">
      <h3>Actividad Reciente</h3>
      {activities.length === 0 ? (
        <p>No hay actividad reciente</p>
      ) : (
        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-description">{activity.description}</div>
              <div className="activity-timestamp">
                {new Date(activity.timestamp.toDate()).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityFeed;
