import React, { useState, useEffect } from 'react';
import { getNotifications } from '../../services/notificationService.js';
import { getUserProfile } from '../../services/userService.js'; // To get user info
import { Link } from 'react-router-dom';
import PostDetail from '../Posts/PostDetail.js';

const Notifications = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const notifs = await getNotifications(user.uid);
        // Fetch user profiles for each notification
        const populatedNotifs = await Promise.all(
          notifs.map(async (notif) => {
            const fromUser = await getUserProfile(notif.fromUserId);
            return { ...notif, fromUser };
          })
        );
        setNotifications(populatedNotifs);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const getNotificationMessage = (notif) => {
    switch (notif.type) {
      case 'like':
        return (
          <span>
            <Link to={`/profile/${notif.fromUser?.uid}`} className="font-bold">{notif.fromUser?.displayName}</Link>
            {' le dio me gusta a tu publicación.'}
          </span>
        );
      // Add cases for 'comment' and 'follow' later
      default:
        return 'Tienes una nueva notificación.';
    }
  };

  const handleNotificationClick = (notif) => {
    if (notif.type === 'like') {
      setSelectedPostId(notif.entityId);
    }
  };

  if (loading) {
    return <div>Cargando notificaciones...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>
      {notifications.length === 0 ? (
        <p>No tienes notificaciones nuevas.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notif) => (
            <li 
              key={notif.id} 
              className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50"
              onClick={() => handleNotificationClick(notif)}
            >
              {getNotificationMessage(notif)}
              <span className="text-sm text-gray-500 ml-2">
                {new Date(notif.createdAt?.toDate()).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
      
      {/* Post Detail Modal */}
      {selectedPostId && (
        <PostDetail 
          postId={selectedPostId} 
          onClose={() => setSelectedPostId(null)} 
        />
      )}
    </div>
  );
};

export default Notifications;
