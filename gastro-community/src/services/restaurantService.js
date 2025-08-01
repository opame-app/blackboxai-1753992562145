import { collection, addDoc, doc, getDoc, getDocs, query, where, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';

export const createRestaurant = async (restaurantData) => {
  try {
    const docRef = await addDoc(collection(db, 'shops'), {
      ...restaurantData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
};

export const getRestaurantById = async (restaurantId) => {
  try {
    const docRef = doc(db, 'shops', restaurantId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Restaurant not found');
    }
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    throw error;
  }
};

export const getPublishedRestaurants = async () => {
  try {
    const q = query(
      collection(db, 'shops'), 
      where('published', '==', true)
    );
    const querySnapshot = await getDocs(q);
    const restaurants = [];
    querySnapshot.forEach((doc) => {
      restaurants.push({ id: doc.id, ...doc.data() });
    });
    return restaurants;
  } catch (error) {
    console.error('Error fetching published restaurants:', error);
    throw error;
  }
};

export const getRestaurantsByOwner = async (ownerId) => {
  try {
    const q = query(
      collection(db, 'shops'), 
      where('ownerId', '==', ownerId)
    );
    const querySnapshot = await getDocs(q);
    const restaurants = [];
    querySnapshot.forEach((doc) => {
      restaurants.push({ id: doc.id, ...doc.data() });
    });
    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurants by owner:', error);
    throw error;
  }
};

export const updateRestaurant = async (restaurantId, updateData) => {
  try {
    const docRef = doc(db, 'shops', restaurantId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
};

export const toggleRestaurantStatus = async (restaurantId, isOpen) => {
  try {
    const docRef = doc(db, 'shops', restaurantId);
    await updateDoc(docRef, {
      openForBusiness: isOpen,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error toggling restaurant status:', error);
    throw error;
  }
};
