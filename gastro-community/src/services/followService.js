import { db } from '../firebase.js';
import { doc, setDoc, deleteDoc, getDoc, getDocs, collection, writeBatch } from 'firebase/firestore';

// Follow a user
export const followUser = async (currentUserId, targetUserId) => {
  const batch = writeBatch(db);

  const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId);
  batch.set(followingRef, { userId: targetUserId });

  const followersRef = doc(db, 'users', targetUserId, 'followers', currentUserId);
  batch.set(followersRef, { userId: currentUserId });

  await batch.commit();
};

// Unfollow a user
export const unfollowUser = async (currentUserId, targetUserId) => {
  const batch = writeBatch(db);

  const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId);
  batch.delete(followingRef);

  const followersRef = doc(db, 'users', targetUserId, 'followers', currentUserId);
  batch.delete(followersRef);

  await batch.commit();
};

// Get a list of users someone is following
export const getFollowing = async (userId) => {
  const followingCol = collection(db, 'users', userId, 'following');
  const snapshot = await getDocs(followingCol);
  return snapshot.docs.map(doc => doc.data().userId);
};

// Get a list of a user's followers
export const getFollowers = async (userId) => {
  const followersCol = collection(db, 'users', userId, 'followers');
  const snapshot = await getDocs(followersCol);
  return snapshot.docs.map(doc => doc.data().userId);
};

// Check if a user is following another
export const checkIfFollowing = async (currentUserId, targetUserId) => {
  const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId);
  const docSnap = await getDoc(followingRef);
  return docSnap.exists();
};

// Get follower and following counts
export const getFollowCounts = async (userId) => {
    const followingCol = collection(db, 'users', userId, 'following');
    const followersCol = collection(db, 'users', userId, 'followers');

    const followingSnapshot = await getDocs(followingCol);
    const followersSnapshot = await getDocs(followersCol);

    return {
        followingCount: followingSnapshot.size,
        followersCount: followersSnapshot.size,
    };
};
