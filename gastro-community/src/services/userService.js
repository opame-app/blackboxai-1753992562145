import { doc, updateDoc, getDoc, setDoc, collection, query, where, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase.js';

export const updateUserStatus = async (userId, isAvailable) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isAvailable,
      lastStatusUpdate: new Date()
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? { uid: userSnap.id, ...userSnap.data() } : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const createUserProfile = async (userId, userData) => {
  try {
    if (!db) {
      throw new Error('Firestore no está configurado correctamente');
    }
    
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      profileComplete: true,
      isPrivate: false,
      followers: [],
      following: [],
      followRequests: []
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    
    // Provide more specific error messages
    if (error.code === 'permission-denied') {
      throw new Error('No tienes permisos para crear el perfil. Verifica las reglas de Firestore.');
    } else if (error.code === 'unavailable') {
      throw new Error('Servicio temporalmente no disponible. Intenta nuevamente.');
    } else if (error.message.includes('Firestore no está configurado')) {
      throw error;
    } else {
      throw new Error('Error al crear el perfil. Intenta nuevamente.');
    }
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const searchUsers = async (searchTerm) => {
  if (!searchTerm.trim()) return [];
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  try {
    const usersRef = collection(db, 'users');
    
    // Firestore no soporta búsquedas 'case-insensitive' nativas o 'contains' de forma eficiente.
    // Esta es una aproximación. Para una búsqueda real, se necesitaría un servicio como Algolia.
    // Aquí buscaremos por 'username' y 'displayName' que empiecen con el término de búsqueda.
    
    const usernameQuery = query(usersRef, 
      where('username', '>=', lowerCaseSearchTerm),
      where('username', '<=', lowerCaseSearchTerm + '\uf8ff')
    );
    
    const displayNameQuery = query(usersRef, 
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', searchTerm + '\uf8ff')
    );

    const [usernameSnapshot, displayNameSnapshot] = await Promise.all([
      getDocs(usernameQuery),
      getDocs(displayNameQuery)
    ]);

    const users = new Map();
    usernameSnapshot.forEach(doc => {
      users.set(doc.id, { uid: doc.id, ...doc.data() });
    });
    displayNameSnapshot.forEach(doc => {
      users.set(doc.id, { uid: doc.id, ...doc.data() });
    });

    return Array.from(users.values());
  } catch (error) {
    console.error("Error searching users: ", error);
    throw error;
  }
};

export const followUser = async (currentUserId, targetUserId) => {
  try {
    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);

    await updateDoc(currentUserRef, {
      following: arrayUnion(targetUserId)
    });

    await updateDoc(targetUserRef, {
      followers: arrayUnion(currentUserId)
    });
  } catch (error) {
    console.error("Error following user: ", error);
    throw error;
  }
};

export const unfollowUser = async (currentUserId, targetUserId) => {
  try {
    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);

    await updateDoc(currentUserRef, {
      following: arrayRemove(targetUserId)
    });

    await updateDoc(targetUserRef, {
      followers: arrayRemove(currentUserId)
    });
  } catch (error) {
    console.error("Error unfollowing user: ", error);
    throw error;
  }
};

export const requestToFollow = async (currentUserId, targetUserId) => {
  try {
    const targetUserRef = doc(db, 'users', targetUserId);
    await updateDoc(targetUserRef, {
      followRequests: arrayUnion(currentUserId)
    });
  } catch (error) {
    console.error("Error sending follow request: ", error);
    throw error;
  }
};

export const cancelFollowRequest = async (currentUserId, targetUserId) => {
  try {
    const targetUserRef = doc(db, 'users', targetUserId);
    await updateDoc(targetUserRef, {
      followRequests: arrayRemove(currentUserId)
    });
  } catch (error) {
    console.error("Error cancelling follow request: ", error);
    throw error;
  }
};

export const acceptFollowRequest = async (currentUserId, requesterId) => {
  try {
    const currentUserRef = doc(db, 'users', currentUserId);
    // Remove the request
    await updateDoc(currentUserRef, {
      followRequests: arrayRemove(requesterId)
    });
    // Add follower/following
    await followUser(requesterId, currentUserId);
  } catch (error) {
    console.error("Error accepting follow request: ", error);
    throw error;
  }
};

export const declineFollowRequest = async (currentUserId, requesterId) => {
  try {
    const currentUserRef = doc(db, 'users', currentUserId);
    await updateDoc(currentUserRef, {
      followRequests: arrayRemove(requesterId)
    });
  } catch (error) {
    console.error("Error declining follow request: ", error);
    throw error;
  }
};
