import { db } from '../firebase.js';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';

/**
 * Creates a notification in the database.
 * @param {string} userId - The ID of the user to notify.
 * @param {string} type - The type of notification (e.g., 'like', 'comment', 'follow').
 * @param {string} entityId - The ID of the entity related to the notification (e.g., post ID, user ID).
 * @param {string} fromUserId - The ID of the user who triggered the notification.
 */
export const createNotification = async (userId, type, entityId, fromUserId) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      type,
      entityId,
      fromUserId,
      isRead: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating notification: ", error);
  }
};

/**
 * Fetches notifications for a specific user.
 * @param {string} userId - The ID of the user whose notifications to fetch.
 * @returns {Array} - A list of notifications.
 */
export const getNotifications = async (userId) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
